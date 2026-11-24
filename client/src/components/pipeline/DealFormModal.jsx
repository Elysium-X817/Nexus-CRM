import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useCRM } from '../../context/CRMContext';
import { Briefcase, DollarSign, Calendar, User, Tag, FileText } from 'lucide-react';

export const DealFormModal = ({ isOpen, onClose, dealToEdit, initialStage = 'Lead In', onSuccess }) => {
  const { addToast, triggerRefresh } = useCRM();
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    contact: '',
    value: '',
    stage: initialStage,
    expectedCloseDate: '',
    priority: 'Medium',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch contacts for dropdown
  useEffect(() => {
    if (isOpen) {
      api.getContacts()
        .then((data) => setContacts(data))
        .catch((err) => console.error('Failed to load contacts for deal form:', err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (dealToEdit) {
      setFormData({
        title: dealToEdit.title || '',
        customerName: dealToEdit.customerName || '',
        contact: dealToEdit.contact?._id || dealToEdit.contact || '',
        value: dealToEdit.value || '',
        stage: dealToEdit.stage || initialStage,
        expectedCloseDate: dealToEdit.expectedCloseDate ? dealToEdit.expectedCloseDate.slice(0, 10) : '',
        priority: dealToEdit.priority || 'Medium',
        notes: dealToEdit.notes || ''
      });
    } else {
      const defaultDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      setFormData({
        title: '',
        customerName: '',
        contact: '',
        value: '',
        stage: initialStage,
        expectedCloseDate: defaultDate,
        priority: 'Medium',
        notes: ''
      });
    }
    setError('');
  }, [dealToEdit, initialStage, isOpen]);

  const handleContactSelect = (contactId) => {
    const selected = contacts.find((c) => c._id === contactId);
    setFormData((prev) => ({
      ...prev,
      contact: contactId,
      customerName: selected ? selected.name : prev.customerName
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.value) {
      setError('Deal Title and Deal Value are required.');
      return;
    }

    setLoading(true);
    try {
      if (dealToEdit?._id) {
        await api.updateDeal(dealToEdit._id, formData);
        addToast('Deal updated successfully', 'success');
      } else {
        await api.createDeal(formData);
        addToast('Deal added to visual pipeline', 'success');
      }
      triggerRefresh();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save deal');
    } finally {
      setLoading(false);
    }
  };

  const stages = ['Lead In', 'Contact Made', 'Proposal Sent', 'Negotiation', 'Closed Won'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dealToEdit ? 'Edit Sales Deal' : 'Add New Sales Deal'}
      subtitle="Track pipeline value, stage progression, and close dates"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-monokai-pink/10 border border-monokai-pink/30 text-xs text-monokai-pink">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
            Deal Title *
          </label>
          <div className="relative">
            <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Enterprise Cloud Annual Subscription"
              className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Customer / Contact link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Link Customer Contact
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
              <select
                value={formData.contact}
                onChange={(e) => handleContactSelect(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text focus:outline-none focus:border-teal-500"
              >
                <option value="">-- Select Contact (Optional) --</option>
                {contacts.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Apex Global or John Doe"
              className="w-full px-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Value and Expected Close Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Deal Value ($) *
            </label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
              <input
                type="number"
                required
                min="0"
                step="100"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="25000"
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Expected Close Date
            </label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
              <input
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Pipeline Stage and Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Pipeline Stage
            </label>
            <div className="relative">
              <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text focus:outline-none focus:border-teal-500"
              >
                {stages.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text focus:outline-none focus:border-teal-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
            Deal Notes & Proposed Terms
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Contract details, custom integrations, procurement requirements..."
            className="w-full p-3 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-monokai-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-monokai-muted hover:text-monokai-text hover:bg-monokai-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-monokai-darker font-bold text-xs tracking-wide shadow-teal-glow transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : dealToEdit ? 'Save Changes' : 'Create Deal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
