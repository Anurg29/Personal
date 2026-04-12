'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Briefcase,
  CalendarClock,
  CircleSlash,
  Plus,
  Target,
  Trash2,
  RefreshCcw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import { HUDCard } from '@/components/ui/HUDCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { API_BASE } from '@/lib/utils';
import type { ApplicationStats, ApplicationStatus, JobApplication } from '@/lib/types';

const STATUS_OPTIONS: ApplicationStatus[] = [
  'applied',
  'assessment',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
];

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: '#06b6d4',
  assessment: '#8b5cf6',
  interview: '#6366f1',
  offer: '#10b981',
  rejected: '#ef4444',
  withdrawn: '#f59e0b',
};

const PIE_COLORS = ['#06b6d4', '#8b5cf6', '#6366f1', '#10b981', '#ef4444', '#f59e0b', '#14b8a6'];

interface NewApplicationForm {
  company: string;
  role: string;
  platform: string;
  status: ApplicationStatus;
  location: string;
  salary_range: string;
  applied_date: string;
  follow_up_date: string;
  notes: string;
  job_url: string;
  contact_person: string;
}

const initialForm: NewApplicationForm = {
  company: '',
  role: '',
  platform: '',
  status: 'applied',
  location: '',
  salary_range: '',
  applied_date: new Date().toISOString().slice(0, 10),
  follow_up_date: '',
  notes: '',
  job_url: '',
  contact_person: '',
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<NewApplicationForm>(initialForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [appsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/applications`),
        fetch(`${API_BASE}/api/applications/stats`),
      ]);

      const appsJson = await appsRes.json();
      const statsJson = await statsRes.json();

      if (appsJson.success) {
        setApplications(appsJson.data);
      }
      if (statsJson.success) {
        setStats(statsJson.data);
      }
    } catch (err) {
      setError('Unable to load application tracker data.');
    } finally {
      setLoading(false);
    }
  };

  const platformOptions = useMemo(() => {
    const values = Array.from(new Set(applications.map((a) => a.platform.trim()).filter(Boolean)));
    values.sort((a, b) => a.localeCompare(b));
    return values;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesPlatform = platformFilter === 'all' || app.platform === platformFilter;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        term.length === 0 ||
        app.company.toLowerCase().includes(term) ||
        app.role.toLowerCase().includes(term) ||
        app.platform.toLowerCase().includes(term);

      return matchesStatus && matchesPlatform && matchesSearch;
    });
  }, [applications, statusFilter, platformFilter, search]);

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim() || !form.platform.trim()) {
      setError('Company, role and platform are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        ...form,
        applied_date: form.applied_date ? new Date(`${form.applied_date}T09:00:00`).toISOString() : undefined,
        follow_up_date: form.follow_up_date ? new Date(`${form.follow_up_date}T09:00:00`).toISOString() : null,
      };

      const response = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.detail || 'Failed to add application');
      }

      setForm(initialForm);
      await fetchAllData();
    } catch (err: any) {
      setError(err?.message || 'Could not add application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, status: ApplicationStatus) => {
    try {
      await fetch(`${API_BASE}/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchAllData();
    } catch (err) {
      setError('Could not update status.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/applications/${id}`, { method: 'DELETE' });
      await fetchAllData();
    } catch (err) {
      setError('Could not remove application.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-jarvis-text">Job Application Tracker</h1>
          <p className="text-sm text-jarvis-text/60 mt-1">
            Track every application from any platform and monitor your hiring pipeline.
          </p>
        </div>
        <GlowButton variant="ghost" onClick={fetchAllData}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh
        </GlowButton>
      </div>

      {error && (
        <HUDCard>
          <div className="text-red-400 text-sm">{error}</div>
        </HUDCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsTile title="Total" value={stats?.total_applications ?? 0} icon={Briefcase} />
        <StatsTile title="Active Pipeline" value={stats?.active_pipeline ?? 0} icon={Target} />
        <StatsTile title="Offers" value={stats?.offers ?? 0} icon={CheckCircle2} highlight="text-emerald-400" />
        <StatsTile title="Rejections" value={stats?.rejections ?? 0} icon={XCircle} highlight="text-red-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <HUDCard className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-jarvis-text flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
              Pipeline Statistics
            </h2>
            <div className="text-sm text-jarvis-text/60">
              Response Rate: <span className="text-jarvis-text font-semibold">{stats?.response_rate_percent ?? 0}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
                <PieChart>
                  <Pie
                    data={stats?.status_breakdown || []}
                    dataKey="count"
                    nameKey="status"
                    outerRadius={90}
                    label={(entry: any) => `${entry.status}: ${entry.count}`}
                  >
                    {(stats?.status_breakdown || []).map((entry, index) => (
                      <Cell
                        key={`status-${entry.status}`}
                        fill={STATUS_COLORS[entry.status as ApplicationStatus] || PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
                <BarChart data={stats?.platform_breakdown || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="platform" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-jarvis-hud-border/30">
            <QuickMetric label="Offer Rate" value={`${stats?.offer_rate_percent ?? 0}%`} />
            <QuickMetric label="Last 30 Days" value={`${stats?.recent_30_days ?? 0}`} />
            <QuickMetric label="Follow-ups (7d)" value={`${stats?.upcoming_followups ?? 0}`} />
          </div>
        </HUDCard>

        <HUDCard>
          <h2 className="text-lg font-semibold text-jarvis-text mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-cyan-400" />
            Add Application
          </h2>

          <form onSubmit={handleAddApplication} className="space-y-3">
            <Input label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} required />
            <Input label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} required />
            <Input label="Platform" value={form.platform} onChange={(v) => setForm({ ...form, platform: v })} required />

            <div>
              <label className="block text-xs text-jarvis-text/60 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })}
                className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
              <Input label="Salary" value={form.salary_range} onChange={(v) => setForm({ ...form, salary_range: v })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Applied Date" type="date" value={form.applied_date} onChange={(v) => setForm({ ...form, applied_date: v })} />
              <Input label="Follow-up" type="date" value={form.follow_up_date} onChange={(v) => setForm({ ...form, follow_up_date: v })} />
            </div>

            <Input label="Contact" value={form.contact_person} onChange={(v) => setForm({ ...form, contact_person: v })} />
            <Input label="Job URL" value={form.job_url} onChange={(v) => setForm({ ...form, job_url: v })} />

            <div>
              <label className="block text-xs text-jarvis-text/60 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder="Interview rounds, recruiter details, prep notes..."
                className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
              />
            </div>

            <GlowButton type="submit" variant="primary" disabled={submitting} className="w-full">
              {submitting ? 'Saving...' : 'Track Application'}
            </GlowButton>
          </form>
        </HUDCard>
      </div>

      <HUDCard>
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-4">
          <h2 className="text-lg font-semibold text-jarvis-text">Applications</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, role, platform"
              className="px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | ApplicationStatus)}
              className="px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>

            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
            >
              <option value="all">All platforms</option>
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-jarvis-text/60">Loading applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-10 text-center text-jarvis-text/60 flex flex-col items-center">
            <CircleSlash className="w-8 h-8 mb-2" />
            No applications found with current filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-jarvis-hud-secondary/25 border border-jarvis-hud-border/30"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-jarvis-text">
                      {app.company} • {app.role}
                    </div>
                    <div className="text-xs text-jarvis-text/60 mt-1 flex flex-wrap gap-3">
                      <span>{app.platform}</span>
                      <span>{app.location || 'Remote / N/A'}</span>
                      <span>
                        Applied: {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : '-'}
                      </span>
                      {app.follow_up_date && (
                        <span className="text-yellow-300 flex items-center">
                          <CalendarClock className="w-3 h-3 mr-1" />
                          Follow-up: {new Date(app.follow_up_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {(app.notes || app.job_url) && (
                      <div className="text-xs text-jarvis-text/70 mt-2">
                        {app.notes && <div className="mb-1">{app.notes}</div>}
                        {app.job_url && (
                          <a
                            href={app.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            Open job post ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className="px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
                      style={{ borderColor: `${STATUS_COLORS[app.status]}66` }}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition"
                      title="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </HUDCard>
    </div>
  );
}

function StatsTile({
  title,
  value,
  icon: Icon,
  highlight,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: string;
}) {
  return (
    <HUDCard>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-jarvis-text/60">{title}</div>
          <div className={`text-2xl font-bold text-jarvis-text ${highlight || ''}`}>{value}</div>
        </div>
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
    </HUDCard>
  );
}

function QuickMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-jarvis-text/60 mb-1">{label}</div>
      <div className="text-sm font-semibold text-jarvis-text">{value}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-jarvis-text/60 mb-1">{label}{required ? ' *' : ''}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 bg-jarvis-hud-secondary/30 border border-jarvis-hud-border/50 rounded text-jarvis-text focus:outline-none focus:border-jarvis-cyan/50 text-sm"
      />
    </div>
  );
}

function formatStatus(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, (s) => s.toUpperCase());
}
