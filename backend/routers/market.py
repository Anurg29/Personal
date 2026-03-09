"""
Market Router - API endpoints for market data and portfolio management
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from database import get_db, HoldingType
from tools.market_tools import market_tools
from tools.portfolio_tools import get_portfolio_manager, PortfolioManager
from datetime import datetime

router = APIRouter(prefix="/api", tags=["market"])


# Request/Response Models
class HoldingRequest(BaseModel):
    symbol: str
    name: str
    holding_type: str  # stock, etf, crypto, mutual_fund, commodity
    quantity: float
    average_price: float
    currency: str = "USD"
    sector: Optional[str] = None
    exchange: Optional[str] = None


class TransactionRequest(BaseModel):
    symbol: str
    transaction_type: str  # BUY or SELL
    quantity: float
    price: float


class WatchlistRequest(BaseModel):
    symbol: str
    name: str
    holding_type: Optional[str] = None


# Market Data Endpoints
@router.get("/market/overview")
async def get_market_overview():
    """Get comprehensive market overview including indices, commodities, crypto, and currencies"""
    try:
        overview = market_tools.get_market_overview()
        return {
            "success": True,
            "data": overview
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market/condition")
async def get_market_condition():
    """Analyze overall market condition"""
    try:
        condition = market_tools.analyze_market_condition()
        return {
            "success": True,
            "data": condition
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market/stock/{symbol}")
async def get_stock_info(symbol: str):
    """Get detailed stock information"""
    try:
        info = market_tools.get_stock_info(symbol)
        if "error" in info:
            raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
        
        return {
            "success": True,
            "data": info
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market/technical/{symbol}")
async def get_technical_analysis(symbol: str):
    """Get technical analysis for a stock"""
    try:
        analysis = market_tools.calculate_technical_indicators(symbol)
        if "error" in analysis:
            raise HTTPException(status_code=404, detail=f"No data available for {symbol}")
        
        return {
            "success": True,
            "data": analysis
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market/news")
async def get_market_news(
    query: str = Query(default="stock market", description="News search query"),
    num_articles: int = Query(default=10, ge=1, le=50)
):
    """Get market news"""
    try:
        news = market_tools.get_market_news(query, num_articles)
        return {
            "success": True,
            "data": news
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market/search")
async def search_stocks(q: str = Query(..., min_length=1, description="Search query")):
    """Search for stocks by symbol or name"""
    try:
        results = market_tools.search_symbol(q)
        return {
            "success": True,
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market/gainers-losers")
async def get_gainers_losers(market: str = "US", count: int = 5):
    """Get top gainers and losers"""
    try:
        data = market_tools.get_gainers_losers(market, count)
        return {
            "success": True,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Portfolio Endpoints
@router.get("/portfolio")
async def get_portfolio(db: Session = Depends(get_db)):
    """Get complete portfolio summary"""
    try:
        pm = get_portfolio_manager(db)
        summary = pm.get_portfolio_summary()
        
        return {
            "success": True,
            "data": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/portfolio/holdings")
async def get_holdings(db: Session = Depends(get_db)):
    """Get all portfolio holdings"""
    try:
        pm = get_portfolio_manager(db)
        holdings = pm.get_all_holdings()
        
        # Convert to dict
        holdings_data = []
        for h in holdings:
            holdings_data.append({
                "id": h.id,
                "symbol": h.symbol,
                "name": h.name,
                "holding_type": h.holding_type.value,
                "quantity": h.quantity,
                "average_price": h.average_price,
                "current_price": h.current_price,
                "current_value": h.current_value,
                "invested_value": h.invested_value,
                "pnl": h.pnl,
                "pnl_percentage": h.pnl_percentage,
                "currency": h.currency,
                "sector": h.sector,
            })
        
        return {
            "success": True,
            "data": holdings_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/portfolio/add")
async def add_holding(request: HoldingRequest, db: Session = Depends(get_db)):
    """Add or update a portfolio holding"""
    try:
        pm = get_portfolio_manager(db)
        
        # Convert holding_type string to enum
        try:
            holding_type = HoldingType(request.holding_type.lower())
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid holding type: {request.holding_type}")
        
        holding = pm.add_holding(
            symbol=request.symbol,
            name=request.name,
            holding_type=holding_type,
            quantity=request.quantity,
            average_price=request.average_price,
            currency=request.currency,
            sector=request.sector,
            exchange=request.exchange,
        )
        
        return {
            "success": True,
            "data": {
                "symbol": holding.symbol,
                "quantity": holding.quantity,
                "average_price": holding.average_price,
            },
            "message": f"Added {holding.quantity} shares of {holding.symbol}"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/portfolio/update-quantity")
async def update_quantity(request: TransactionRequest, db: Session = Depends(get_db)):
    """Update holding quantity (for buy/sell transactions)"""
    try:
        pm = get_portfolio_manager(db)
        
        holding = pm.update_quantity(
            symbol=request.symbol,
            quantity=request.quantity,
            price=request.price,
            transaction_type=request.transaction_type.upper(),
        )
        
        if not holding:
            raise HTTPException(status_code=404, detail=f"Holding {request.symbol} not found")
        
        return {
            "success": True,
            "data": {
                "symbol": holding.symbol,
                "quantity": holding.quantity,
                "average_price": holding.average_price,
            },
            "message": f"{request.transaction_type} order executed for {request.quantity} shares of {request.symbol}"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/portfolio/remove/{symbol}")
async def remove_holding(symbol: str, db: Session = Depends(get_db)):
    """Remove a holding from portfolio"""
    try:
        pm = get_portfolio_manager(db)
        success = pm.remove_holding(symbol)
        
        if not success:
            raise HTTPException(status_code=404, detail=f"Holding {symbol} not found")
        
        return {
            "success": True,
            "message": f"Removed {symbol} from portfolio"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/portfolio/analysis")
async def analyze_portfolio(db: Session = Depends(get_db)):
    """Analyze portfolio health and get insights"""
    try:
        pm = get_portfolio_manager(db)
        analysis = pm.analyze_portfolio_health()
        
        return {
            "success": True,
            "data": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/portfolio/transactions")
async def get_transactions(
    db: Session = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=100)
):
    """Get recent transactions"""
    try:
        pm = get_portfolio_manager(db)
        transactions = pm.get_transactions(limit)
        
        transactions_data = [
            {
                "id": t.id,
                "symbol": t.symbol,
                "transaction_type": t.transaction_type,
                "quantity": t.quantity,
                "price": t.price,
                "total_amount": t.total_amount,
                "transaction_date": t.transaction_date.isoformat(),
                "notes": t.notes,
            }
            for t in transactions
        ]
        
        return {
            "success": True,
            "data": transactions_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Watchlist Endpoints
@router.get("/watchlist")
async def get_watchlist(db: Session = Depends(get_db)):
    """Get watchlist items"""
    try:
        pm = get_portfolio_manager(db)
        items = pm.get_watchlist()
        
        items_data = [
            {
                "id": item.id,
                "symbol": item.symbol,
                "name": item.name,
                "holding_type": item.holding_type.value if item.holding_type else None,
                "added_at": item.added_at.isoformat(),
            }
            for item in items
        ]
        
        return {
            "success": True,
            "data": items_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/watchlist/add")
async def add_to_watchlist(request: WatchlistRequest, db: Session = Depends(get_db)):
    """Add item to watchlist"""
    try:
        pm = get_portfolio_manager(db)
        
        holding_type = None
        if request.holding_type:
            try:
                holding_type = HoldingType(request.holding_type.lower())
            except ValueError:
                pass  # Ignore invalid types
        
        item = pm.add_to_watchlist(
            symbol=request.symbol,
            name=request.name,
            holding_type=holding_type,
        )
        
        return {
            "success": True,
            "data": {
                "symbol": item.symbol,
                "name": item.name,
            },
            "message": f"Added {item.symbol} to watchlist"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/watchlist/remove/{symbol}")
async def remove_from_watchlist(symbol: str, db: Session = Depends(get_db)):
    """Remove item from watchlist"""
    try:
        pm = get_portfolio_manager(db)
        success = pm.remove_from_watchlist(symbol)
        
        if not success:
            raise HTTPException(status_code=404, detail=f"Watchlist item {symbol} not found")
        
        return {
            "success": True,
            "message": f"Removed {symbol} from watchlist"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# AI Insights Endpoint
@router.get("/market/ai-insights")
async def get_ai_insights(db: Session = Depends(get_db)):
    """Get AI-powered market and portfolio insights"""
    try:
        # Get market condition
        market_condition = market_tools.analyze_market_condition()
        
        # Get portfolio analysis
        pm = get_portfolio_manager(db)
        portfolio_analysis = pm.analyze_portfolio_health()
        
        # Combine insights
        combined_insights = {
            "market_overview": {
                "condition": market_condition.get("condition"),
                "sentiment": market_condition.get("sentiment"),
                "vix": market_condition.get("vix"),
                "recommendation": market_condition.get("recommendation"),
            },
            "portfolio_health": {
                "diversification_score": portfolio_analysis.get("diversification_score"),
                "performance": portfolio_analysis.get("performance"),
                "concentration_risk": portfolio_analysis.get("concentration_risk"),
            },
            "actionable_insights": portfolio_analysis.get("insights"),
            "recommendations": portfolio_analysis.get("recommendations"),
            "top_holdings_analysis": portfolio_analysis.get("top_holdings_analysis"),
            "timestamp": datetime.now().isoformat(),
        }
        
        return {
            "success": True,
            "data": combined_insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
