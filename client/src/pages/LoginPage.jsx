import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage = ({ onSwitchToSignup }) => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Demo credentials
      await login('demo@nexuscrm.io', 'demo1234');
    } catch (err) {
      // If demo user doesn't exist yet, try creating it or fallback
      try {
        await register('Demo Admin', 'demo@nexuscrm.io', 'demo1234', 'Nexus Technologies Demo');
      } catch (regErr) {
        setError('Demo login initialization error: ' + (regErr.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-monokai-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 shadow-teal-glow mb-4">
            <Layers size={28} className="text-monokai-darker font-bold" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-monokai-text">
            Welcome back to Nexus<span className="text-teal-400">CRM</span>
          </h1>
          <p className="text-xs text-monokai-muted mt-1.5">
            Log in to manage your pipeline, contacts, and tasks
          </p>
        </div>

        {/* Card */}
        <div className="bg-monokai-panel border border-monokai-border rounded-2xl shadow-2xl p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-monokai-pink/10 border border-monokai-pink/30 text-xs text-monokai-pink">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-monokai-dim" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-monokai-dim" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-monokai-darker font-bold text-sm tracking-wide shadow-teal-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In to Workspace'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-5 pt-5 border-t border-monokai-border">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-monokai-subpanel hover:bg-monokai-hover border border-monokai-border text-monokai-yellow hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Instant Demo Access (1-Click)
            </button>
          </div>
        </div>

        {/* Footer switch */}
        <p className="text-center text-xs text-monokai-dim mt-6">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
          >
            Create your CRM workspace
          </button>
        </p>
      </div>
    </div>
  );
};
