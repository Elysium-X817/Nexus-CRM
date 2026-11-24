import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useCRM } from '../../context/CRMContext';
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Clock,
  Calendar,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  PhoneCall,
  Users,
  CheckCircle2,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const ContactModal = ({ isOpen, onClose, contactId, onEdit, onDeleteSuccess }) => {
  const { addToast, triggerRefresh, openNewDeal, openNewTask } = useCRM();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' or 'details' or 'deals'

  // New activity form state
  const [activityType, setActivityType] = useState('Call');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [submittingActivity, setSubmittingActivity] = useState(false);
  const [deletingContact, setDeletingContact] = useState(false);

  const fetchContactDetails = async () => {
    if (!contactId) return;
    try {
      setLoading(true);
      const res = await api.getContact(contactId);
      setData(res);
    } catch (err) {
      console.error('Failed to load contact details:', err);
      addToast(err.message || 'Failed to load contact', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && contactId) {
      fetchContactDetails();
      setActivityTitle('');
      setActivityDesc('');
    }
  }, [isOpen, contactId]);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!activityTitle.trim()) {
      addToast('Please enter an activity title or topic', 'error');
      return;
    }

    try {
      setSubmittingActivity(true);
      await api.createActivity({
        contactId,
        type: activityType,
        title: activityTitle,
        description: activityDesc,
        date: new Date()
      });

      addToast('Activity logged to timeline', 'success');
      setActivityTitle('');
      setActivityDesc('');
      triggerRefresh();
      fetchContactDetails();
    } catch (err) {
      addToast(err.message || 'Failed to log activity', 'error');
    } finally {
      setSubmittingActivity(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!window.confirm(`Are you sure you want to delete ${data?.contact?.name}? This will unlink related deals and tasks.`)) {
      return;
    }

    try {
      setDeletingContact(true);
      await api.deleteContact(contactId);
      addToast('Contact deleted from workspace', 'success');
      triggerRefresh();
      if (onDeleteSuccess) onDeleteSuccess();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to delete contact', 'error');
    } finally {
      setDeletingContact(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Qualified':
        return 'bg-monokai-green/15 text-monokai-green border-monokai-green/30';
      case 'Contacted':
        return 'bg-monokai-yellow/15 text-monokai-yellow border-monokai-yellow/30';
      case 'Lost':
        return 'bg-monokai-pink/15 text-monokai-pink border-monokai-pink/30';
      case 'New':
      default:
        return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call': return PhoneCall;
      case 'Meeting': return Users;
      case 'Email': return Mail;
      default: return MessageSquare;
    }
  };

  if (!isOpen) return null;

  const contact = data?.contact;
  const activities = data?.activities || [];
  const deals = data?.deals || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      title={contact?.name || 'Customer Details'}
      subtitle={contact?.company ? `${contact.company} • ${contact.jobTitle || 'Lead'}` : 'Customer Profile'}
    >
      {loading ? (
        <div className="py-16 text-center text-sm text-monokai-muted">
          Loading customer record & activity timeline...
        </div>
      ) : !contact ? (
        <div className="py-16 text-center text-sm text-monokai-pink">
          Contact not found or has been removed.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Profile Summary Bar */}
          <div className="p-4 rounded-xl bg-monokai-subpanel border border-monokai-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center font-bold text-lg shadow-sm">
                {contact.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-monokai-text">{contact.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>
                <p className="text-xs text-monokai-muted mt-0.5">
                  {contact.jobTitle ? `${contact.jobTitle} at ` : ''}{contact.company || 'Private Customer'}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onEdit(contact)}
                className="px-3 py-1.5 rounded-lg bg-monokai-panel hover:bg-monokai-hover border border-monokai-border text-xs text-monokai-text font-medium flex items-center gap-1.5 transition-colors"
              >
                <Edit3 size={13} />
                Edit
              </button>
              <button
                onClick={handleDeleteContact}
                disabled={deletingContact}
                className="p-1.5 rounded-lg bg-monokai-panel hover:bg-monokai-pink/20 border border-monokai-border hover:border-monokai-pink/40 text-monokai-muted hover:text-monokai-pink transition-colors"
                title="Delete Contact"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-monokai-darker border border-monokai-border">
              <span className="text-monokai-dim block mb-1 flex items-center gap-1">
                <Mail size={12} className="text-teal-400" /> Email Address
              </span>
              <a href={`mailto:${contact.email}`} className="text-monokai-text hover:text-teal-400 font-medium truncate block">
                {contact.email}
              </a>
            </div>

            <div className="p-3 rounded-lg bg-monokai-darker border border-monokai-border">
              <span className="text-monokai-dim block mb-1 flex items-center gap-1">
                <Phone size={12} className="text-monokai-yellow" /> Phone Number
              </span>
              <span className="text-monokai-text font-medium">
                {contact.phone || 'None recorded'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-monokai-darker border border-monokai-border">
              <span className="text-monokai-dim block mb-1 flex items-center gap-1">
                <Clock size={12} className="text-monokai-cyan" /> Last Contacted
              </span>
              <span className="text-monokai-text font-medium">
                {contact.lastContactedDate
                  ? new Date(contact.lastContactedDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Never'}
              </span>
            </div>
          </div>

          {contact.notes && (
            <div className="p-3.5 rounded-lg bg-monokai-darker/70 border border-monokai-border text-xs">
              <span className="text-monokai-dim font-semibold uppercase tracking-wider block mb-1">
                Account Notes
              </span>
              <p className="text-monokai-muted whitespace-pre-wrap">{contact.notes}</p>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-monokai-border">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'timeline'
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-monokai-muted hover:text-monokai-text'
              }`}
            >
              <Clock size={14} />
              Activity Timeline ({activities.length})
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'deals'
                  ? 'border-teal-400 text-teal-400'
                  : 'border-transparent text-monokai-muted hover:text-monokai-text'
              }`}
            >
              <DollarSign size={14} />
              Deals ({deals.length})
            </button>
          </div>

          {/* TAB 1: Activity Timeline & Log Form */}
          {activeTab === 'timeline' && (
            <div className="space-y-5">
              {/* Add Activity Input Box */}
              <form onSubmit={handleAddActivity} className="p-4 rounded-xl bg-monokai-subpanel border border-monokai-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-monokai-text flex items-center gap-1.5">
                    <Plus size={14} className="text-teal-400" /> Log Customer Activity
                  </span>

                  {/* Type buttons */}
                  <div className="flex items-center gap-1">
                    {['Call', 'Meeting', 'Email', 'Note'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setActivityType(type)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                          activityType === type
                            ? 'bg-teal-500 text-monokai-darker font-bold'
                            : 'bg-monokai-panel hover:bg-monokai-hover text-monokai-muted'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder={`Summary (e.g. "${activityType} with ${contact.name} regarding pricing")`}
                  className="w-full px-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-xs text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
                />

                <textarea
                  rows={2}
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  placeholder="Details, key outcomes, next follow-up commitments..."
                  className="w-full px-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-xs text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingActivity}
                    className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-monokai-darker font-bold text-xs tracking-wide shadow-teal-glow transition-all disabled:opacity-50"
                  >
                    {submittingActivity ? 'Logging...' : 'Add Activity & Update Last Contact'}
                  </button>
                </div>
              </form>

              {/* Timeline Feed */}
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <p className="py-6 text-center text-xs text-monokai-dim">
                    No activities logged yet for this contact. Use the box above to log your first call or meeting!
                  </p>
                ) : (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-monokai-border">
                    {activities.map((act) => {
                      const Icon = getActivityIcon(act.type);
                      return (
                        <div key={act._id} className="relative group">
                          {/* Dot / Icon on timeline */}
                          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-monokai-panel border-2 border-teal-500 text-teal-400 flex items-center justify-center shrink-0">
                            <Icon size={10} />
                          </div>

                          {/* Card */}
                          <div className="p-3 rounded-lg bg-monokai-subpanel/80 border border-monokai-border hover:border-teal-500/30 transition-colors">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-monokai-text flex items-center gap-1.5">
                                <span className="text-teal-400 font-mono text-[11px] uppercase">[{act.type}]</span>
                                {act.title}
                              </span>
                              <span className="text-[10px] text-monokai-dim">
                                {new Date(act.date || act.createdAt).toLocaleString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {act.description && (
                              <p className="text-xs text-monokai-muted mt-1.5 whitespace-pre-wrap">
                                {act.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Deals for this contact */}
          {activeTab === 'deals' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-monokai-muted">
                  Deals associated with {contact.name}
                </span>
                <button
                  onClick={() => {
                    openNewDeal({ contact: contact._id, customerName: contact.name });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-400 text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <Plus size={13} /> Add Deal for {contact.name.split(' ')[0]}
                </button>
              </div>

              {deals.length === 0 ? (
                <div className="py-8 text-center text-xs text-monokai-dim">
                  No deals in pipeline for this contact yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {deals.map((deal) => (
                    <div
                      key={deal._id}
                      className="p-3.5 rounded-lg bg-monokai-subpanel border border-monokai-border flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-monokai-text">{deal.title}</p>
                        <p className="text-[11px] text-monokai-muted mt-0.5">
                          Stage: <span className="text-teal-400">{deal.stage}</span> • Expected Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-monokai-yellow font-mono block">
                          ${Number(deal.value).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
