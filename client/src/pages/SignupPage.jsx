import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Mail, Lock, User, Building, ArrowRight } from 'lucide-react';

export const SignupPage = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, companyName);
    } catch (err) {
      setError(err.message || 'Failed to sign up');
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
            Create Your CRM Workspace
          </h1>
          <p className="text-xs text-monokai-muted mt-1.5">
            Your private customer relationship management platform
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
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-monokai-dim" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
                Company / Workspace Name
              </label>
              <div className="relative">
                <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-monokai-dim" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Apex Global Inc."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-monokai-dim" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@apexglobal.com"
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
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-monokai-darker font-bold text-sm tracking-wide shadow-teal-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Creating workspace...' : 'Get Started'}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Footer switch */}
        <p className="text-center text-xs text-monokai-dim mt-6">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
