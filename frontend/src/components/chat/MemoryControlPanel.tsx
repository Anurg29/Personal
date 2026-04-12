'use client';

import { useState } from 'react';
import { Brain, Database, RefreshCcw, Sparkles } from 'lucide-react';
import { GlowButton } from '@/components/ui/GlowButton';
import { HUDCard } from '@/components/ui/HUDCard';
import { API_BASE } from '@/lib/utils';

interface MemoryControlPanelProps {
  onDone?: () => void;
}

export function MemoryControlPanel({ onDone }: MemoryControlPanelProps) {
  const [memoryText, setMemoryText] = useState('');
  const [category, setCategory] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addMemory = async () => {
    if (!memoryText.trim()) return;

    try {
      setLoading(true);
      setMessage('');
      const res = await fetch(`${API_BASE}/api/chat/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: memoryText.trim(),
          category,
          source: 'manual_ui',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Memory added to M.A.X. knowledge base.');
        setMemoryText('');
        onDone?.();
      } else {
        setMessage(data.detail || 'Could not save memory.');
      }
    } catch {
      setMessage('Connection error while saving memory.');
    } finally {
      setLoading(false);
    }
  };

  const autoIngest = async () => {
    try {
      setLoading(true);
      setMessage('');
      const res = await fetch(`${API_BASE}/api/chat/pipeline/auto-ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingest_latest_emails: true,
          ingest_drive_folders: true,
          email_count: 5,
          folder_count: 10,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Pipeline completed. Ingested ${data.ingested_count} memories.`);
        onDone?.();
      } else {
        setMessage(data.detail || 'Auto-ingest pipeline failed.');
      }
    } catch {
      setMessage('Connection error while running pipeline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HUDCard className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-jarvis-text flex items-center">
          <Brain className="w-4 h-4 mr-2 text-cyan-400" />
          M.A.X. Memory Pipeline
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-jarvis-text/60 mb-1">Add Personal Pattern / Preference</label>
          <textarea
            value={memoryText}
            onChange={(e) => setMemoryText(e.target.value)}
            rows={2}
            placeholder="Example: I prefer concise answers with bullet points and reminders for follow-ups."
            className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text text-sm"
          >
            <option value="personal">personal</option>
            <option value="work">work</option>
            <option value="gmail">gmail</option>
            <option value="drive">drive</option>
          </select>

          <GlowButton onClick={addMemory} disabled={loading || !memoryText.trim()} className="flex-1">
            <Database className="w-4 h-4 mr-2" />
            Save Memory
          </GlowButton>
        </div>

        <GlowButton variant="ghost" onClick={autoIngest} disabled={loading} className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Run Auto Pipeline (Gmail + Drive)
        </GlowButton>

        {message && <p className="text-xs text-jarvis-text/70">{message}</p>}
      </div>
    </HUDCard>
  );
}
