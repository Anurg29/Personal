# Market Tracking & Portfolio Management System

## Overview
Your all-in-one AI-powered market tracking and portfolio management system integrated into J.A.R.V.I.S. - no need to visit external websites!

## Features Implemented

### 🌍 Market Data Tracking
- **Domestic Markets (India)**: NIFTY 50, BANK NIFTY, SENSEX
- **International Markets**: S&P 500, NASDAQ, DOW JONES, FTSE, DAX, NIKKEI
- **Commodities**: Gold, Silver, Crude Oil, Brent Oil, Natural Gas
- **Cryptocurrencies**: Bitcoin, Ethereum, BNB, XRP, ADA, DOGE, SOL
- **Currencies**: USD/INR, EUR/USD, GBP/USD, USD/JPY
- **Real-time Updates**: Auto-refresh every minute
- **Market Condition Analysis**: Bull/Bear/Neutral with sentiment analysis

### 💼 Portfolio Management
- **Multi-Asset Support**: Stocks, ETFs, Cryptocurrencies, Mutual Funds, Commodities
- **Automatic P&L Calculation**: Real-time profit/loss tracking
- **Asset Allocation**: Pie chart visualization
- **Sector-wise Breakdown**: Understand sector concentration
- **Top Gainers/Losers**: Instantly see best and worst performers
- **Transaction History**: Track all buy/sell transactions
- **Watchlist**: Monitor stocks without owning them

### 🤖 AI-Powered Insights (J.A.R.V.I.S.)
- **Portfolio Health Score**: 0-100 score based on diversification
- **Concentration Risk Analysis**: Identifies over-concentration
- **Performance Assessment**: Strong/Good/Weak/Poor rating
- **Actionable Insights**: Personalized recommendations
- **Technical Analysis**: RSI, MACD, Moving Averages for top holdings
- **Market Sentiment**: VIX-based fear/greed analysis
- **Natural Language Queries**: Ask Jarvis about markets!

### 📊 Interactive Dashboard
- **Market Ticker**: Scrolling ticker with live prices
- **Global Markets Grid**: Quick view of major indices
- **News Feed**: Latest market news
- **AI Insights Panel**: Comprehensive portfolio analysis
- **Add Holdings Modal**: Easy portfolio entry

## How to Use

### 1. Access the Market Dashboard
Navigate to `/market` from the navigation header (BarChart3 icon)

### 2. Add Your First Holding
1. Click "Add Holding" button
2. Enter stock details:
   - Symbol (e.g., AAPL, TSLA, RELIANCE.NS)
   - Name (e.g., Apple Inc.)
   - Type (Stock, ETF, Crypto, etc.)
   - Quantity and Average Price
   - Currency and Exchange (optional)
   - Sector (optional)
3. Click "Add Holding"

### 3. Ask J.A.R.V.I.S. About Markets
Go to `/chat` and try these queries:
- "How's the market today?"
- "Show me my portfolio"
- "Analyze my investments"
- "What's happening with Tesla?"
- "Get technical analysis for AAPL"
- "Should I invest now?"
- "Show market news"

### 4. Monitor Your Portfolio
- **Total Value**: Current worth of all holdings
- **P&L**: Total profit/loss with percentage
- **Allocation**: Asset type distribution
- **Sector Breakdown**: Industry diversification
- **Health Score**: Overall portfolio quality

## Technical Details

### Backend Components
```
backend/
├── database.py              # SQLite database models
├── routers/
│   └── market.py           # API endpoints
├── tools/
│   ├── market_tools.py     # Market data fetching
│   └── portfolio_tools.py  # Portfolio management
└── config.py               # Configuration
```

### Frontend Components
```
src/
├── app/market/
│   └── page.tsx            # Market dashboard
├── components/market/
│   ├── MarketTicker.tsx    # Scrolling ticker
│   ├── PortfolioCard.tsx   # Portfolio summary
│   ├── AIInsights.tsx      # AI analysis
│   └── AddHoldingModal.tsx # Add holdings form
└── components/layout/
    └── Header.tsx          # Updated navigation
```

### APIs Available
- `GET /api/market/overview` - Complete market overview
- `GET /api/market/condition` - Market condition analysis
- `GET /api/market/stock/{symbol}` - Stock details
- `GET /api/market/technical/{symbol}` - Technical indicators
- `GET /api/market/news` - Market news
- `GET /api/portfolio` - Portfolio summary
- `GET /api/portfolio/holdings` - All holdings
- `POST /api/portfolio/add` - Add holding
- `POST /api/portfolio/update-quantity` - Buy/sell
- `DELETE /api/portfolio/remove/{symbol}` - Remove holding
- `GET /api/portfolio/analysis` - AI portfolio analysis
- `GET /api/watchlist` - Watchlist items
- `POST /api/watchlist/add` - Add to watchlist

### Data Sources
- **Yahoo Finance**: Stocks, indices, commodities, crypto, currencies
- **NewsAPI**: Market news aggregation
- **Technical Indicators**: pandas-ta library

## Configuration

### Environment Variables
Add to `backend/.env.local`:
```bash
# Required for market features
NEWSAPI_API_KEY=your_newsapi_key_here

# Existing variables
GITHUB_TOKEN=ghp_your_token_here
GITHUB_USERNAME=your_github_username
HUGGINGFACE_API_KEY=hf_your_key_here
FRONTEND_URL=http://localhost:3000
```

**Get NewsAPI Key**: https://newsapi.org/register (Free tier available)

### Install Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend (already installed)
npm install
```

## Example Usage

### Adding Stocks
```
Symbol: AAPL
Name: Apple Inc.
Type: Stock
Quantity: 10
Average Price: 150.50
Currency: USD
Exchange: NASDAQ
Sector: Technology
```

### Adding Crypto
```
Symbol: BTC
Name: Bitcoin
Type: Crypto
Quantity: 0.5
Average Price: 45000
Currency: USD
```

### Adding Indian Stocks
```
Symbol: RELIANCE.NS
Name: Reliance Industries
Type: Stock
Quantity: 50
Average Price: 2450
Currency: INR
Exchange: NSE
Sector: Energy
```

## Features in Action

### Market Analysis
Jarvis will analyze:
- VIX (Volatility Index) levels
- Major indices trends
- Technical indicators
- Market sentiment
- Provide actionable recommendations

### Portfolio Health Check
Jarvis evaluates:
- Diversification (number of holdings)
- Concentration risk (single position %)
- Sector allocation
- Performance metrics
- Technical outlook for top holdings

### Investment Education
Jarvis provides:
- Market condition explanations
- Portfolio theory insights
- Risk management tips
- Technical analysis education
- **Disclaimer**: Not financial advice!

## Troubleshooting

### No Market Data Showing
1. Check internet connection
2. Verify Yahoo Finance is accessible
3. Restart backend server

### Portfolio Not Updating
1. Refresh the page
2. Check database file exists (`portfolio.db`)
3. Verify backend logs for errors

### News Not Loading
1. Add NEWSAPI_API_KEY to .env.local
2. Free tier has limited calls (500/day)
3. Consider skipping news if not critical

### AI Not Responding to Market Queries
1. Ensure backend is running
2. Check LangChain tools are loaded
3. Verify HuggingFace API key is valid

## Future Enhancements
- [ ] Advanced charts (TradingView integration)
- [ ] Paper trading mode
- [ ] Options chain analysis
- [ ] Dividend tracking
- [ ] Tax calculation
- [ ] Automated alerts (email/SMS)
- [ ] Backtesting strategies
- [ ] SIP/Mutual Fund tracking
- [ ] Goal-based investing
- [ ] Risk metrics (Sharpe, Sortino, Beta)

## Important Notes

⚠️ **Disclaimer**: This system is for educational and tracking purposes only.
- NOT financial advice
- Always do your own research
- Past performance doesn't guarantee future results
- Consult a financial advisor for investment decisions

📊 **Data Accuracy**: 
- Prices delayed by 15-20 minutes (free Yahoo Finance data)
- Not suitable for real-time trading decisions
- Use for long-term tracking and analysis

💾 **Data Storage**:
- All data stored locally in SQLite database
- No cloud sync (your data is private)
- Backup `portfolio.db` regularly

## Support
For issues or questions:
1. Check backend terminal for errors
2. Verify all dependencies are installed
3. Ensure environment variables are set
4. Review this documentation

---

**Built with ❤️ by Anurag Rokade**
*Powered by J.A.R.V.I.S. AI*
