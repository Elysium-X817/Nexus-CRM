import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCRM } from '../context/CRMContext';
import { ContactTable } from '../components/contacts/ContactTable';
import { ContactModal } from '../components/contacts/ContactModal';
import { ContactFormModal } from '../components/contacts/ContactFormModal';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const ContactsPage = () => {
  const { refreshKey, triggerRefresh, addToast, contactDetailModal, openContactDetail, closeContactDetail } = useCRM();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form modal state (Create / Edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter && statusFilter !== 'All') params.status = statusFilter;

      const data = await api.getContacts(params);
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contacts:', err);
      addToast(err.message || 'Failed to fetch contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, statusFilter, refreshKey]);

  const handleEdit = (contact) => {
    setContactToEdit(contact);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (contact) => {
    if (!window.confirm(`Are you sure you want to delete ${contact.name}?`)) return;
    try {
      await api.deleteContact(contact._id);
      addToast('Contact deleted successfully', 'success');
      triggerRefresh();
      fetchContacts();
    } catch (err) {
      addToast(err.message || 'Failed to delete contact', 'error');
    }
  };

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Lost'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-monokai-text">
              Customer Directory
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-400 border border-teal-500/30">
              {contacts.length} Total
            </span>
          </div>
          <p className="text-xs text-monokai-muted mt-1">
            Search, filter, view activity history, and log customer touchpoints.
          </p>
        </div>

        <button
          onClick={() => {
            setContactToEdit(null);
            setIsFormModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-monokai-darker font-bold text-xs tracking-wide shadow-teal-glow transition-all flex items-center gap-2 self-start sm:self-center"
        >
          <Plus size={16} />
          Add Customer Contact
        </button>
      </div>

      {/* Search & Status Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-monokai-panel border border-monokai-border p-3.5 rounded-xl shadow-monokai-card">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-monokai-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, company, title..."
            className="w-full pl-9 pr-3 py-2 bg-monokai-darker border border-monokai-border rounded-lg text-xs text-monokai-text placeholder-monokai-dim focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Lead Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-monokai-dim mr-1 flex items-center gap-1 shrink-0">
            <Filter size={12} /> Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-teal-500 text-monokai-darker font-bold shadow-teal-glow'
                  : 'bg-monokai-subpanel hover:bg-monokai-hover text-monokai-muted hover:text-monokai-text'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      {loading ? (
        <div className="bg-monokai-panel border border-monokai-border rounded-xl p-16 text-center text-xs text-monokai-muted">
          Loading contacts directory...
        </div>
      ) : (
        <ContactTable
          contacts={contacts}
          onSelectContact={(id) => openContactDetail(id)}
          onEditContact={handleEdit}
          onDeleteContact={handleDelete}
        />
      )}

      {/* Full Detail & Activity Timeline Modal */}
      <ContactModal
        isOpen={contactDetailModal.isOpen}
        contactId={contactDetailModal.contactId}
        onClose={closeContactDetail}
        onEdit={(contact) => {
          closeContactDetail();
          handleEdit(contact);
        }}
        onDeleteSuccess={fetchContacts}
      />

      {/* Add / Edit Form Modal */}
      <ContactFormModal
        isOpen={isFormModalOpen}
        contactToEdit={contactToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setContactToEdit(null);
        }}
        onSuccess={fetchContacts}
      />
    </div>
  );
};
