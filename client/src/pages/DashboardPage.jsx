import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCRM } from '../context/CRMContext';
import { useAuth } from '../context/AuthContext';
import { StatCards } from '../components/dashboard/StatCards';
import { SalesChart } from '../components/dashboard/SalesChart';
import { TodaysFollowUps } from '../components/dashboard/TodaysFollowUps';
import {
  TrendingUp,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Calendar,
  Zap
} from 'lucide-react';

export const DashboardPage = () => {
  const { refreshKey, triggerRefresh, setCurrentPage, addToast } = useCRM();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-monokai-panel border border-monokai-border rounded-xl p-5 shadow-monokai-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-monokai-text">
              Sales Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/15 text-teal-400 border border-teal-500/30">
              Live Pipeline
            </span>
          </div>
          <p className="text-xs text-monokai-muted mt-1">
            Overview of your customer accounts, active deals, monthly revenue, and urgent follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentPage('pipeline')}
            className="px-3.5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-monokai-darker font-bold text-xs tracking-wide shadow-teal-glow transition-all flex items-center gap-1.5"
          >
            <span>Open Pipeline</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 4 Summary Cards at the top */}
      <StatCards cards={stats?.cards} />

      {/* Main Grid: Bar Chart & Today's Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Sales Bar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <SalesChart monthlySales={stats?.monthlySales || []} />
        </div>

        {/* Today's Follow-ups List (5 cols) */}
        <div className="lg:col-span-5">
          <TodaysFollowUps
            tasks={stats?.todaysFollowUps || []}
            onTaskToggled={fetchStats}
          />
        </div>
      </div>

      {/* Pipeline Stage Distribution Summary Bar (HubSpot / Pipedrive style) */}
      {stats?.stageSummary && (
        <div className="bg-monokai-panel border border-monokai-border rounded-xl p-5 shadow-monokai-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-teal-400" />
              <h4 className="text-sm font-semibold text-monokai-text">Pipeline Stage Value Summary</h4>
            </div>
            <button
              onClick={() => setCurrentPage('pipeline')}
              className="text-xs text-monokai-muted hover:text-teal-400 transition-colors"
            >
              Go to Kanban Board →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {stats.stageSummary.map((st, i) => (
              <div
                key={i}
                onClick={() => setCurrentPage('pipeline')}
                className="p-3 rounded-lg bg-monokai-subpanel border border-monokai-border hover:border-teal-500/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] font-medium text-monokai-muted mb-1">
                  <span>{st.stage}</span>
                  <span className="text-monokai-dim font-mono">{st.count}</span>
                </div>
                <div className="text-sm font-bold text-monokai-text font-mono">
                  ${Number(st.value).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
