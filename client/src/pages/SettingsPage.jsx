import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCRM } from '../context/CRMContext';
import { api } from '../services/api';
import {
  Settings,
  Building,
  User,
  Mail,
  Palette,
  Database,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast, triggerRefresh } = useCRM();

  const [name, setName] = useState(user?.name || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name, companyName };
      if (password) payload.password = password;
      await updateProfile(payload);
      addToast('Profile and workspace settings updated', 'success');
      setPassword('');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedDemoData = async () => {
    setSeeding(true);
    try {
      const res = await api.seedDemoData();
      addToast(res.message || 'Sample CRM dataset successfully loaded!', 'success');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to load demo data', 'error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-monokai-text">
          CRM Workspace Settings
        </h1>
        <p className="text-xs text-monokai-muted mt-1">
          Configure your CRM organization, user credentials, and SaaS theme preferences.
        </p>
      </div>

      {/* Profile & Workspace Card */}
      <div className="bg-monokai-panel border border-monokai-border rounded-xl p-6 shadow-monokai-card">
        <div className="flex items-center gap-2.5 pb-4 border-b border-monokai-border mb-5">
          <Building size={18} className="text-teal-400" />
          <h3 className="text-base font-semibold text-monokai-text">Workspace Details</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
                Workspace / Organization Name
              </label>
              <div className="relative">
                <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
                Email Address (Read-only)
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-9 pr-3 py-2 bg-monokai-darker/60 border border-monokai-border/60 rounded-lg text-sm text-monokai-dim cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
                New Password (Optional)
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty to keep current"
                  className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-monokai-darker font-bold text-xs tracking-wide shadow-teal-glow transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Demo Data Seeder Card */}
      <div className="bg-monokai-panel border border-monokai-border rounded-xl p-6 shadow-monokai-card">
        <div className="flex items-center gap-2.5 pb-4 border-b border-monokai-border mb-4">
          <Database size={18} className="text-monokai-yellow" />
          <h3 className="text-base font-semibold text-monokai-text">Demo Data & Sample Environment</h3>
        </div>

        <p className="text-xs text-monokai-muted mb-4 leading-relaxed">
          Need realistic data to evaluate the CRM? Click below to load realistic customer contacts,
          multi-stage Kanban deals ($300k+ in volume), activity timeline logs, and today's urgent follow-ups.
        </p>

        <button
          onClick={handleSeedDemoData}
          disabled={seeding}
          className="px-4 py-2.5 rounded-lg bg-monokai-subpanel hover:bg-monokai-hover border border-monokai-border text-xs font-semibold text-monokai-yellow hover:text-white flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Sparkles size={16} />
          {seeding ? 'Populating Demo Data...' : 'Reset & Populate Demo Workspace'}
        </button>
      </div>

      {/* Theme Specification Card */}
      <div className="bg-monokai-panel border border-monokai-border rounded-xl p-6 shadow-monokai-card">
        <div className="flex items-center gap-2.5 pb-4 border-b border-monokai-border mb-4">
          <Palette size={18} className="text-monokai-cyan" />
          <h3 className="text-base font-semibold text-monokai-text">Color Scheme: Dark Monokai + Teal</h3>
        </div>

        <p className="text-xs text-monokai-muted mb-4">
          Custom high-contrast theme built specifically for SaaS speed and visual clarity.
        </p>

        <div className="flex flex-wrap gap-2.5">
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#1a1b18] text-monokai-text border border-monokai-border">
            #1A1B18 (Base)
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#242520] text-monokai-text border border-monokai-border">
            #242520 (Panel)
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-teal-500/20 text-teal-400 border border-teal-500/40">
            #14B8A6 (Teal Accent)
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-monokai-yellow/20 text-monokai-yellow border border-monokai-yellow/40">
            #E6DB74 (Monokai Yellow)
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-monokai-pink/20 text-monokai-pink border border-monokai-pink/40">
            #F92672 (Monokai Pink)
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-monokai-green/20 text-monokai-green border border-monokai-green/40">
            #A6E22E (Monokai Green)
          </span>
        </div>
      </div>
    </div>
  );
};
