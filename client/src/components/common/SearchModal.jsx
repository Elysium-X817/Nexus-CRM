import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Briefcase, CheckSquare, X, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useCRM } from '../../context/CRMContext';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ contacts: [], deals: [], tasks: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { setCurrentPage, openContactDetail, openDealDetail } = useCRM();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({ contacts: [], deals: [], tasks: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ contacts: [], deals: [], tasks: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.globalSearch(query);
        setResults(data);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results.contacts.length + results.deals.length + results.tasks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className="relative w-full max-w-xl bg-monokai-panel border border-monokai-border rounded-xl shadow-2xl overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-monokai-border gap-3 bg-monokai-subpanel/50">
          <Search size={20} className="text-teal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers, deals, companies, tasks..."
            className="w-full bg-transparent text-monokai-text placeholder-monokai-dim text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-monokai-dim hover:text-monokai-text p-1"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-monokai-dim bg-monokai-darker border border-monokai-border rounded">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {loading && (
            <div className="py-8 text-center text-xs text-monokai-muted">Searching CRM workspace...</div>
          )}

          {!loading && query && totalResults === 0 && (
            <div className="py-8 text-center text-xs text-monokai-dim">
              No results found for "{query}".
            </div>
          )}

          {!loading && !query && (
            <div className="py-6 text-center text-xs text-monokai-dim">
              Type at least 1 character to search across your contacts, pipeline, and tasks.
            </div>
          )}

          {/* Contacts */}
          {results.contacts.length > 0 && (
            <div className="mb-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 px-3 py-1 flex items-center gap-1.5">
                <User size={13} /> Contacts ({results.contacts.length})
              </div>
              <div className="space-y-1 mt-1">
                {results.contacts.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => {
                      onClose();
                      setCurrentPage('contacts');
                      openContactDetail(c._id);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-monokai-hover cursor-pointer transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-monokai-text group-hover:text-teal-400 transition-colors">
                        {c.name}
                      </p>
                      <p className="text-xs text-monokai-muted">
                        {c.company ? `${c.company} • ` : ''}{c.email}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-monokai-subpanel text-monokai-muted border border-monokai-border">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deals */}
          {results.deals.length > 0 && (
            <div className="mb-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-monokai-yellow px-3 py-1 flex items-center gap-1.5">
                <Briefcase size={13} /> Deals ({results.deals.length})
              </div>
              <div className="space-y-1 mt-1">
                {results.deals.map((d) => (
                  <div
                    key={d._id}
                    onClick={() => {
                      onClose();
                      setCurrentPage('pipeline');
                      openDealDetail(d);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-monokai-hover cursor-pointer transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-monokai-text group-hover:text-monokai-yellow transition-colors">
                        {d.title}
                      </p>
                      <p className="text-xs text-monokai-muted">
                        {d.customerName} • ${Number(d.value).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-monokai-subpanel text-teal-400 border border-teal-500/30">
                      {d.stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {results.tasks.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-monokai-cyan px-3 py-1 flex items-center gap-1.5">
                <CheckSquare size={13} /> Tasks ({results.tasks.length})
              </div>
              <div className="space-y-1 mt-1">
                {results.tasks.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => {
                      onClose();
                      setCurrentPage('tasks');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-monokai-hover cursor-pointer transition-colors group"
                  >
                    <div>
                      <p className={`text-sm font-medium ${t.completed ? 'line-through text-monokai-dim' : 'text-monokai-text group-hover:text-teal-400'}`}>
                        {t.title}
                      </p>
                      <p className="text-xs text-monokai-muted">
                        Due: {new Date(t.dueDate).toLocaleDateString()} {t.customerName ? `• ${t.customerName}` : ''}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${t.completed ? 'bg-monokai-hover text-monokai-dim' : 'bg-teal-500/20 text-teal-300'}`}>
                      {t.completed ? 'Done' : t.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
