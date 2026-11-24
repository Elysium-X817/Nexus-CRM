import React from 'react';
import { User, Calendar, DollarSign, AlertCircle, MoreHorizontal } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const DealCard = ({ deal, onDragStart, onSelectDeal }) => {
  const { openContactDetail } = useCRM();

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const now = new Date();
    return d < new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  };

  const overdue = isOverdue(deal.expectedCloseDate) && deal.stage !== 'Closed Won';

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-monokai-pink bg-monokai-pink/10 border-monokai-pink/30';
      case 'Low':
        return 'text-monokai-dim bg-monokai-hover border-monokai-border';
      case 'Medium':
      default:
        return 'text-monokai-yellow bg-monokai-yellow/10 border-monokai-yellow/30';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
      onClick={() => onSelectDeal(deal)}
      className="p-3.5 rounded-xl bg-monokai-subpanel hover:bg-monokai-hover border border-monokai-border hover:border-teal-500/50 shadow-md cursor-grab active:cursor-grabbing transition-all select-none group relative"
    >
      {/* Top Header: Deal Title & Priority */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-xs font-semibold text-monokai-text group-hover:text-teal-400 transition-colors line-clamp-2">
          {deal.title}
        </h4>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0 ${getPriorityBadge(deal.priority)}`}>
          {deal.priority}
        </span>
      </div>

      {/* Customer Name */}
      <div className="flex items-center gap-1.5 text-xs text-monokai-muted mb-3 truncate">
        <User size={13} className="text-teal-400 shrink-0" />
        <span
          onClick={(e) => {
            if (deal.contact?._id || deal.contact) {
              e.stopPropagation();
              openContactDetail(deal.contact._id || deal.contact);
            }
          }}
          className={`truncate font-medium ${deal.contact ? 'hover:text-teal-400 hover:underline cursor-pointer' : ''}`}
        >
          {deal.customerName || deal.contact?.name || 'General Customer'}
        </span>
      </div>

      {/* Footer: Value & Close Date */}
      <div className="flex items-center justify-between pt-2.5 border-t border-monokai-border/60 text-xs">
        {/* Deal Value */}
        <div className="font-bold text-teal-400 font-mono text-sm tracking-tight">
          ${Number(deal.value || 0).toLocaleString()}
        </div>

        {/* Expected Close Date */}
        <div className={`flex items-center gap-1 text-[11px] ${
          overdue ? 'text-monokai-pink font-semibold' : 'text-monokai-dim'
        }`}>
          {overdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
          <span>
            {deal.expectedCloseDate
              ? new Date(deal.expectedCloseDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })
              : 'TBD'}
          </span>
        </div>
      </div>
    </div>
  );
};
