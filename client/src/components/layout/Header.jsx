import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../services/api';
import {
  Search,
  Plus,
  User,
  LogOut,
  Settings,
  Database,
  ChevronDown,
  Building,
  Check
} from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const { setIsSearchOpen, openNewContact, openNewDeal, openNewTask, setCurrentPage, addToast, triggerRefresh } = useCRM();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [quickAddDropdownOpen, setQuickAddDropdownOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const profileRef = useRef(null);
  const quickAddRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target)) {
        setQuickAddDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await api.seedDemoData();
      addToast(res.message || 'Demo CRM data populated successfully!', 'success');
      triggerRefresh();
      setProfileDropdownOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to seed sample data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <header className="h-16 bg-monokai-panel border-b border-monokai-border px-6 flex items-center justify-between z-10 shrink-0">
      {/* Global Search Bar trigger */}
      <div className="flex-1 max-w-md">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-monokai-darker border border-monokai-border hover:border-teal-500/50 text-monokai-muted transition-all group text-sm"
        >
          <div className="flex items-center gap-2.5">
            <Search size={16} className="text-monokai-dim group-hover:text-teal-400 transition-colors" />
            <span className="text-xs sm:text-sm text-monokai-dim group-hover:text-monokai-muted">
              Search contacts, deals, tasks...
            </span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-monokai-dim bg-monokai-panel border border-monokai-border rounded">
              Ctrl+K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right controls: Quick Action & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick '+ New' Button with dropdown */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setQuickAddDropdownOpen(!quickAddDropdownOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-monokai-darker font-semibold text-xs tracking-wide shadow-teal-glow transition-all"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New</span>
            <ChevronDown size={14} />
          </button>

          {quickAddDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-monokai-panel border border-monokai-border rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in">
              <button
                onClick={() => {
                  setQuickAddDropdownOpen(false);
                  openNewContact();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-monokai-text hover:bg-monokai-hover hover:text-teal-400 flex items-center gap-2 transition-colors"
              >
                <Plus size={14} className="text-teal-400" />
                Add Contact
              </button>
              <button
                onClick={() => {
                  setQuickAddDropdownOpen(false);
                  openNewDeal();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-monokai-text hover:bg-monokai-hover hover:text-monokai-yellow flex items-center gap-2 transition-colors"
              >
                <Plus size={14} className="text-monokai-yellow" />
                Add Deal
              </button>
              <button
                onClick={() => {
                  setQuickAddDropdownOpen(false);
                  openNewTask();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-monokai-text hover:bg-monokai-hover hover:text-monokai-cyan flex items-center gap-2 transition-colors"
              >
                <Plus size={14} className="text-monokai-cyan" />
                Add Task
              </button>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-monokai-hover transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center font-semibold text-xs shadow-sm">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-monokai-text leading-tight group-hover:text-teal-400 transition-colors">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-monokai-dim leading-none">
                {user?.companyName || 'Private CRM'}
              </span>
            </div>
            <ChevronDown size={14} className="text-monokai-dim group-hover:text-monokai-text transition-colors" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-monokai-panel border border-monokai-border rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2.5 border-b border-monokai-border/80">
                <p className="text-xs font-semibold text-monokai-text">{user?.name}</p>
                <p className="text-[11px] text-monokai-muted truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded bg-monokai-subpanel text-[10px] text-teal-400 border border-monokai-border">
                  <Building size={10} /> {user?.companyName || 'Private Workspace'}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setCurrentPage('settings');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-monokai-text hover:bg-monokai-hover flex items-center gap-2.5 transition-colors"
                >
                  <Settings size={14} className="text-monokai-muted" />
                  Workspace Settings
                </button>

                <button
                  onClick={handleSeedData}
                  disabled={isSeeding}
                  className="w-full px-4 py-2 text-left text-xs text-monokai-yellow hover:bg-monokai-hover flex items-center gap-2.5 transition-colors"
                >
                  <Database size={14} />
                  {isSeeding ? 'Seeding Data...' : 'Seed Sample Demo Data'}
                </button>
              </div>

              <div className="border-t border-monokai-border/80 pt-1">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-xs text-monokai-pink hover:bg-monokai-hover flex items-center gap-2.5 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
