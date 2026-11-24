import React from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useCRM } from '../../context/CRMContext';
import {
  Briefcase,
  DollarSign,
  Calendar,
  User,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Clock
} from 'lucide-react';

export const DealDetailModal = ({ isOpen, onClose, deal, onEdit, onDeleteSuccess, onStageChange }) => {
  const { addToast, triggerRefresh, openContactDetail } = useCRM();

  if (!isOpen || !deal) return null;

  const stages = ['Lead In', 'Contact Made', 'Proposal Sent', 'Negotiation', 'Closed Won'];

  const handleDelete = async () => {
    if (!window.confirm(`Delete deal "${deal.title}"?`)) return;
    try {
      await api.deleteDeal(deal._id);
      addToast('Deal deleted', 'success');
      triggerRefresh();
      if (onDeleteSuccess) onDeleteSuccess();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to delete deal', 'error');
    }
  };

  const handleStageSelect = async (newStage) => {
    try {
      await api.updateDealStage(deal._id, newStage);
      addToast(newStage === 'Closed Won' ? 'Deal closed won! Revenue updated.' : `Stage moved to ${newStage}`, 'success');
      triggerRefresh();
      if (onStageChange) onStageChange(deal._id, newStage);
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to change stage', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal.title}
      subtitle={`Pipeline Deal • $${Number(deal.value || 0).toLocaleString()}`}
    >
      <div className="space-y-6">
        {/* Deal Value Hero Card */}
        <div className="p-4 rounded-xl bg-monokai-subpanel border border-monokai-border flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-monokai-muted">
              Deal Value
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-teal-400 font-mono">
              ${Number(deal.value || 0).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(deal)}
              className="px-3 py-1.5 rounded-lg bg-monokai-panel hover:bg-monokai-hover border border-monokai-border text-xs text-monokai-text font-medium flex items-center gap-1.5 transition-colors"
            >
              <Edit2 size={13} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg bg-monokai-panel hover:bg-monokai-pink/20 border border-monokai-border hover:border-monokai-pink/40 text-monokai-muted hover:text-monokai-pink transition-colors"
              title="Delete Deal"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Stage Progression Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-2">
            Advance Deal Stage
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {stages.map((st) => {
              const isCurrent = deal.stage === st;
              return (
                <button
                  key={st}
                  onClick={() => handleStageSelect(st)}
                  className={`p-2 rounded-lg text-xs font-medium text-center transition-all ${
                    isCurrent
                      ? 'bg-teal-500 text-monokai-darker font-bold shadow-teal-glow'
                      : 'bg-monokai-subpanel hover:bg-monokai-hover text-monokai-muted border border-monokai-border hover:text-monokai-text'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-monokai-darker border border-monokai-border">
            <span className="text-monokai-dim block mb-1 flex items-center gap-1">
              <User size={13} className="text-teal-400" /> Customer Contact
            </span>
            <div className="font-medium text-monokai-text">
              {deal.customerName || deal.contact?.name || 'General Customer'}
            </div>
            {deal.contact?._id && (
              <button
                onClick={() => {
                  onClose();
                  openContactDetail(deal.contact._id);
                }}
                className="text-[11px] text-teal-400 hover:underline mt-1 block"
              >
                View Contact Record & Activity →
              </button>
            )}
          </div>

          <div className="p-3 rounded-lg bg-monokai-darker border border-monokai-border">
            <span className="text-monokai-dim block mb-1 flex items-center gap-1">
              <Calendar size={13} className="text-monokai-yellow" /> Expected Close
            </span>
            <div className="font-medium text-monokai-text">
              {deal.expectedCloseDate
                ? new Date(deal.expectedCloseDate).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Not scheduled'}
            </div>
          </div>
        </div>

        {/* Notes */}
        {deal.notes && (
          <div className="p-3.5 rounded-lg bg-monokai-darker border border-monokai-border text-xs">
            <span className="text-monokai-dim font-semibold uppercase tracking-wider block mb-1">
              Deal Notes
            </span>
            <p className="text-monokai-muted whitespace-pre-wrap">{deal.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
