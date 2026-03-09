'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Newspaper,
  Plus,
  Search,
  BarChart3,
  PieChart,
  Brain
} from 'lucide-react';
import { MarketTicker } from '@/components/market/MarketTicker';
import { PortfolioCard } from '@/components/market/PortfolioCard';
import { AIInsights } from '@/components/market/AIInsights';
import { AddHoldingModal } from '@/components/market/AddHoldingModal';
import { HUDCard } from '@/components/ui/HUDCard';
import { GlowButton } from '@/components/ui/GlowButton';

interface MarketCondition {
  condition: string;
  sentiment: string;
  vix: number;
  recommendation: string;
}

export default function MarketPage() {
  const [marketCondition, setMarketCondition] = useState<MarketCondition | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchMarketCondition();
  }, []);

  const fetchMarketCondition = async () => {
    try {
      const response = await fetch('/api/market/condition');
      const data = await response.json();
      if (data.success) {
        setMarketCondition(data.data);
      }
    } catch (error) {
      console.error('Error fetching market condition:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Ticker */}
      <MarketTicker />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-jarvis-text">Market Dashboard</h1>
          <p className="text-sm text-jarvis-text/60 mt-1">
            Real-time market tracking & portfolio insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <GlowButton variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Holding
          </GlowButton>
        </div>
      </div>

      {/* Market Condition Banner */}
      {!loading && marketCondition && (
        <HUDCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                marketCondition.condition === 'Bullish' ? 'bg-emerald-400/20' :
                marketCondition.condition === 'Bearish' ? 'bg-red-400/20' :
                'bg-yellow-400/20'
              }`}>
                {marketCondition.condition === 'Bullish' ? (
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                ) : marketCondition.condition === 'Bearish' ? (
                  <TrendingDown className="w-6 h-6 text-red-400" />
                ) : (
                  <Activity className="w-6 h-6 text-yellow-400" />
                )}
              </div>
              <div>
                <div className="text-sm text-jarvis-text/60">Market Condition</div>
                <div className="text-xl font-semibold text-jarvis-text">
                  {marketCondition.condition} - {marketCondition.sentiment}
                </div>
                <div className="text-xs text-jarvis-text/60 mt-1">
                  VIX: {marketCondition.vix?.toFixed(2)} | {marketCondition.recommendation}
                </div>
              </div>
            </div>
          </div>
        </HUDCard>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Portfolio & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio Summary */}
          <PortfolioCard />

          {/* Market Overview Cards */}
          <HUDCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-jarvis-text flex items-center">
                <Globe className="w-5 h-5 mr-2 text-cyan-400" />
                Global Markets
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <MarketStatCard
                name="NIFTY 50"
                symbol="^NSEI"
                type="index"
              />
              <MarketStatCard
                name="S&P 500"
                symbol="^GSPC"
                type="index"
              />
              <MarketStatCard
                name="NASDAQ"
                symbol="^IXIC"
                type="index"
              />
              <MarketStatCard
                name="Gold"
                symbol="GC=F"
                type="commodity"
              />
              <MarketStatCard
                name="Crude Oil"
                symbol="CL=F"
                type="commodity"
              />
              <MarketStatCard
                name="Bitcoin"
                symbol="BTC-USD"
                type="crypto"
              />
            </div>
          </HUDCard>

          {/* Recent News */}
          <NewsSection />
        </div>

        {/* Right Column - AI Insights */}
        <div className="space-y-6">
          <AIInsights />

          {/* Quick Stats */}
          <HUDCard>
            <h3 className="text-lg font-semibold text-jarvis-text mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
              Market Statistics
            </h3>
            <div className="space-y-3">
              <StatRow label="Market Sentiment" value={marketCondition?.sentiment || 'Loading'} />
              <StatRow label="VIX Level" value={marketCondition?.vix?.toFixed(2) || '-'} />
              <StatRow label="Condition" value={marketCondition?.condition || 'Loading'} />
            </div>
          </HUDCard>

          {/* Watchlist Placeholder */}
          <HUDCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-jarvis-text flex items-center">
                <Activity className="w-5 h-5 mr-2 text-cyan-400" />
                Watchlist
              </h3>
              <GlowButton variant="ghost" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4" />
              </GlowButton>
            </div>
            <div className="text-center py-8 text-jarvis-text/60 text-sm">
              No stocks in watchlist
              <br />
              <span className="text-xs">Add stocks to track them here</span>
            </div>
          </HUDCard>
        </div>
      </div>

      {/* Add Holding Modal */}
      <AddHoldingModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          // Refresh data
          fetchMarketCondition();
        }}
      />
    </div>
  );
}

interface MarketStatCardProps {
  name: string;
  symbol: string;
  type: 'index' | 'commodity' | 'crypto';
}

function MarketStatCard({ name, symbol, type }: MarketStatCardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/market/stock/${symbol}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [symbol]);

  if (loading) {
    return (
      <div className="p-3 bg-jarvis-hud-secondary/30 rounded-lg animate-pulse">
        <div className="h-4 bg-jarvis-hud-border/30 rounded w-16 mb-2"></div>
        <div className="h-6 bg-jarvis-hud-border/30 rounded w-20"></div>
      </div>
    );
  }

  if (!data) return null;

  const change = data.current_price - (data.previous_close || data.open || data.current_price);
  const changePercent = ((change / (data.previous_close || data.open || data.current_price)) * 100);
  const isUp = change >= 0;

  return (
    <div className="p-3 bg-jarvis-hud-secondary/30 rounded-lg hover:bg-jarvis-hud-secondary/50 transition-all cursor-pointer">
      <div className="text-xs text-jarvis-text/60 mb-1">{name}</div>
      <div className="text-lg font-bold text-jarvis-text">
        {data.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className={`text-xs flex items-center mt-1 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
        {isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-jarvis-text/60">{label}</span>
      <span className="text-sm font-semibold text-jarvis-text">{value}</span>
    </div>
  );
}

function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/market/news?query=stock%20market&num_articles=5')
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setNews(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <HUDCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-jarvis-text flex items-center">
          <Newspaper className="w-5 h-5 mr-2 text-cyan-400" />
          Market News
        </h3>
      </div>
      {loading ? (
        <div className="text-center py-8 text-jarvis-text/60 text-sm">Loading news...</div>
      ) : news.length === 0 ? (
        <div className="text-center py-8 text-jarvis-text/60 text-sm">No news available</div>
      ) : (
        <div className="space-y-3">
          {news.slice(0, 5).map((article, index) => (
            <div key={index} className="p-3 bg-jarvis-hud-secondary/30 rounded-lg hover:bg-jarvis-hud-secondary/50 transition-all">
              <div className="text-sm font-medium text-jarvis-text mb-1 line-clamp-2">
                {article.title}
              </div>
              <div className="text-xs text-jarvis-text/60">
                {article.source} • {new Date(article.published_at).toLocaleDateString()}
              </div>
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 mt-2 inline-block"
                >
                  Read more →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </HUDCard>
  );
}
