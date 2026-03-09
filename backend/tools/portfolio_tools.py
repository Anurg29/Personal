"""
Portfolio Management Tools - Track and analyze investment portfolio
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import PortfolioHolding, Watchlist, Transaction, HoldingType, get_db
from tools.market_tools import market_tools
from datetime import datetime
from typing import Dict, List, Optional


class PortfolioManager:
    """Manage portfolio holdings and calculations"""

    def __init__(self, db: Session):
        self.db = db
        self.market_tools = market_tools

    def add_holding(
        self,
        symbol: str,
        name: str,
        holding_type: HoldingType,
        quantity: float,
        average_price: float,
        currency: str = "USD",
        sector: Optional[str] = None,
        exchange: Optional[str] = None,
    ) -> PortfolioHolding:
        """Add or update a portfolio holding"""
        
        # Check if holding already exists
        existing = self.db.query(PortfolioHolding).filter(
            PortfolioHolding.symbol == symbol
        ).first()

        if existing:
            # Update existing holding (average down/up)
            total_quantity = existing.quantity + quantity
            total_cost = (existing.quantity * existing.average_price) + (quantity * average_price)
            new_average = total_cost / total_quantity if total_quantity > 0 else average_price
            
            existing.quantity = total_quantity
            existing.average_price = new_average
            existing.updated_at = datetime.utcnow()
            holding = existing
        else:
            # Create new holding
            holding = PortfolioHolding(
                symbol=symbol,
                name=name,
                holding_type=holding_type,
                quantity=quantity,
                average_price=average_price,
                currency=currency,
                sector=sector,
                exchange=exchange,
            )
            self.db.add(holding)

        # Update current price
        self._update_current_price(holding)
        
        self.db.commit()
        self.db.refresh(holding)
        return holding

    def remove_holding(self, symbol: str) -> bool:
        """Remove a holding from portfolio"""
        holding = self.db.query(PortfolioHolding).filter(
            PortfolioHolding.symbol == symbol
        ).first()

        if holding:
            self.db.delete(holding)
            self.db.commit()
            return True
        return False

    def update_quantity(
        self, 
        symbol: str, 
        quantity: float, 
        price: float,
        transaction_type: str = "BUY"
    ) -> Optional[PortfolioHolding]:
        """Update quantity for a holding (for buy/sell transactions)"""
        holding = self.db.query(PortfolioHolding).filter(
            PortfolioHolding.symbol == symbol
        ).first()

        if not holding:
            return None

        if transaction_type == "BUY":
            total_cost = (holding.quantity * holding.average_price) + (quantity * price)
            holding.quantity += quantity
            holding.average_price = total_cost / holding.quantity if holding.quantity > 0 else price
        elif transaction_type == "SELL":
            holding.quantity -= quantity
            # Average price remains same when selling
        
        holding.updated_at = datetime.utcnow()
        self._update_current_price(holding)
        
        # Record transaction
        transaction = Transaction(
            symbol=symbol,
            transaction_type=transaction_type,
            quantity=quantity,
            price=price,
            total_amount=quantity * price,
        )
        self.db.add(transaction)
        
        self.db.commit()
        self.db.refresh(holding)
        return holding

    def get_all_holdings(self) -> List[PortfolioHolding]:
        """Get all portfolio holdings with updated prices"""
        holdings = self.db.query(PortfolioHolding).all()
        
        # Update current prices
        for holding in holdings:
            self._update_current_price(holding)
        
        self.db.commit()
        return holdings

    def get_portfolio_summary(self) -> Dict:
        """Get comprehensive portfolio summary"""
        holdings = self.get_all_holdings()
        
        if not holdings:
            return {
                "total_value": 0,
                "invested_value": 0,
                "total_pnl": 0,
                "total_pnl_percent": 0,
                "holdings_count": 0,
                "allocation": {},
                "sector_allocation": {},
                "top_gainers": [],
                "top_losers": [],
            }

        total_value = sum(h.current_value or 0 for h in holdings)
        total_invested = sum(h.invested_value or 0 for h in holdings)
        total_pnl = total_value - total_invested
        total_pnl_percent = ((total_value - total_invested) / total_invested * 100) if total_invested > 0 else 0

        # Asset allocation by type
        allocation = {}
        for holding in holdings:
            asset_type = holding.holding_type.value
            if asset_type not in allocation:
                allocation[asset_type] = 0
            allocation[asset_type] += holding.current_value or 0

        # Convert to percentages
        allocation_percent = {
            k: round((v / total_value * 100) if total_value > 0 else 0, 2)
            for k, v in allocation.items()
        }

        # Sector allocation
        sector_allocation = {}
        for holding in holdings:
            sector = holding.sector or "Other"
            if sector not in sector_allocation:
                sector_allocation[sector] = 0
            sector_allocation[sector] += holding.current_value or 0

        sector_percent = {
            k: round((v / total_value * 100) if total_value > 0 else 0, 2)
            for k, v in sector_allocation.items()
        }

        # Top gainers and losers
        holdings_with_pnl = [h for h in holdings if h.pnl is not None]
        top_gainers = sorted(holdings_with_pnl, key=lambda x: x.pnl_percentage, reverse=True)[:5]
        top_losers = sorted(holdings_with_pnl, key=lambda x: x.pnl_percentage)[:5]

        return {
            "total_value": round(total_value, 2),
            "invested_value": round(total_invested, 2),
            "total_pnl": round(total_pnl, 2),
            "total_pnl_percent": round(total_pnl_percent, 2),
            "holdings_count": len(holdings),
            "allocation": allocation_percent,
            "sector_allocation": sector_percent,
            "top_gainers": [
                {
                    "symbol": h.symbol,
                    "name": h.name,
                    "pnl_percent": round(h.pnl_percentage, 2),
                    "pnl": round(h.pnl, 2),
                }
                for h in top_gainers
            ],
            "top_losers": [
                {
                    "symbol": h.symbol,
                    "name": h.name,
                    "pnl_percent": round(h.pnl_percentage, 2),
                    "pnl": round(h.pnl, 2),
                }
                for h in top_losers
            ],
            "timestamp": datetime.now().isoformat(),
        }

    def _update_current_price(self, holding: PortfolioHolding):
        """Update current price for a holding"""
        try:
            # Map holding type to Yahoo Finance symbol format
            if holding.holding_type == HoldingType.CRYPTO:
                symbol = f"{holding.symbol}-USD"
            else:
                symbol = holding.symbol

            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="1d")
            
            if not hist.empty:
                holding.current_price = hist['Close'].iloc[-1]
                holding.calculate_metrics()
        except Exception as e:
            print(f"Error updating price for {holding.symbol}: {e}")

    def get_watchlist(self) -> List[Watchlist]:
        """Get watchlist items"""
        return self.db.query(Watchlist).all()

    def add_to_watchlist(self, symbol: str, name: str, holding_type: Optional[HoldingType] = None) -> Watchlist:
        """Add item to watchlist"""
        existing = self.db.query(Watchlist).filter(
            Watchlist.symbol == symbol
        ).first()

        if existing:
            return existing

        watchlist_item = Watchlist(
            symbol=symbol,
            name=name,
            holding_type=holding_type,
        )
        self.db.add(watchlist_item)
        self.db.commit()
        self.db.refresh(watchlist_item)
        return watchlist_item

    def remove_from_watchlist(self, symbol: str) -> bool:
        """Remove item from watchlist"""
        item = self.db.query(Watchlist).filter(
            Watchlist.symbol == symbol
        ).first()

        if item:
            self.db.delete(item)
            self.db.commit()
            return True
        return False

    def get_transactions(self, limit: int = 20) -> List[Transaction]:
        """Get recent transactions"""
        return self.db.query(Transaction).order_by(
            Transaction.transaction_date.desc()
        ).limit(limit).all()

    def analyze_portfolio_health(self) -> Dict:
        """Analyze portfolio health and provide insights"""
        summary = self.get_portfolio_summary()
        holdings = self.get_all_holdings()

        if not holdings:
            return {"error": "No holdings in portfolio"}

        # Diversification score (0-100)
        num_holdings = len(holdings)
        diversification_score = min(100, num_holdings * 10)  # 10 holdings = 100 score

        # Check concentration risk
        largest_position = max(h.current_value for h in holdings if h.current_value)
        concentration = (largest_position / summary["total_value"] * 100) if summary["total_value"] > 0 else 0
        
        if concentration > 50:
            concentration_risk = "High - Single position > 50%"
            diversification_score -= 30
        elif concentration > 30:
            concentration_risk = "Medium - Single position > 30%"
            diversification_score -= 15
        else:
            concentration_risk = "Low - Well diversified"

        # Performance analysis
        performance = "Strong" if summary["total_pnl_percent"] > 10 else \
                     "Good" if summary["total_pnl_percent"] > 0 else \
                     "Weak" if summary["total_pnl_percent"] > -10 else \
                     "Poor"

        # Sector concentration
        sector_concentration = "Diversified" if len(summary["sector_allocation"]) > 5 else \
                              "Moderate" if len(summary["sector_allocation"]) > 3 else \
                              "Concentrated"

        # Generate insights
        insights = []
        
        if num_holdings < 5:
            insights.append("Consider adding more holdings to improve diversification")
        
        if concentration > 30:
            insights.append(f"Reduce concentration in largest position ({concentration:.1f}% of portfolio)")
        
        if len(summary["sector_allocation"]) < 3:
            insights.append("Add exposure to different sectors for better diversification")
        
        if summary["total_pnl_percent"] > 20:
            insights.append("Consider booking partial profits on strong performers")
        elif summary["total_pnl_percent"] < -20:
            insights.append("Review underperforming positions. Consider tax-loss harvesting.")

        # Get technical analysis for top holdings
        top_holdings_analysis = []
        for holding in sorted(holdings, key=lambda x: x.current_value or 0, reverse=True)[:3]:
            try:
                if holding.holding_type == HoldingType.CRYPTO:
                    symbol = f"{holding.symbol}-USD"
                else:
                    symbol = holding.symbol
                
                tech_analysis = market_tools.calculate_technical_indicators(symbol, "1mo")
                if "error" not in tech_analysis:
                    top_holdings_analysis.append({
                        "symbol": holding.symbol,
                        "trend": tech_analysis.get("trend"),
                        "rsi_signal": tech_analysis.get("rsi_signal"),
                        "macd_signal": tech_analysis.get("macd_signal"),
                    })
            except Exception:
                continue

        return {
            "diversification_score": max(0, diversification_score),
            "concentration_risk": concentration_risk,
            "performance": performance,
            "sector_concentration": sector_concentration,
            "total_return": summary["total_pnl_percent"],
            "insights": insights,
            "top_holdings_analysis": top_holdings_analysis,
            "recommendations": self._generate_recommendations(summary, insights),
            "timestamp": datetime.now().isoformat(),
        }

    def _generate_recommendations(self, summary: Dict, insights: List[str]) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []

        if summary["holdings_count"] < 5:
            recommendations.append("Build core positions in 5-8 quality assets")
        
        if summary.get("sector_allocation"):
            sectors = list(summary["sector_allocation"].keys())
            if "Technology" in sectors and len(sectors) < 4:
                recommendations.append("Consider adding defensive sectors (Healthcare, Consumer Staples, Utilities)")
        
        if summary["total_pnl_percent"] > 15:
            recommendations.append("Set trailing stop-losses to protect gains")
        elif summary["total_pnl_percent"] < -10:
            recommendations.append("Review thesis for each losing position. Cut losers, let winners run.")

        recommendations.append("Rebalance portfolio quarterly to maintain target allocation")
        recommendations.append("Maintain emergency fund separate from investment portfolio")

        return recommendations


# Import yfinance for the private method
import yfinance as yf


def get_portfolio_manager(db: Session) -> PortfolioManager:
    """Get portfolio manager instance"""
    return PortfolioManager(db)
