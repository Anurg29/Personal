# 🚀 Quick Start Guide - Market & Portfolio System

## ✅ What's Been Built

Your all-in-one market tracking and portfolio management system is ready! Here's what you now have:

### Backend Features ✓
- **Market Data API**: Real-time domestic & international market data
- **Portfolio Management**: SQLite database for tracking holdings
- **AI Integration**: J.A.R.V.I.S. with market-aware capabilities
- **Technical Analysis**: RSI, MACD, Moving Averages, Bollinger Bands
- **News Aggregation**: Market news integration (requires NewsAPI key)

### Frontend Features ✓
- **Market Dashboard** (`/market`): Complete market overview
- **Live Ticker**: Scrolling market prices at top
- **Portfolio Cards**: Visual portfolio summary with charts
- **AI Insights**: AI-powered portfolio analysis
- **Add Holdings Modal**: Easy portfolio entry form
- **Navigation**: Updated header with Market link

---

## 🎯 Getting Started (3 Steps)

### Step 1: Install Backend Dependencies
```bash
cd backend
pip3 install -r requirements.txt
```

**Note**: If you encounter Python version issues with pandas-ta, it's already handled - we calculate indicators manually!

### Step 2: Configure Environment Variables
Edit `backend/.env.local`:
```bash
# Add this line (get free key from https://newsapi.org/register)
NEWSAPI_API_KEY=your_newsapi_key_here

# Keep existing variables
GITHUB_TOKEN=ghp_your_token_here
GITHUB_USERNAME=your_github_username
HUGGINGFACE_API_KEY=hf_your_key_here
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
python3 main.py
# or
uvicorn main:app --reload
```
Backend runs on http://localhost:8000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on http://localhost:3000

---

## 📊 Using Your New System

### 1. Access Market Dashboard
- Navigate to `/market` from the header (BarChart3 icon)
- You'll see live market ticker, global markets, and portfolio summary

### 2. Add Your First Holding
1. Click "Add Holding" button
2. Fill in the form:
   ```
   Example - Apple Stock:
   - Symbol: AAPL
   - Name: Apple Inc.
   - Type: Stock
   - Quantity: 10
   - Average Price: 150.50
   - Currency: USD
   - Exchange: NASDAQ
   - Sector: Technology
   ```
3. Click "Add Holding"

### 3. Ask J.A.R.V.I.S. About Markets
Go to `/chat` and try these queries:

**Market Queries:**
```
"How's the market today?"
"Show market overview"
"What's happening with NIFTY?"
```

**Portfolio Queries:**
```
"Show my portfolio"
"How's my portfolio performing?"
"Analyze my investments"
```

**Stock Analysis:**
```
"Analyze TSLA stock"
"Get technical analysis for AAPL"
"What's the outlook for Bitcoin?"
```

**Market News:**
```
"Show market news"
"What's happening in tech stocks?"
```

---

## 🎨 Features Breakdown

### Market Dashboard Components

#### Market Ticker (Top Bar)
- Scrolls through major indices, commodities, crypto
- Auto-updates every minute
- Green/Red indicators for up/down movement

#### Market Condition Banner
- Shows Bull/Bear/Neutral market status
- VIX (volatility index) level
- Market sentiment analysis
- AI recommendation

#### Global Markets Grid
- NIFTY 50, S&P 500, NASDAQ
- Gold, Crude Oil, Bitcoin
- Real-time prices with % change

#### Portfolio Card
- Total value, invested amount
- P&L with percentage
- Asset allocation pie chart
- Top gainers & losers

#### AI Insights Panel
- Portfolio Health Score (0-100)
- Concentration risk assessment
- Performance rating
- Actionable insights
- Technical analysis for top holdings
- Personalized recommendations

#### News Feed
- Latest market articles
- Source and timestamp
- Click through to read more

---

## 🛠️ API Endpoints Available

All endpoints return JSON responses:

### Market Data
- `GET /api/market/overview` - Complete market overview
- `GET /api/market/condition` - Market condition analysis
- `GET /api/market/stock/{symbol}` - Stock details
- `GET /api/market/technical/{symbol}` - Technical indicators
- `GET /api/market/news` - Market news

### Portfolio Management
- `GET /api/portfolio` - Portfolio summary
- `GET /api/portfolio/holdings` - All holdings
- `POST /api/portfolio/add` - Add holding
- `POST /api/portfolio/update-quantity` - Buy/sell
- `DELETE /api/portfolio/remove/{symbol}` - Remove holding
- `GET /api/portfolio/analysis` - AI portfolio analysis

### Watchlist
- `GET /api/watchlist` - Watchlist items
- `POST /api/watchlist/add` - Add to watchlist
- `DELETE /api/watchlist/remove/{symbol}` - Remove

---

## 💡 Pro Tips

### Adding Different Asset Types

**Indian Stocks:**
```
Symbol: RELIANCE.NS
Name: Reliance Industries Ltd
Type: Stock
Currency: INR
Exchange: NSE
```

**Cryptocurrencies:**
```
Symbol: BTC
Name: Bitcoin
Type: Crypto
Currency: USD
```

**ETFs:**
```
Symbol: SPY
Name: SPDR S&P 500 ETF
Type: ETF
Currency: USD
```

### Best Practices
1. **Start Small**: Add 3-5 holdings first to test
2. **Verify Data**: Check prices against known sources
3. **Use Watchlist**: Track stocks before buying
4. **Check AI Insights**: Regular portfolio health checks
5. **Ask Jarvis**: Natural language queries are powerful!

---

## 🔧 Troubleshooting

### No Market Data Showing
- ✅ Internet connection active
- ✅ Backend server running
- ✅ Yahoo Finance accessible in your region
- Try: Refresh page or restart backend

### Portfolio Not Saving
- ✅ Database file exists: `backend/portfolio.db`
- ✅ Write permissions in backend directory
- Check backend terminal for errors

### News Not Loading
- ✅ NEWSAPI_API_KEY set in `.env.local`
- Free tier: 500 calls/day limit
- Solution: Skip news or get API key

### AI Not Responding to Market Queries
- ✅ Backend fully loaded
- ✅ HuggingFace API key valid
- ✅ LangChain tools initialized
- Check browser console for errors

### Module Import Errors
```bash
# Reinstall dependencies
cd backend
pip3 install -r requirements.txt --force-reinstall
```

---

## 📝 Important Notes

### ⚠️ Disclaimer
This system is for **educational and tracking purposes only**:
- ❌ NOT financial advice
- ❌ Not for real-time trading decisions
- ✅ Great for long-term tracking & analysis
- Always do your own research

### 📊 Data Quality
- Yahoo Finance data may be delayed 15-20 minutes
- Free tier limitations apply
- Some symbols may not be available (e.g., certain Indian stocks)
- Use standard Yahoo Finance symbol format

### 💾 Data Storage
- All data stored locally in SQLite (`portfolio.db`)
- No cloud synchronization
- Your data is completely private
- Backup the database file regularly

---

## 🎯 Next Steps

### Immediate Actions
1. ✅ Add your stock holdings
2. ✅ Set up watchlist
3. ✅ Ask J.A.R.V.I.S. about market conditions
4. ✅ Review AI portfolio insights

### Future Enhancements (Coming Soon)
- Advanced charts (TradingView integration)
- Paper trading mode
- Dividend tracking
- Tax calculation reports
- Automated price alerts
- SIP/Mutual fund tracking
- Backtesting strategies

---

## 🆘 Need Help?

### Check These First
1. Backend terminal for Python errors
2. Browser console for JavaScript errors
3. Network tab for failed API calls
4. `.env.local` variables are set correctly

### Common Issues
- **Database errors**: Delete `portfolio.db` and restart
- **Import errors**: Reinstall requirements
- **Port conflicts**: Change ports in config
- **Slow performance**: Reduce number of holdings tracked

---

## 📚 Documentation

For detailed information, see:
- `MARKET_FEATURES.md` - Complete feature documentation
- `backend/tools/market_tools.py` - Market data logic
- `backend/tools/portfolio_tools.py` - Portfolio management
- `src/components/market/` - Frontend components

---

## 🎉 You're All Set!

Your integrated market tracking and portfolio management system is ready to use!

**Start here:**
1. Open http://localhost:3000
2. Click "Market" in navigation
3. Add your first holding
4. Ask J.A.R.V.I.S.: "How's my portfolio?"

**Enjoy your all-in-one market tracking solution!** 🚀

---

*Built with ❤️ by Anurag Rokade*
*Powered by J.A.R.V.I.S. AI*
