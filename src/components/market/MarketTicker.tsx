'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Globe, Coins, Droplet, Bitcoin } from 'lucide-react';
import { HUDCard } from '@/components/ui/HUDCard';

interface MarketData {
  value: number;
  change: number;
  change_percent: number;
  status: 'up' | 'down';
}

interface MarketOverview {
  indices: Record<string, MarketData>;
  commodities: Record<string, MarketData>;
  crypto: Record<string, MarketData>;
  currencies: Record<string, MarketData>;
  timestamp: string;
}

export function MarketTicker() {
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketOverview();
    const interval = setInterval(fetchMarketOverview, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchMarketOverview = async () => {
    try {
      const response = await fetch('/api/market/overview');
      const data = await response.json();
      if (data.success) {
        setOverview(data.data);
      }
    } catch (error) {
      console.error('Error fetching market overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !overview) {
    return (
      <div className="w-full bg-jarvis-hud-secondary/50 backdrop-blur-sm border-y border-jarvis-hud-border/30 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <Activity className="w-4 h-4 animate-pulse text-cyan-400" />
          <span className="ml-2 text-xs text-cyan-400">Loading market data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-jarvis-hud-secondary/50 backdrop-blur-sm border-y border-jarvis-hud-border/30 py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
          {/* Indices */}
          {Object.entries(overview.indices).slice(0, 6).map(([name, data]) => (
            <MarketTickerItem
              key={`index-${name}`}
              name={name.replace('_', ' ')}
              value={data.value}
              change={data.change}
              changePercent={data.change_percent}
              status={data.status}
              icon={<Activity className="w-3 h-3" />}
            />
          ))}

          {/* Commodities */}
          {Object.entries(overview.commodities).slice(0, 3).map(([name, data]) => (
            <MarketTickerItem
              key={`commodity-${name}`}
              name={name.replace('_', ' ')}
              value={data.value}
              change={data.change}
              changePercent={data.change_percent}
              status={data.status}
              icon={<Droplet className="w-3 h-3" />}
            />
          ))}

          {/* Crypto */}
          {Object.entries(overview.crypto).slice(0, 3).map(([name, data]) => (
            <MarketTickerItem
              key={`crypto-${name}`}
              name={name}
              value={data.value}
              change={data.change}
              changePercent={data.change_percent}
              status={data.status}
              icon={<Bitcoin className="w-3 h-3" />}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface MarketTickerItemProps {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  status: 'up' | 'down';
  icon: React.ReactNode;
}

function MarketTickerItem({ name, value, change, changePercent, status, icon }: MarketTickerItemProps) {
  const isUp = status === 'up';

  return (
    <motion.div
      className="flex items-center space-x-2 whitespace-nowrap text-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-cyan-400/70">{icon}</span>
      <span className="text-jarvis-text font-medium min-w-[80px]">{name}</span>
      <span className="text-jarvis-text/90 tabular-nums">
        {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <span
        className={`flex items-center ${isUp ? 'text-emerald-400' : 'text-red-400'}`}
      >
        {isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {Math.abs(changePercent).toFixed(2)}%
      </span>
    </motion.div>
  );
}
