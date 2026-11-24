import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const Sidebar = () => {
  const { currentPage, setCurrentPage } = useCRM();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'pipeline', label: 'Sales Pipeline', icon: KanbanSquare },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col bg-monokai-panel border-r border-monokai-border transition-all duration-300 ease-in-out shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Workspace Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-monokai-border">
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center shadow-teal-glow shrink-0">
            <Layers size={20} className="text-monokai-darker font-bold" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-base tracking-tight text-monokai-text flex items-center gap-1.5">
                Nexus<span className="text-teal-400">CRM</span>
              </span>
              <span className="text-[11px] text-monokai-muted truncate">
                {user?.companyName || 'Workspace'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className={`text-[10px] uppercase font-bold tracking-wider text-monokai-dim px-3 py-1 mb-1 ${isCollapsed ? 'hidden' : 'block'}`}>
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-teal-500/15 text-teal-400 font-semibold border border-teal-500/30 shadow-sm'
                  : 'text-monokai-muted hover:text-monokai-text hover:bg-monokai-hover'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                size={19}
                className={`shrink-0 transition-colors ${
                  isActive ? 'text-teal-400' : 'text-monokai-muted group-hover:text-monokai-text'
                }`}
              />

              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-400 rounded-r-full shadow-teal-glow"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace Footer & Collapse Toggle */}
      <div className="p-3 border-t border-monokai-border bg-monokai-darker/40">
        {!isCollapsed && (
          <div className="mb-2 px-3 py-2 rounded-lg bg-monokai-subpanel/50 border border-monokai-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Sparkles size={14} className="text-monokai-yellow shrink-0" />
              <div className="text-[11px] truncate">
                <span className="text-monokai-text font-medium block">Pro Plan</span>
                <span className="text-teal-400">HubSpot + Pipedrive UX</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-monokai-muted hover:text-monokai-text hover:bg-monokai-hover transition-colors text-xs font-medium"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
