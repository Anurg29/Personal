'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Briefcase } from 'lucide-react';
import { HUDCard } from '@/components/ui/HUDCard';
import { API_BASE } from '@/lib/utils';
import { GlowButton } from '@/components/ui/GlowButton';

interface PortfolioSummary {
  total_value: number;
  invested_value: number;
  total_pnl: number;
  total_pnl_percent: number;
  holdings_count: number;
  allocation: Record<string, number>;
  sector_allocation: Record<string, number>;
  top_gainers: Array<{ symbol: string; name: string; pnl_percent: number; pnl: number }>;
  top_losers: Array<{ symbol: string; name: string; pnl_percent: number; pnl: number }>;
}

interface PortfolioCardProps {
  compact?: boolean;
}

const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6, #ec4899, #6366f1'];

export function PortfolioCard({ compact = false }: PortfolioCardProps) {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio`);
      const data = await response.json();
      if (data.success) {
        setPortfolio(data.data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <HUDCard className="h-full">
        <div className="flex items-center justify-center h-48">
          <div className="text-cyan-400 animate-pulse">Loading portfolio...</div>
        </div>
      </HUDCard>
    );
  }

  if (!portfolio || portfolio.holdings_count === 0) {
    return (
      <HUDCard className="h-full">
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <Briefcase className="w-12 h-12 text-cyan-400/50 mb-4" />
          <h3 className="text-lg font-semibold text-jarvis-text mb-2">No Holdings Yet</h3>
          <p className="text-sm text-jarvis-text/60 mb-4">
            Start building your portfolio by adding stocks, ETFs, or crypto
          </p>
          <GlowButton variant="primary" onClick={() => { }}>
            Add First Holding
          </GlowButton>
        </div>
      </HUDCard>
    );
  }

  const isProfit = portfolio.total_pnl >= 0;

  // Prepare allocation data for pie chart
  const allocationData = Object.entries(portfolio.allocation).map(([key, value]) => ({
    name: key.toUpperCase(),
    value,
  }));

  if (compact) {
    return (
      <HUDCard className="h-full">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-jarvis-text">Portfolio Summary</h3>
            <Briefcase className="w-5 h-5 text-cyan-400" />
          </div>

          {/* Total Value */}
          <div>
            <div className="text-xs text-jarvis-text/60 mb-1">Total Value</div>
            <div className="text-2xl font-bold text-jarvis-text">
              ${portfolio.total_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* P&L */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="text-xs text-jarvis-text/60 mb-1">Total P&L</div>
              <div
                className={`text-lg font-semibold flex items-center ${isProfit ? 'text-emerald-400' : 'text-red-400'
                  }`}
              >
                {isProfit ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                ${Math.abs(portfolio.total_pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-jarvis-text/60 mb-1">Return %</div>
              <div
                className={`text-lg font-semibold ${isProfit ? 'text-emerald-400' : 'text-red-400'
                  }`}
              >
                {isProfit ? '+' : ''}{portfolio.total_pnl_percent.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Holdings Count */}
          <div className="pt-4 border-t border-jarvis-hud-border/30">
            <div className="text-xs text-jarvis-text/60">Holdings: {portfolio.holdings_count}</div>
          </div>
        </div>
      </HUDCard>
    );
  }

  return (
    <HUDCard className="h-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-jarvis-text">Portfolio Analysis</h3>
          <Briefcase className="w-6 h-6 text-cyan-400" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-jarvis-text/60 mb-1">Total Value</div>
            <div className="text-xl font-bold text-jarvis-text">
              ${portfolio.total_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-jarvis-text/60 mb-1">Invested</div>
            <div className="text-xl font-bold text-jarvis-text">
              ${portfolio.invested_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-jarvis-text/60 mb-1">Total P&L</div>
            <div
              className={`text-xl font-bold flex items-center ${isProfit ? 'text-emerald-400' : 'text-red-400'
                }`}
            >
              {isProfit ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              ${Math.abs(portfolio.total_pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-jarvis-text/60 mb-1">Return %</div>
            <div
              className={`text-xl font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'
                }`}
            >
              {isProfit ? '+' : ''}{portfolio.total_pnl_percent.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Asset Allocation */}
        <div>
          <h4 className="text-sm font-semibold text-jarvis-text mb-3">Asset Allocation</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={(props: any) => {
                    const { name, percent } = props;
                    if (!name || percent === undefined) return null;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  labelLine={false}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Gainers & Losers */}
        {(portfolio.top_gainers.length > 0 || portfolio.top_losers.length > 0) && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-jarvis-hud-border/30">
            {portfolio.top_gainers.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-emerald-400 mb-2">Top Gainers</h4>
                <div className="space-y-1">
                  {portfolio.top_gainers.slice(0, 3).map((stock) => (
                    <div key={stock.symbol} className="text-xs">
                      <div className="font-medium text-jarvis-text">{stock.symbol}</div>
                      <div className="text-emerald-400">+{stock.pnl_percent.toFixed(2)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {portfolio.top_losers.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-red-400 mb-2">Top Losers</h4>
                <div className="space-y-1">
                  {portfolio.top_losers.slice(0, 3).map((stock) => (
                    <div key={stock.symbol} className="text-xs">
                      <div className="font-medium text-jarvis-text">{stock.symbol}</div>
                      <div className="text-red-400">{stock.pnl_percent.toFixed(2)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </HUDCard>
  );
}
