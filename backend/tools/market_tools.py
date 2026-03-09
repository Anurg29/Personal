"""
Market Data Tools - Comprehensive market data fetching and analysis
Handles domestic (India) and international markets
"""
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import requests
from config import NEWSAPI_API_KEY


class MarketDataTools:
    """Tools for fetching and analyzing market data"""

    # Major global indices with their Yahoo Finance symbols
    GLOBAL_INDICES = {
        "NIFTY_50": "^NSEI",
        "BANK_NIFTY": "^NSXBANK",
        "SENSEX": "^BSESN",
        "S&P_500": "^GSPC",
        "NASDAQ": "^IXIC",
        "DOW_JONES": "^DJI",
        "FTSE_100": "^FTSE",
        "DAX": "^GDAXI",
        "NIKKEI_225": "^N225",
        "HANG_SENG": "^HSI",
        "SHANGHAI": "000001.SS",
        "VIX": "^VIX",  # Volatility index
    }

    # Commodities
    COMMODITIES = {
        "GOLD": "GC=F",
        "SILVER": "SI=F",
        "CRUDE_OIL": "CL=F",
        "BRENT_OIL": "BZ=F",
        "NATURAL_GAS": "NG=F",
        "COPPER": "HG=F",
    }

    # Cryptocurrencies
    CRYPTO = {
        "BTC": "BTC-USD",
        "ETH": "ETH-USD",
        "BNB": "BNB-USD",
        "XRP": "XRP-USD",
        "ADA": "ADA-USD",
        "DOGE": "DOGE-USD",
        "SOL": "SOL-USD",
    }

    # Currency pairs
    CURRENCIES = {
        "USD_INR": "USDINR=X",
        "EUR_USD": "EURUSD=X",
        "GBP_USD": "GBPUSD=X",
        "USD_JPY": "USDJPY=X",
    }

    def __init__(self):
        self.session = requests.Session()

    def get_stock_info(self, symbol: str) -> Dict:
        """Get detailed stock information"""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # Get current price data
            hist = ticker.history(period="1d")
            current_price = hist['Close'].iloc[-1] if not hist.empty else 0
            
            return {
                "symbol": symbol,
                "name": info.get("shortName", info.get("longName", symbol)),
                "current_price": current_price,
                "currency": info.get("currency", "USD"),
                "exchange": info.get("exchange", "Unknown"),
                "sector": info.get("sector", None),
                "industry": info.get("industry", None),
                "market_cap": info.get("marketCap", None),
                "pe_ratio": info.get("trailingPE", None),
                "dividend_yield": info.get("dividendYield", None),
                "52_week_high": info.get("fiftyTwoWeekHigh", None),
                "52_week_low": info.get("fiftyTwoWeekLow", None),
                "day_high": hist['High'].iloc[-1] if not hist.empty else None,
                "day_low": hist['Low'].iloc[-1] if not hist.empty else None,
                "open": hist['Open'].iloc[-1] if not hist.empty else None,
                "previous_close": info.get("previousClose", None),
                "volume": info.get("volume", None),
                "avg_volume": info.get("averageVolume", None),
                "beta": info.get("beta", None),
                "eps": info.get("trailingEps", None),
                "book_value": info.get("bookValue", None),
                "price_to_book": info.get("priceToBook", None),
            }
        except Exception as e:
            return {"error": str(e), "symbol": symbol}

    def get_historical_data(
        self, 
        symbol: str, 
        period: str = "1mo",
        interval: str = "1d"
    ) -> pd.DataFrame:
        """Get historical price data"""
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(period=period, interval=interval)
            return df
        except Exception as e:
            return pd.DataFrame()

    def calculate_technical_indicators(self, symbol: str, period: str = "3mo") -> Dict:
        """Calculate technical indicators using pandas (manual calculations)"""
        try:
            df = self.get_historical_data(symbol, period)
            
            if df.empty:
                return {"error": "No data available"}

            # Calculate Moving Averages
            df['SMA_20'] = df['Close'].rolling(window=20).mean()
            df['SMA_50'] = df['Close'].rolling(window=50).mean()
            df['EMA_20'] = df['Close'].ewm(span=20, adjust=False).mean()
            df['EMA_50'] = df['Close'].ewm(span=50, adjust=False).mean()
            
            # Calculate RSI
            delta = df['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            df['RSI'] = 100 - (100 / (1 + rs))
            
            # Calculate MACD
            exp1 = df['Close'].ewm(span=12, adjust=False).mean()
            exp2 = df['Close'].ewm(span=26, adjust=False).mean()
            df['MACD'] = exp1 - exp2
            df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
            
            # Calculate Bollinger Bands
            df['BB_middle'] = df['Close'].rolling(window=20).mean()
            std_dev = df['Close'].rolling(window=20).std()
            df['BB_upper'] = df['BB_middle'] + (std_dev * 2)
            df['BB_lower'] = df['BB_middle'] - (std_dev * 2)
            
            # Calculate Stochastic
            low_14 = df['Low'].rolling(window=14).min()
            high_14 = df['High'].rolling(window=14).max()
            df['Stoch_K'] = 100 * ((df['Close'] - low_14) / (high_14 - low_14))
            df['Stoch_D'] = df['Stoch_K'].rolling(window=3).mean()
            
            # Get latest values
            latest = df.iloc[-1]
            current_price = latest['Close']
            
            # Determine signals
            rsi_signal = "Overbought" if latest['RSI'] > 70 else "Oversold" if latest['RSI'] < 30 else "Neutral"
            
            # MACD signal
            macd_signal = "Bullish" if latest['MACD'] > latest['MACD_Signal'] else "Bearish"
            
            # Trend
            trend = "Uptrend" if current_price > latest['SMA_50'] else "Downtrend"
            
            return {
                "symbol": symbol,
                "current_price": float(current_price),
                "rsi": float(latest['RSI']),
                "rsi_signal": rsi_signal,
                "macd": float(latest['MACD']) if pd.notna(latest['MACD']) else None,
                "macd_signal": macd_signal,
                "sma_20": float(latest['SMA_20']) if pd.notna(latest['SMA_20']) else None,
                "sma_50": float(latest['SMA_50']) if pd.notna(latest['SMA_50']) else None,
                "ema_20": float(latest['EMA_20']) if pd.notna(latest['EMA_20']) else None,
                "trend": trend,
                "support": float(latest['BB_lower']) if pd.notna(latest['BB_lower']) else None,
                "resistance": float(latest['BB_upper']) if pd.notna(latest['BB_upper']) else None,
                "stochastic_k": float(latest['Stoch_K']) if pd.notna(latest['Stoch_K']) else None,
                "stochastic_d": float(latest['Stoch_D']) if pd.notna(latest['Stoch_D']) else None,
            }
        except Exception as e:
            return {"error": str(e), "symbol": symbol}

    def get_market_overview(self) -> Dict:
        """Get overview of global markets"""
        overview = {
            "indices": {},
            "commodities": {},
            "crypto": {},
            "currencies": {},
            "timestamp": datetime.now().isoformat(),
        }

        # Fetch indices
        for name, symbol in self.GLOBAL_INDICES.items():
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="1d")
                if not hist.empty:
                    change = hist['Close'].iloc[-1] - hist['Open'].iloc[-1]
                    change_pct = (change / hist['Open'].iloc[-1]) * 100
                    overview["indices"][name] = {
                        "value": float(hist['Close'].iloc[-1]),
                        "change": float(change),
                        "change_percent": float(change_pct),
                        "status": "up" if change > 0 else "down"
                    }
            except Exception:
                continue

        # Fetch commodities
        for name, symbol in self.COMMODITIES.items():
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="1d")
                if not hist.empty:
                    change = hist['Close'].iloc[-1] - hist['Open'].iloc[-1]
                    change_pct = (change / hist['Open'].iloc[-1]) * 100
                    overview["commodities"][name] = {
                        "value": float(hist['Close'].iloc[-1]),
                        "change": float(change),
                        "change_percent": float(change_pct),
                        "status": "up" if change > 0 else "down"
                    }
            except Exception:
                continue

        # Fetch crypto
        for name, symbol in self.CRYPTO.items():
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="1d")
                if not hist.empty:
                    change = hist['Close'].iloc[-1] - hist['Open'].iloc[-1]
                    change_pct = (change / hist['Open'].iloc[-1]) * 100
                    overview["crypto"][name] = {
                        "value": float(hist['Close'].iloc[-1]),
                        "change": float(change),
                        "change_percent": float(change_pct),
                        "status": "up" if change > 0 else "down"
                    }
            except Exception:
                continue

        # Fetch currencies
        for name, symbol in self.CURRENCIES.items():
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="1d")
                if not hist.empty:
                    change = hist['Close'].iloc[-1] - hist['Open'].iloc[-1]
                    change_pct = (change / hist['Open'].iloc[-1]) * 100
                    overview["currencies"][name] = {
                        "value": float(hist['Close'].iloc[-1]),
                        "change": float(change),
                        "change_percent": float(change_pct),
                        "status": "up" if change > 0 else "down"
                    }
            except Exception:
                continue

        return overview

    def get_market_news(self, query: str = "stock market", num_articles: int = 10) -> List[Dict]:
        """Get market news from NewsAPI"""
        if not NEWSAPI_API_KEY:
            return []

        try:
            url = "https://newsapi.org/v2/everything"
            params = {
                "q": query,
                "sortBy": "publishedAt",
                "pageSize": num_articles,
                "language": "en",
            }
            headers = {"X-Api-Key": NEWSAPI_API_KEY}
            
            response = self.session.get(url, params=params, headers=headers, timeout=10)
            data = response.json()
            
            if data.get("status") == "ok":
                articles = data.get("articles", [])
                return [
                    {
                        "title": article.get("title", ""),
                        "description": article.get("description", ""),
                        "source": article.get("source", {}).get("name", ""),
                        "url": article.get("url", ""),
                        "image_url": article.get("urlToImage", ""),
                        "published_at": article.get("publishedAt", ""),
                    }
                    for article in articles[:num_articles]
                ]
        except Exception as e:
            print(f"Error fetching news: {e}")
        
        return []

    def analyze_market_condition(self) -> Dict:
        """Analyze overall market condition"""
        try:
            # Get major indices performance
            sp500 = self.calculate_technical_indicators("SPY", "1mo")  # S&P 500 ETF
            nasdaq = self.calculate_technical_indicators("QQQ", "1mo")  # NASDAQ ETF
            vix = self.get_stock_info("^VIX")
            
            # Determine market sentiment
            vix_level = vix.get("current_price", 0)
            if vix_level > 30:
                sentiment = "Fear/High Volatility"
            elif vix_level > 20:
                sentiment = "Neutral/Uncertain"
            else:
                sentiment = "Greed/Low Volatility"
            
            # Count bullish/bearish signals
            bullish_count = 0
            bearish_count = 0
            
            for indicator in [sp500, nasdaq]:
                if indicator.get("trend") == "Uptrend":
                    bullish_count += 1
                else:
                    bearish_count += 1
                
                if indicator.get("rsi_signal") == "Oversold":
                    bullish_count += 1
                elif indicator.get("rsi_signal") == "Overbought":
                    bearish_count += 1
                
                if indicator.get("macd_signal") == "Bullish":
                    bullish_count += 1
                elif indicator.get("macd_signal") == "Bearish":
                    bearish_count += 1
            
            total_signals = bullish_count + bearish_count
            if total_signals == 0:
                overall_condition = "Neutral/Mixed"
            elif bullish_count > bearish_count * 1.5:
                overall_condition = "Bullish"
            elif bearish_count > bullish_count * 1.5:
                overall_condition = "Bearish"
            else:
                overall_condition = "Neutral/Mixed"
            
            return {
                "condition": overall_condition,
                "sentiment": sentiment,
                "vix": vix_level,
                "bullish_signals": bullish_count,
                "bearish_signals": bearish_count,
                "sp500_trend": sp500.get("trend", "Unknown"),
                "nasdaq_trend": nasdaq.get("trend", "Unknown"),
                "recommendation": self._get_recommendation(overall_condition, sentiment),
                "timestamp": datetime.now().isoformat(),
            }
        except Exception as e:
            return {"error": str(e)}

    def _get_recommendation(self, condition: str, sentiment: str) -> str:
        """Generate investment recommendation based on market conditions"""
        recommendations = {
            ("Bullish", "Greed/Low Volatility"): "Market is strong. Consider taking partial profits on overextended positions. Look for quality pullbacks to add.",
            ("Bullish", "Neutral/Uncertain"): "Market trending up but with some uncertainty. Maintain diversified portfolio with stop-losses.",
            ("Bearish", "Fear/High Volatility"): "High volatility and bearish trend. Consider defensive positions, increase cash allocation. Avoid catching falling knives.",
            ("Bearish", "Neutral/Uncertain"): "Market weakness with uncertainty. Wait for confirmation of bottom before adding risk.",
            ("Neutral/Mixed"): "Market lacks clear direction. Focus on stock-specific opportunities rather than broad market bets. Range-bound strategies may work."
        }
        
        key = (condition, sentiment)
        return recommendations.get(key, "Market conditions are unclear. Maintain disciplined approach with proper risk management.")

    def get_gainers_losers(self, market: str = "US", count: int = 5) -> Dict:
        """Get top gainers and losers"""
        # This would ideally use a screener API
        # For now, return sample data structure
        return {
            "gainers": [],
            "losers": [],
            "market": market,
        }

    def search_symbol(self, query: str) -> List[Dict]:
        """Search for stock symbols"""
        try:
            ticker = yf.Ticker(query)
            info = ticker.info
            
            return [{
                "symbol": query,
                "name": info.get("shortName", info.get("longName", query)),
                "exchange": info.get("exchange", "Unknown"),
                "type": "stock"
            }]
        except Exception:
            return []


# Singleton instance
market_tools = MarketDataTools()
