import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useCRM } from '../../context/CRMContext';
import { User, Mail, Phone, Building, Briefcase, Tag, FileText } from 'lucide-react';

export const ContactFormModal = ({ isOpen, onClose, contactToEdit, onSuccess }) => {
  const { addToast, triggerRefresh } = useCRM();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    status: 'New',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        name: contactToEdit.name || '',
        email: contactToEdit.email || '',
        phone: contactToEdit.phone || '',
        company: contactToEdit.company || '',
        jobTitle: contactToEdit.jobTitle || '',
        status: contactToEdit.status || 'New',
        notes: contactToEdit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        status: 'New',
        notes: ''
      });
    }
    setError('');
  }, [contactToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email) {
      setError('Name and Email are required.');
      return;
    }

    setLoading(true);
    try {
      if (contactToEdit?._id) {
        await api.updateContact(contactToEdit._id, formData);
        addToast('Contact updated successfully', 'success');
      } else {
        await api.createContact(formData);
        addToast('Contact added to CRM workspace', 'success');
      }
      triggerRefresh();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contactToEdit ? 'Edit Customer Contact' : 'Add New Customer Contact'}
      subtitle="HubSpot-style contact profile with company, status, and touchpoints"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-monokai-pink/10 border border-monokai-pink/30 text-xs text-monokai-pink">
            {error}
          </div>
        )}

        {/* Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Sarah Jenkins"
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@hyperflow.io"
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Company and Job Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Company
            </label>
            <div className="relative">
              <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="HyperFlow Technologies"
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Job Title
            </label>
            <div className="relative">
              <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="VP of Product"
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Phone and Lead Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 234-5678"
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Lead Status
            </label>
            <div className="relative">
              <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text focus:outline-none focus:border-teal-500"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
            Internal Account Notes
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Key decision criteria, budget limits, or meeting summary notes..."
            className="w-full p-3 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Buttons */}
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
            {loading ? 'Saving...' : contactToEdit ? 'Save Changes' : 'Create Contact'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
