from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import enum

Base = declarative_base()

DATABASE_URL = "sqlite:///./portfolio.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency for FastAPI to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class HoldingType(str, enum.Enum):
    STOCK = "stock"
    ETF = "etf"
    CRYPTO = "crypto"
    MUTUAL_FUND = "mutual_fund"
    COMMODITY = "commodity"


class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    holding_type = Column(SQLEnum(HoldingType), nullable=False)
    quantity = Column(Float, nullable=False)
    average_price = Column(Float, nullable=False)  # Average buy price
    current_price = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    sector = Column(String, nullable=True)
    exchange = Column(String, nullable=True)
    purchased_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Calculated fields
    invested_value = Column(Float, nullable=True)  # quantity * average_price
    current_value = Column(Float, nullable=True)  # quantity * current_price
    pnl = Column(Float, nullable=True)  # Profit/Loss
    pnl_percentage = Column(Float, nullable=True)

    def calculate_metrics(self):
        """Calculate P&L and other metrics"""
        self.invested_value = self.quantity * self.average_price
        self.current_value = self.quantity * self.current_price
        self.pnl = self.current_value - self.invested_value
        self.pnl_percentage = ((self.current_price - self.average_price) / self.average_price) * 100 if self.average_price > 0 else 0


class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    holding_type = Column(SQLEnum(HoldingType), nullable=True)
    exchange = Column(String, nullable=True)
    added_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        # Ensure unique symbols
        {'sqlite_autoincrement': True}
    )


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    transaction_type = Column(String, nullable=False)  # BUY, SELL
    quantity = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    transaction_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)


class MarketAlert(Base):
    __tablename__ = "market_alerts"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    alert_type = Column(String, nullable=False)  # PRICE_ABOVE, PRICE_BELOW, PERCENT_CHANGE
    target_value = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    triggered_at = Column(DateTime, nullable=True)


class UrgentTask(Base):
    __tablename__ = "urgent_tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=True)
    status = Column(String, default="pending") # urgent, pending, ongoing, complete
    created_at = Column(DateTime, default=datetime.utcnow)

class StrategicGoal(Base):
    __tablename__ = "strategic_goals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status_text = Column(String, nullable=False) # e.g. "85%", "+12%", "HOLD"
    color = Column(String, nullable=False)       # e.g. "#00d4ff"
    subtitle = Column(String, nullable=True)     # e.g. "Alpha Release"
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)
