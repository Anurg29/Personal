import json
from typing import AsyncGenerator
import httpx

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain.tools import tool

from config import GROQ_API_KEY
from services.max_rag import max_rag_memory
from services.max_pipeline import MaxAssistantPipeline

router = APIRouter(tags=["chat"])

JARVIS_SYSTEM_PROMPT = """You are M.A.X. (My Adaptive eXecutive), the personal AI operating system for Anurag Rokade.

Your traits:
- Personal, context-aware, and adaptive.
- Prefer short direct answers first, then expand if needed.
- Use tools whenever the user asks for live personal data (email, drive, github, market).
- Use retrieved memory context to personalize answers and decisions.
- If the user asks to remember something, confirm and suggest using memory save endpoint.

Operational Rules:
- For "latest email", "my inbox", "recent mail": use Gmail tools.
- For "open folder", "find file in drive", "drive folder": use Drive tools and return clickable link.
- If a tool fails due to auth, clearly ask user to connect Google account in a single sentence.
- Never fabricate personal data.

Keep responses well-formatted with markdown when helpful."""

GROQ_MODELS = [
    "llama3-70b-8192",
    "llama3-8b-8192",
    "mixtral-8x7b-32768"
]

# Market and assistant tools for LangChain
@tool
def get_market_overview() -> dict:
    """Get current market overview including global indices, commodities, crypto, and currencies.
    Returns comprehensive market data with values and percentage changes.
    Use this when asked about market conditions, how markets are performing, or general market status."""
    try:
        response = httpx.get("http://localhost:8000/api/market/overview", timeout=10.0)
        if response.status_code == 200:
            data = response.json()
            return {"success": True, "data": data.get("data", {})}
        return {"success": False, "error": f"API returned {response.status_code}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@tool
def get_market_condition() -> dict:
    """Analyze overall market condition (Bull/Bear/Neutral) with sentiment analysis.
    Includes VIX (volatility index), technical indicators for major indices, and market recommendation.
    Use this when asked whether to invest, market timing, or investment strategy."""
    try:
        response = httpx.get("http://localhost:8000/api/market/condition", timeout=10.0)
        if response.status_code == 200:
            data = response.json()
            return {"success": True, "data": data.get("data", {})}
        return {"success": False, "error": f"API returned {response.status_code}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@tool
def get_stock_info(symbol: str) -> dict:
    """Get detailed information about a stock including current price, market cap, P/E ratio, sector, etc.
    Symbol should be in standard format (e.g., 'AAPL', 'TSLA', 'RELIANCE.NS' for Indian stocks).
    Use this when asked about specific companies or stock prices."""
    try:
        response = httpx.get(f"http://localhost:8000/api/market/stock/{symbol}", timeout=10.0)
        if response.status_code == 200:
            data = response.json()
            return {"success": True, "data": data.get("data", {})}
        return {"success": False, "error": f"Stock {symbol} not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@tool
def get_technical_analysis(symbol: str) -> dict:
    """Get technical analysis for a stock including RSI, MACD, moving averages, trend, support/resistance levels.
    Provides trading signals and technical indicators.
    Use this when asked about technical outlook, entry/exit points, or trading decisions."""
    try:
        response = httpx.get(f"http://localhost:8000/api/market/technical/{symbol}", timeout=10.0)
        if response.status_code == 200:
            data = response.json()
            return {"success": True, "data": data.get("data", {})}
        return {"success": False, "error": f"No data for {symbol}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@tool
def get_portfolio_summary() -> dict:
    """Get complete portfolio summary including total value, invested amount, P&L, asset allocation, sector breakdown.
    Shows top gainers and losers in the portfolio.
    Use this when asked 'How's my portfolio?', 'Show my investments', or portfolio performance."""
    try:
        response = httpx.get("http://localhost:8000/api/portfolio", timeout=10.0)
        if response.status_code == 200:
            data = response.json()
            return {"success": True, "data": data.get("data", {})}
        return {"success": False, "error": "Portfolio data not available"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@tool
def get_portfolio_analysis() -> dict:
    """Get AI-powered portfolio health analysis with diversification score, concentration risk, and actionable insights.
    Provides personalized recommendations for portfolio improvement.
    Use this when asked for portfolio review, investment advice, or how to improve portfolio."""
    try:
        response = httpx.get("http://localhost:8000/api/portfolio/analysis", timeout=10.0)
        if response.status_code == 200:
            data = response.json()
            return {"success": True, "data": data.get("data", {})}
        return {"success": False, "error": "Portfolio analysis not available"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@tool
def get_market_news(query: str = "stock market") -> list:
    """Get latest market news articles. Query can be specific topic, stock, or general 'market news'.
    Returns recent articles with titles, descriptions, and sources.
    Use this when asked about market news, what's happening in markets, or specific company news."""
    try:
        url = f"http://localhost:8000/api/market/news?query={query}&num_articles=10"
        response = httpx.get(url, timeout=10.0)
        if response.status_code == 200:
            data = response.json()
            return data.get("data", [])
        return []
    except Exception as e:
        return []

@tool
def get_github_activity() -> dict:
    """Fetch Anurag's latest GitHub profile, public repositories, and recent push events/commits.
    Use this when the user asks about their recent coding activity, their GitHub account, or what they worked on recently."""
    try:
        response = httpx.get("http://localhost:8000/api/github", timeout=10.0)
        if response.status_code == 200:
            data = response.json()
            return {"success": True, "data": data}
        return {"success": False, "error": f"API returned {response.status_code}"}
    except Exception as e:
        return {"success": False, "error": str(e)}


@tool
def get_latest_email(max_results: int = 1) -> dict:
    """Get latest emails from Gmail inbox. Use this for queries like 'what is my latest email'."""
    try:
        response = httpx.get(
            "http://localhost:8000/api/google/gmail/inbox",
            params={"max_results": max_results},
            timeout=15.0,
        )
        if response.status_code == 200:
            data = response.json()
            emails = data.get("emails", [])
            return {"success": True, "emails": emails, "count": len(emails)}
        return {"success": False, "error": f"Gmail API returned {response.status_code}"}
    except Exception as e:
        return {"success": False, "error": str(e)}


@tool
def search_drive_folders(query: str, max_results: int = 10) -> dict:
    """Search Google Drive folders by name. Use this when user asks to open/find a folder in Drive."""
    try:
        safe_query = query.replace("'", "\\'")
        drive_query = f"mimeType='application/vnd.google-apps.folder' and name contains '{safe_query}'"
        response = httpx.get(
            "http://localhost:8000/api/google/drive/files",
            params={"max_results": max_results, "query": drive_query},
            timeout=15.0,
        )
        if response.status_code == 200:
            data = response.json()
            return {"success": True, "folders": data.get("files", [])}
        return {"success": False, "error": f"Drive API returned {response.status_code}"}
    except Exception as e:
        return {"success": False, "error": str(e)}


@tool
def open_drive_folder(folder_name: str) -> dict:
    """Find a Google Drive folder and return an openable web link."""
    result = search_drive_folders.invoke({"query": folder_name, "max_results": 5})
    if not result.get("success"):
        return result

    folders = result.get("folders", [])
    if not folders:
        return {"success": False, "error": f"No folder found matching '{folder_name}'"}

    first = folders[0]
    return {
        "success": True,
        "folder": {
            "id": first.get("id"),
            "name": first.get("name"),
            "webViewLink": first.get("webViewLink"),
            "modifiedTime": first.get("modifiedTime"),
        },
    }


@tool
def list_recent_drive_folders(max_results: int = 10) -> dict:
    """List recently modified folders in Google Drive."""
    try:
        drive_query = "mimeType='application/vnd.google-apps.folder'"
        response = httpx.get(
            "http://localhost:8000/api/google/drive/files",
            params={"max_results": max_results, "query": drive_query},
            timeout=15.0,
        )
        if response.status_code == 200:
            data = response.json()
            return {"success": True, "folders": data.get("files", [])}
        return {"success": False, "error": f"Drive API returned {response.status_code}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

MARKET_TOOLS = [
    get_market_overview,
    get_market_condition,
    get_stock_info,
    get_technical_analysis,
    get_portfolio_summary,
    get_portfolio_analysis,
    get_market_news,
    get_github_activity,
    get_latest_email,
    search_drive_folders,
    open_drive_folder,
    list_recent_drive_folders,
]

max_pipeline = MaxAssistantPipeline(
    api_key=GROQ_API_KEY,
    model_ids=GROQ_MODELS,
    system_prompt=JARVIS_SYSTEM_PROMPT,
    tools=MARKET_TOOLS,
    memory_service=max_rag_memory,
)


class ChatMessageIn(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessageIn]
    use_memory: bool = True


class MemoryAddRequest(BaseModel):
    content: str
    category: str = "general"
    source: str = "manual"


class AutoIngestRequest(BaseModel):
    ingest_latest_emails: bool = True
    ingest_drive_folders: bool = True
    email_count: int = 5
    folder_count: int = 10


@router.post("/chat")
async def chat_stream(req: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")

    try:
        final_text = await max_pipeline.run(
            messages=[{"role": m.role, "content": m.content} for m in req.messages],
            use_memory=req.use_memory,
        )
        return StreamingResponse(
            _stream_text(final_text),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {e}")

@router.post("/chat/sync")
async def chat_sync(req: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")

    try:
        final_text = await max_pipeline.run(
            messages=[{"role": m.role, "content": m.content} for m in req.messages],
            use_memory=req.use_memory,
        )
        return {"success": True, "reply": final_text}
    except Exception as e:
        return {"success": False, "reply": f"Pipeline failed: {e}"}


@router.post("/chat/memory")
async def add_memory(req: MemoryAddRequest):
    try:
        item = max_rag_memory.add_memory(
            content=req.content,
            category=req.category,
            source=req.source,
        )
        return {"success": True, "data": item}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Memory add failed: {e}")


@router.get("/chat/memory")
async def list_memory(limit: int = 50):
    try:
        return {"success": True, "data": max_rag_memory.list_memories(limit=limit)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Memory list failed: {e}")


@router.delete("/chat/memory/{memory_id}")
async def delete_memory(memory_id: str):
    try:
        max_rag_memory.delete_memory(memory_id)
        return {"success": True, "message": "Memory deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Memory delete failed: {e}")


@router.post("/chat/pipeline/auto-ingest")
async def auto_ingest_personal_data(req: AutoIngestRequest):
    """Automated ingestion pipeline: sync latest email and drive folder metadata into vector memory."""
    ingested = []
    skipped = []

    if req.ingest_latest_emails:
        email_result = get_latest_email.invoke({"max_results": max(1, min(req.email_count, 20))})
        if email_result.get("success"):
            for email in email_result.get("emails", []):
                text = (
                    f"Email from {email.get('from', 'unknown')} with subject '{email.get('subject', '')}'. "
                    f"Snippet: {email.get('snippet', '')}. Date: {email.get('date', '')}"
                )
                item = max_rag_memory.add_memory(text, category="gmail", source="auto_ingest")
                ingested.append(item["id"])
        else:
            skipped.append({"source": "gmail", "reason": email_result.get("error", "unknown")})

    if req.ingest_drive_folders:
        folder_result = list_recent_drive_folders.invoke({"max_results": max(1, min(req.folder_count, 30))})
        if folder_result.get("success"):
            for folder in folder_result.get("folders", []):
                text = (
                    f"Drive folder '{folder.get('name', '')}' "
                    f"last modified {folder.get('modifiedTime', '')}. "
                    f"Open link: {folder.get('webViewLink', '')}"
                )
                item = max_rag_memory.add_memory(text, category="drive", source="auto_ingest")
                ingested.append(item["id"])
        else:
            skipped.append({"source": "drive", "reason": folder_result.get("error", "unknown")})

    return {
        "success": True,
        "pipeline": "auto_ingest",
        "ingested_count": len(ingested),
        "ingested_memory_ids": ingested,
        "skipped": skipped,
    }


async def _stream_text(text: str) -> AsyncGenerator[bytes, None]:
    """Stream text in OpenAI-compatible SSE token chunks."""
    try:
        for token in text.split(" "):
            if token:
                data = {
                    "choices": [{"delta": {"content": token + " "}, "index": 0}]
                }
                yield f"data: {json.dumps(data)}\n\n".encode()
        yield b"data: [DONE]\n\n"
    except Exception as e:
        error_data = {"choices": [{"delta": {"content": f"\n\n*Connection error: {e}*"}, "index": 0}]}
        yield f"data: {json.dumps(error_data)}\n\n".encode()
        yield b"data: [DONE]\n\n"
