import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FloatingActionButton } from './FloatingActionButton';
import { SearchModal } from '../common/SearchModal';
import { ToastContainer } from '../common/Toast';
import { useCRM } from '../../context/CRMContext';

export const Layout = ({ children }) => {
  const { isSearchOpen, setIsSearchOpen } = useCRM();

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  return (
    <div className="flex h-screen bg-monokai-bg text-monokai-text overflow-hidden">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Page View Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-monokai-bg">
          {children}
        </main>
      </div>

      {/* Circular floating '+' button in bottom-right */}
      <FloatingActionButton />

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
