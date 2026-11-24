import React, { createContext, useContext, useState, useCallback } from 'react';

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals state
  const [newContactModal, setNewContactModal] = useState({ isOpen: false, initialData: null });
  const [newDealModal, setNewDealModal] = useState({ isOpen: false, initialData: null });
  const [newTaskModal, setNewTaskModal] = useState({ isOpen: false, initialData: null });
  const [contactDetailModal, setContactDetailModal] = useState({ isOpen: false, contactId: null });
  const [dealDetailModal, setDealDetailModal] = useState({ isOpen: false, deal: null });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Quick Action helpers
  const openNewContact = (initialData = null) => {
    setNewContactModal({ isOpen: true, initialData });
  };
  const closeNewContact = () => setNewContactModal({ isOpen: false, initialData: null });

  const openNewDeal = (initialData = null) => {
    setNewDealModal({ isOpen: true, initialData });
  };
  const closeNewDeal = () => setNewDealModal({ isOpen: false, initialData: null });

  const openNewTask = (initialData = null) => {
    setNewTaskModal({ isOpen: true, initialData });
  };
  const closeNewTask = () => setNewTaskModal({ isOpen: false, initialData: null });

  const openContactDetail = (contactId) => {
    setContactDetailModal({ isOpen: true, contactId });
  };
  const closeContactDetail = () => setContactDetailModal({ isOpen: false, contactId: null });

  const openDealDetail = (deal) => {
    setDealDetailModal({ isOpen: true, deal });
  };
  const closeDealDetail = () => setDealDetailModal({ isOpen: false, deal: null });

  return (
    <CRMContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        refreshKey,
        triggerRefresh,
        toasts,
        addToast,
        removeToast,
        // Modal states & controls
        newContactModal,
        openNewContact,
        closeNewContact,
        newDealModal,
        openNewDeal,
        closeNewDeal,
        newTaskModal,
        openNewTask,
        closeNewTask,
        contactDetailModal,
        openContactDetail,
        closeContactDetail,
        dealDetailModal,
        openDealDetail,
        closeDealDetail,
        isSearchOpen,
        setIsSearchOpen
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
