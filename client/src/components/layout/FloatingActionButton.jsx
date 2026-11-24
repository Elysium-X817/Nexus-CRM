import React, { useState, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Plus, UserPlus, Briefcase, CheckSquare, X } from 'lucide-react';

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openNewContact, openNewDeal, openNewTask } = useCRM();
  const fabRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fabRef.current && !fabRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40" ref={fabRef}>
      {/* Speed Dial Options */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5 mb-3 animate-fade-in">
          {/* Quick Contact */}
          <button
            onClick={() => {
              setIsOpen(false);
              openNewContact();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-monokai-panel border border-monokai-border text-xs font-medium text-monokai-text hover:border-teal-500/50 hover:text-teal-400 shadow-xl transition-all group"
          >
            <span>New Customer Contact</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserPlus size={16} />
            </div>
          </button>

          {/* Quick Deal */}
          <button
            onClick={() => {
              setIsOpen(false);
              openNewDeal();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-monokai-panel border border-monokai-border text-xs font-medium text-monokai-text hover:border-monokai-yellow/50 hover:text-monokai-yellow shadow-xl transition-all group"
          >
            <span>New Sales Deal</span>
            <div className="w-8 h-8 rounded-lg bg-monokai-yellow/20 text-monokai-yellow flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase size={16} />
            </div>
          </button>

          {/* Quick Task */}
          <button
            onClick={() => {
              setIsOpen(false);
              openNewTask();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-monokai-panel border border-monokai-border text-xs font-medium text-monokai-text hover:border-monokai-cyan/50 hover:text-monokai-cyan shadow-xl transition-all group"
          >
            <span>New Follow-up Task</span>
            <div className="w-8 h-8 rounded-lg bg-monokai-cyan/20 text-monokai-cyan flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckSquare size={16} />
            </div>
          </button>
        </div>
      )}

      {/* Main Floating '+' Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick Action Menu"
        className={`w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-400 text-monokai-darker flex items-center justify-center shadow-teal-glow hover:shadow-teal-glow-lg transition-all transform duration-200 active:scale-95 ${
          isOpen ? 'rotate-45 bg-monokai-hover text-monokai-text' : ''
        }`}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>
    </div>
  );
};
