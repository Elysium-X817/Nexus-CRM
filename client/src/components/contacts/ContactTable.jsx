import React from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Clock,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  Calendar
} from 'lucide-react';

export const ContactTable = ({ contacts, onSelectContact, onEditContact, onDeleteContact }) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!contacts.length) {
    return (
      <div className="bg-monokai-panel border border-monokai-border rounded-xl p-12 text-center shadow-monokai-card">
        <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-3">
          <User size={24} />
        </div>
        <h3 className="text-base font-semibold text-monokai-text">No contacts found</h3>
        <p className="text-xs text-monokai-muted mt-1 max-w-sm mx-auto">
          Try clearing search filters or add a new customer contact to your CRM workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-monokai-panel border border-monokai-border rounded-xl shadow-monokai-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-monokai-border bg-monokai-subpanel/70 text-[11px] uppercase tracking-wider text-monokai-muted font-semibold">
              <th className="py-3 px-4 sm:px-6">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Lead Status</th>
              <th className="py-3 px-4">Last Contacted</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-monokai-border text-xs">
            {contacts.map((contact) => (
              <tr
                key={contact._id}
                onClick={() => onSelectContact(contact._id)}
                className="hover:bg-monokai-hover/60 cursor-pointer transition-colors group"
              >
                {/* 1. Name */}
                <td className="py-3.5 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                      {contact.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-monokai-text group-hover:text-teal-400 transition-colors">
                        {contact.name}
                      </div>
                      {contact.jobTitle && (
                        <div className="text-[11px] text-monokai-dim">{contact.jobTitle}</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* 2. Email */}
                <td className="py-3.5 px-4 text-monokai-muted">
                  <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <Mail size={13} className="text-monokai-dim shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                </td>

                {/* 3. Phone */}
                <td className="py-3.5 px-4 text-monokai-muted whitespace-nowrap">
                  {contact.phone ? (
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-monokai-dim shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  ) : (
                    <span className="text-monokai-dim">—</span>
                  )}
                </td>

                {/* 4. Company */}
                <td className="py-3.5 px-4 text-monokai-text font-medium whitespace-nowrap">
                  {contact.company ? (
                    <div className="flex items-center gap-1.5">
                      <Building size={13} className="text-teal-400/80 shrink-0" />
                      <span>{contact.company}</span>
                    </div>
                  ) : (
                    <span className="text-monokai-dim">—</span>
                  )}
                </td>

                {/* 5. Lead Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(contact.status)}`}>
                    {contact.status}
                  </span>
                </td>

                {/* 6. Last Contacted Date */}
                <td className="py-3.5 px-4 text-monokai-muted whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-monokai-dim shrink-0" />
                    <span>{formatDate(contact.lastContactedDate)}</span>
                  </div>
                </td>

                {/* 7. Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onSelectContact(contact._id)}
                      className="p-1.5 rounded-md hover:bg-monokai-subpanel text-monokai-dim hover:text-teal-400 transition-colors"
                      title="View Details & Timeline"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onEditContact(contact)}
                      className="p-1.5 rounded-md hover:bg-monokai-subpanel text-monokai-dim hover:text-monokai-yellow transition-colors"
                      title="Edit Contact"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteContact(contact)}
                      className="p-1.5 rounded-md hover:bg-monokai-pink/15 text-monokai-dim hover:text-monokai-pink transition-colors"
                      title="Delete Contact"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
