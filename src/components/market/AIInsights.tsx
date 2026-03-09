'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { HUDCard } from '@/components/ui/HUDCard';
import { API_BASE } from '@/lib/utils';

interface PortfolioAnalysis {
  diversification_score: number;
  concentration_risk: string;
  performance: string;
  sector_concentration: string;
  total_return: number;
  insights: string[];
  recommendations: string[];
  top_holdings_analysis: Array<{
    symbol: string;
    trend: string;
    rsi_signal: string;
    macd_signal: string;
  }>;
}

interface AIInsightsProps {
  isVisible: boolean;
}

export function AIInsights({ isVisible }: Readonly<AIInsightsProps>) {
  const [analysis, setAnalysis] = useState<PortfolioAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    async function fetchAnalysis() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/api/portfolio/analysis`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setAnalysis(data.data);
        } else {
          setError(data.message || 'Failed to fetch analysis');
        }
      } catch (error: any) {
        console.error('Error fetching analysis:', error);
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [isVisible]);

  if (loading) {
    return (
      <HUDCard className="h-full">
        <div className="flex items-center justify-center h-48">
          <div className="text-cyan-400 animate-pulse flex items-center">
            <Brain className="w-6 h-6 mr-2 animate-pulse" />
            Analyzing portfolio...
          </div>
        </div>
      </HUDCard>
    );
  }

  if (!analysis) {
    return (
      <HUDCard className="h-full">
        <div className="flex items-center justify-center h-48 text-center">
          <div>
            <Brain className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
            <p className="text-jarvis-text/60">No analysis available</p>
          </div>
        </div>
      </HUDCard>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <HUDCard className="h-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-jarvis-text flex items-center">
            <Brain className="w-6 h-6 mr-2 text-cyan-400" />
            AI Portfolio Insights
          </h3>
        </div>

        {/* Health Score */}
        <div className="text-center py-4 border-b border-jarvis-hud-border/30">
          <div className="text-xs text-jarvis-text/60 mb-2">Portfolio Health Score</div>
          <div className={`text-5xl font-bold ${getScoreColor(analysis.diversification_score)}`}>
            {analysis.diversification_score}
            <span className="text-2xl text-jarvis-text/40">/100</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-jarvis-text/60 mb-1">Performance</div>
            <div className="text-sm font-semibold text-jarvis-text">{analysis.performance}</div>
          </div>
          <div>
            <div className="text-xs text-jarvis-text/60 mb-1">Concentration Risk</div>
            <div className="text-sm font-semibold text-jarvis-text">{analysis.concentration_risk}</div>
          </div>
          <div>
            <div className="text-xs text-jarvis-text/60 mb-1">Sector Diversification</div>
            <div className="text-sm font-semibold text-jarvis-text">{analysis.sector_concentration}</div>
          </div>
          <div>
            <div className="text-xs text-jarvis-text/60 mb-1">Total Return</div>
            <div className={`text-sm font-semibold ${analysis.total_return >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {analysis.total_return >= 0 ? '+' : ''}{analysis.total_return.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Insights */}
        {analysis.insights.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-jarvis-text mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1 text-yellow-400" />
              Key Insights
            </h4>
            <ul className="space-y-1">
              {analysis.insights.map((insight, index) => (
                <li key={index} className="text-xs text-jarvis-text/80 flex items-start">
                  <span className="text-cyan-400 mr-2 mt-0.5">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-jarvis-text mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-emerald-400" />
              Recommendations
            </h4>
            <ul className="space-y-1">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-xs text-jarvis-text/80 flex items-start">
                  <span className="text-emerald-400 mr-2 mt-0.5">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Top Holdings Analysis */}
        {analysis.top_holdings_analysis.length > 0 && (
          <div className="pt-4 border-t border-jarvis-hud-border/30">
            <h4 className="text-sm font-semibold text-jarvis-text mb-2">Top Holdings Technical View</h4>
            <div className="space-y-2">
              {analysis.top_holdings_analysis.map((holding) => (
                <div key={holding.symbol} className="text-xs p-2 bg-jarvis-hud-secondary/30 rounded">
                  <div className="font-semibold text-jarvis-text mb-1">{holding.symbol}</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-jarvis-text/60">Trend</div>
                      <div className={`font-medium ${holding.trend === 'Uptrend' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {holding.trend}
                      </div>
                    </div>
                    <div>
                      <div className="text-jarvis-text/60">RSI</div>
                      <div className="font-medium text-jarvis-text">{holding.rsi_signal}</div>
                    </div>
                    <div>
                      <div className="text-jarvis-text/60">MACD</div>
                      <div className={`font-medium ${holding.macd_signal === 'Bullish' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {holding.macd_signal}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </HUDCard>
  );
}
