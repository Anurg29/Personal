'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { HUDCard } from '@/components/ui/HUDCard';
import { API_BASE } from '@/lib/utils';
import { GlowButton } from '@/components/ui/GlowButton';

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddHoldingModal({ isOpen, onClose, onSuccess }: AddHoldingModalProps) {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    holding_type: 'stock',
    quantity: '',
    average_price: '',
    currency: 'USD',
    sector: '',
    exchange: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/portfolio/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
          average_price: parseFloat(formData.average_price),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Reset form
        setFormData({
          symbol: '',
          name: '',
          holding_type: 'stock',
          quantity: '',
          average_price: '',
          currency: 'USD',
          sector: '',
          exchange: '',
        });

        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(data.detail || 'Failed to add holding');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <HUDCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-jarvis-text">Add Holding</h2>
          <button
            onClick={onClose}
            className="text-jarvis-text/60 hover:text-jarvis-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-400/10 border border-red-400/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-jarvis-text/60 mb-1">Symbol *</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              placeholder="AAPL, TSLA, RELIANCE.NS"
              className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-jarvis-text/60 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Apple Inc., Tesla Inc."
              className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-jarvis-text/60 mb-1">Type *</label>
            <select
              value={formData.holding_type}
              onChange={(e) => setFormData({ ...formData, holding_type: e.target.value })}
              className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
              required
            >
              <option value="stock">Stock</option>
              <option value="etf">ETF</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="mutual_fund">Mutual Fund</option>
              <option value="commodity">Commodity</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-jarvis-text/60 mb-1">Quantity *</label>
              <input
                type="number"
                step="any"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="10"
                className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-jarvis-text/60 mb-1">Avg. Price *</label>
              <input
                type="number"
                step="any"
                value={formData.average_price}
                onChange={(e) => setFormData({ ...formData, average_price: e.target.value })}
                placeholder="150.50"
                className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-jarvis-text/60 mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-jarvis-text/60 mb-1">Exchange</label>
              <input
                type="text"
                value={formData.exchange}
                onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
                placeholder="NASDAQ, NSE"
                className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-jarvis-text/60 mb-1">Sector</label>
            <input
              type="text"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              placeholder="Technology, Healthcare"
              className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <GlowButton
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </GlowButton>
            <GlowButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Adding...' : 'Add Holding'}
            </GlowButton>
          </div>
        </form>
      </HUDCard>
    </div>
  );
}
