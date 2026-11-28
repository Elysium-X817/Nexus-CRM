import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useCRM } from '../../context/CRMContext';
import { CheckSquare, Calendar, User, Tag, Clock, FileText } from 'lucide-react';

export const TaskFormModal = ({ isOpen, onClose, taskToEdit, initialContact = null, onSuccess }) => {
  const { addToast, triggerRefresh } = useCRM();
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    contact: '',
    dueDate: '',
    priority: 'Medium',
    taskType: 'Follow-up',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.getContacts()
        .then((data) => setContacts(data))
        .catch((err) => console.error('Failed to load contacts for task form:', err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        customerName: taskToEdit.customerName || '',
        contact: taskToEdit.contact?._id || taskToEdit.contact || '',
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.slice(0, 10) : '',
        priority: taskToEdit.priority || 'Medium',
        taskType: taskToEdit.taskType || 'Follow-up',
        notes: taskToEdit.notes || ''
      });
    } else {
      // Default due date: tomorrow or today
      const defaultDate = new Date().toISOString().slice(0, 10);
      setFormData({
        title: '',
        customerName: initialContact?.name || '',
        contact: initialContact?._id || '',
        dueDate: defaultDate,
        priority: 'Medium',
        taskType: 'Follow-up',
        notes: ''
      });
    }
    setError('');
  }, [taskToEdit, initialContact, isOpen]);

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

    if (!formData.title || !formData.dueDate) {
      setError('Task Title and Due Date are required.');
      return;
    }

    const payload = {
      ...formData,
      contact: formData.contact ? formData.contact : null
    }

    setLoading(true);
    try {
      if (taskToEdit?._id) {
        await api.updateTask(taskToEdit._id, formData);
        addToast('Task updated successfully', 'success');
      } else {
        await api.createTask(formData);
        addToast('Follow-up task scheduled', 'success');
      }
      triggerRefresh();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const taskTypes = ['Follow-up', 'Call', 'Meeting', 'Email', 'Review'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Follow-up Task' : 'Schedule Customer Follow-up'}
      subtitle="Keep track of timely commitments, outreach, and reminders"
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
            Task Title / Action Item *
          </label>
          <div className="relative">
            <CheckSquare size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Call Sarah Jenkins to review technical proposal"
              className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Customer Link */}
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
              placeholder="e.g. Sarah Jenkins or HyperFlow"
              className="w-full px-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Due Date & Task Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Due Date *
            </label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
              Task Type
            </label>
            <select
              value={formData.taskType}
              onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
              className="w-full px-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-sm text-monokai-text focus:outline-none focus:border-teal-500"
            >
              {taskTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Low', 'Medium', 'High'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFormData({ ...formData, priority: p })}
                className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  formData.priority === p
                    ? p === 'High'
                      ? 'bg-monokai-pink/20 text-monokai-pink border-monokai-pink/60'
                      : p === 'Medium'
                      ? 'bg-monokai-yellow/20 text-monokai-yellow border-monokai-yellow/60'
                      : 'bg-teal-500/20 text-teal-400 border-teal-500/60'
                    : 'bg-monokai-darker text-monokai-muted border-monokai-border hover:bg-monokai-hover'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-monokai-muted mb-1.5">
            Additional Context or Notes
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Key discussion points, phone numbers, or links..."
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
            {loading ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Schedule Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
