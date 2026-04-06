import json
from typing import AsyncGenerator
import httpx

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq
from langchain.tools import tool

from config import GROQ_API_KEY

router = APIRouter(tags=["chat"])

JARVIS_SYSTEM_PROMPT = """You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), a sophisticated AI assistant created for Anurag Rokade. You are modeled after the iconic AI from Iron Man — polished, professional, highly capable, and subtly witty.

Your traits:
- Address the user respectfully, occasionally using "sir" naturally (not every message)
- Be concise yet thorough in technical responses
- Show personality — dry humor is welcome, but always professional
- You are knowledgeable in software engineering, AI/ML, web development, academics, AND FINANCIAL MARKETS
- When asked about yourself, you are Jarvis, the personal AI assistant running on Anurag's Personal Hub
- Help with code, explain concepts, brainstorm ideas, and assist with any task
- You have REAL-TIME ACCESS to market data, portfolio information, and financial analysis tools
- Provide market insights, portfolio analysis, and investment education (NOT financial advice)
- Always include appropriate disclaimers when discussing investments

Market Capabilities:
- Track domestic (India) and international markets (US, Europe, Asia)
- Monitor stocks, ETFs, cryptocurrencies, commodities, and mutual funds
- Analyze portfolio performance and provide health checks
- Fetch real-time prices, technical indicators, and market news
- Assess market conditions (Bull/Bear/Neutral) and sentiment

Keep responses well-formatted with markdown when appropriate. Use data tools to provide accurate, up-to-date information."""

GROQ_MODELS = [
    "llama3-70b-8192",
    "llama3-8b-8192",
    "mixtral-8x7b-32768"
]

# Market data tools for LangChain
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

MARKET_TOOLS = [
    get_market_overview,
    get_market_condition,
    get_stock_info,
    get_technical_analysis,
    get_portfolio_summary,
    get_portfolio_analysis,
    get_market_news,
    get_github_activity,
]


def _build_llm(model_id: str) -> ChatGroq:
    chat = ChatGroq(
        model_name=model_id,
        api_key=GROQ_API_KEY,
        temperature=0.7,
        max_tokens=1024
    )
    # Bind tools to LLM
    chat = chat.bind_tools(MARKET_TOOLS)
    return chat


class ChatMessageIn(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessageIn]


def _to_langchain_messages(messages: list[ChatMessageIn]):
    lc_messages = [SystemMessage(content=JARVIS_SYSTEM_PROMPT)]
    for m in messages:
        if m.role == "user":
            lc_messages.append(HumanMessage(content=m.content))
        elif m.role == "assistant":
            lc_messages.append(AIMessage(content=m.content))
    return lc_messages


@router.post("/chat")
async def chat_stream(req: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")

    lc_messages = _to_langchain_messages(req.messages)

    for model_id in GROQ_MODELS:
        try:
            chat = _build_llm(model_id)
            return StreamingResponse(
                _stream_langchain(chat, lc_messages),
                media_type="text/event-stream",
                headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
            )
        except Exception:
            continue

    raise HTTPException(
        status_code=503,
        detail="AI models are currently offline. Please try again.",
    )


async def _stream_langchain(
    chat: ChatGroq, messages: list
) -> AsyncGenerator[bytes, None]:
    """Stream LangChain response in OpenAI-compatible SSE format."""
    try:
        async for chunk in chat.astream(messages):
            token = chunk.content
            if token:
                data = {
                    "choices": [{"delta": {"content": token}, "index": 0}]
                }
                yield f"data: {json.dumps(data)}\n\n".encode()
        yield b"data: [DONE]\n\n"
    except Exception as e:
        error_data = {"choices": [{"delta": {"content": f"\n\n*Connection error: {e}*"}, "index": 0}]}
        yield f"data: {json.dumps(error_data)}\n\n".encode()
        yield b"data: [DONE]\n\n"
