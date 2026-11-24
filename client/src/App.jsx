import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactsPage } from './pages/ContactsPage';
import { PipelinePage } from './pages/PipelinePage';
import { TasksPage } from './pages/TasksPage';
import { SettingsPage } from './pages/SettingsPage';
import { ContactFormModal } from './components/contacts/ContactFormModal';
import { DealFormModal } from './components/pipeline/DealFormModal';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { Layers } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const {
    currentPage,
    newContactModal,
    closeNewContact,
    newDealModal,
    closeNewDeal,
    newTaskModal,
    closeNewTask,
    triggerRefresh
  } = useCRM();

  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'

  if (loading) {
    return (
      <div className="min-h-screen bg-monokai-bg flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center shadow-teal-glow animate-pulse">
          <Layers size={24} className="text-monokai-darker font-bold" />
        </div>
        <p className="text-xs font-mono text-teal-400 tracking-wider">
          Connecting to CRM workspace...
        </p>
      </div>
    );
  }

  // Not logged in: show Login / Signup
  if (!user) {
    if (authView === 'signup') {
      return <SignupPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSwitchToSignup={() => setAuthView('signup')} />;
  }

  // Logged in: Render SaaS Layout
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'pipeline':
        return <PipelinePage />;
      case 'tasks':
        return <TasksPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout>
      {renderCurrentPage()}

      {/* Global Quick Add Modals */}
      <ContactFormModal
        isOpen={newContactModal.isOpen}
        contactToEdit={newContactModal.initialData}
        onClose={closeNewContact}
        onSuccess={triggerRefresh}
      />

      <DealFormModal
        isOpen={newDealModal.isOpen}
        dealToEdit={newDealModal.initialData}
        initialStage="Lead In"
        onClose={closeNewDeal}
        onSuccess={triggerRefresh}
      />

      <TaskFormModal
        isOpen={newTaskModal.isOpen}
        taskToEdit={newTaskModal.initialData}
        onClose={closeNewTask}
        onSuccess={triggerRefresh}
      />
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CRMProvider>
        <AppContent />
      </CRMProvider>
    </AuthProvider>
  );
}
