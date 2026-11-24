import React from 'react';
import { Users, Briefcase, DollarSign, CheckSquare, TrendingUp } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const StatCards = ({ cards }) => {
  const { setCurrentPage } = useCRM();

  const statItems = [
    {
      id: 'contacts',
      label: 'Total Contacts',
      value: cards?.totalContacts ?? 0,
      subValue: 'Active directory leads',
      icon: Users,
      color: 'teal',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      page: 'contacts'
    },
    {
      id: 'deals',
      label: 'Active Deals',
      value: cards?.activeDeals ?? 0,
      subValue: cards?.activePipelineValue ? `$${Number(cards.activePipelineValue).toLocaleString()} in pipeline` : '$0 pipeline',
      icon: Briefcase,
      color: 'yellow',
      badgeColor: 'bg-monokai-yellow/10 text-monokai-yellow border-monokai-yellow/30',
      page: 'pipeline'
    },
    {
      id: 'revenue',
      label: 'Total Revenue Won',
      value: `$${Number(cards?.totalRevenueWon || 0).toLocaleString()}`,
      subValue: 'Closed deals converted',
      icon: DollarSign,
      color: 'green',
      badgeColor: 'bg-monokai-green/10 text-monokai-green border-monokai-green/30',
      page: 'pipeline'
    },
    {
      id: 'tasks',
      label: 'Pending Tasks',
      value: cards?.pendingTasks ?? 0,
      subValue: 'Urgent follow-ups & actions',
      icon: CheckSquare,
      color: 'cyan',
      badgeColor: 'bg-monokai-cyan/10 text-monokai-cyan border-monokai-cyan/30',
      page: 'tasks'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            onClick={() => setCurrentPage(item.page)}
            className="group relative bg-monokai-panel hover:bg-monokai-panel/80 border border-monokai-border hover:border-teal-500/40 rounded-xl p-5 shadow-monokai-card transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-monokai-muted">
                {item.label}
              </span>
              <div className={`p-2 rounded-lg border ${item.badgeColor} transition-transform group-hover:scale-110`}>
                <Icon size={18} />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold text-monokai-text tracking-tight font-sans">
                {item.value}
              </div>
              <p className="text-xs text-monokai-dim mt-1 truncate">
                {item.subValue}
              </p>
            </div>

            {/* Bottom accent glow */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500/0 to-transparent group-hover:via-teal-500/50 transition-all rounded-b-xl" />
          </div>
        );
      })}
    </div>
  );
};
