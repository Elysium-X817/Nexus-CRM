import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCRM } from '../context/CRMContext';
import { KanbanBoard } from '../components/pipeline/KanbanBoard';
import { DealFormModal } from '../components/pipeline/DealFormModal';
import { DealDetailModal } from '../components/pipeline/DealDetailModal';
import {
  KanbanSquare,
  Plus,
  DollarSign,
  Briefcase,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const PipelinePage = () => {
  const { refreshKey, triggerRefresh, addToast, newDealModal, closeNewDeal, openNewDeal } = useCRM();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState(null);
  const [initialStageForModal, setInitialStageForModal] = useState('Lead In');
  const [selectedDealForDetail, setSelectedDealForDetail] = useState(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const data = await api.getDeals();
      setDeals(data);
    } catch (err) {
      console.error('Failed to load deals:', err);
      addToast(err.message || 'Failed to load pipeline deals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [refreshKey]);

  // Handle external modal trigger from speed-dial FAB or header
  useEffect(() => {
    if (newDealModal.isOpen) {
      setDealToEdit(null);
      setInitialStageForModal('Lead In');
      setIsFormModalOpen(true);
      closeNewDeal();
    }
  }, [newDealModal.isOpen]);

  const handleDealStageMoved = async (draggedDeal, newStage) => {
    const oldStage = draggedDeal.stage;

    // Optimistic UI update
    setDeals((prev) =>
      prev.map((d) => (d._id === draggedDeal._id ? { ...d, stage: newStage } : d))
    );

    try {
      await api.updateDealStage(draggedDeal._id, newStage);
      if (newStage === 'Closed Won') {
        addToast(`🎉 Deal "${draggedDeal.title}" Won! Total revenue updated.`, 'success');
      } else {
        addToast(`Deal advanced to ${newStage}`, 'success');
      }
      triggerRefresh();
    } catch (err) {
      // Revert optimistic update on failure
      setDeals((prev) =>
        prev.map((d) => (d._id === draggedDeal._id ? { ...d, stage: oldStage } : d))
      );
      addToast(err.message || 'Failed to update deal stage', 'error');
    }
  };

  const handleAddDealInStage = (stage) => {
    setDealToEdit(null);
    setInitialStageForModal(stage);
    setIsFormModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDealForDetail(null);
    setDealToEdit(deal);
    setIsFormModalOpen(true);
  };

  // Pipeline total metrics
  const totalPipelineValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const wonValue = deals.filter((d) => d.stage === 'Closed Won').reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-monokai-text">
              Sales Pipeline
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-400 border border-teal-500/30">
              {deals.length} Deals
            </span>
          </div>
          <p className="text-xs text-monokai-muted mt-1">
            Drag and drop deals across stages. Moving to "Closed Won" automatically credits dashboard revenue.
          </p>
        </div>

        {/* Stats & Quick Add */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-monokai-panel border border-monokai-border px-3.5 py-1.5 rounded-lg text-xs">
            <div>
              <span className="text-monokai-dim block text-[10px] uppercase">Active Pipeline</span>
              <span className="font-bold text-teal-400 font-mono">
                ${(totalPipelineValue - wonValue).toLocaleString()}
              </span>
            </div>
            <div className="w-px h-6 bg-monokai-border" />
            <div>
              <span className="text-monokai-dim block text-[10px] uppercase">Won Revenue</span>
              <span className="font-bold text-monokai-green font-mono">
                ${wonValue.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleAddDealInStage('Lead In')}
            className="px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-monokai-darker font-bold text-xs tracking-wide shadow-teal-glow transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            Add Deal
          </button>
        </div>
      </div>

      {/* Visual Kanban Board */}
      {loading ? (
        <div className="bg-monokai-panel border border-monokai-border rounded-xl p-20 text-center text-xs text-monokai-muted">
          Loading visual sales pipeline...
        </div>
      ) : (
        <KanbanBoard
          deals={deals}
          onDealStageMoved={handleDealStageMoved}
          onSelectDeal={(deal) => setSelectedDealForDetail(deal)}
          onAddDealInStage={handleAddDealInStage}
        />
      )}

      {/* Deal Detail Modal */}
      <DealDetailModal
        isOpen={!!selectedDealForDetail}
        deal={selectedDealForDetail}
        onClose={() => setSelectedDealForDetail(null)}
        onEdit={handleEditDeal}
        onDeleteSuccess={fetchDeals}
        onStageChange={(id, newStage) => {
          setDeals((prev) =>
            prev.map((d) => (d._id === id ? { ...d, stage: newStage } : d))
          );
        }}
      />

      {/* Deal Form Modal (Create / Edit) */}
      <DealFormModal
        isOpen={isFormModalOpen}
        dealToEdit={dealToEdit}
        initialStage={initialStageForModal}
        onClose={() => {
          setIsFormModalOpen(false);
          setDealToEdit(null);
        }}
        onSuccess={fetchDeals}
      />
    </div>
  );
};
