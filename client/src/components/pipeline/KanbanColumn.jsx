import React, { useState } from 'react';
import { DealCard } from './DealCard';
import { Plus } from 'lucide-react';

export const KanbanColumn = ({
  stage,
  deals = [],
  onDragStart,
  onDropDeal,
  onSelectDeal,
  onAddDealInStage
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Check if leaving the column element itself
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropDeal(stage);
  };

  const getStageHeaderColor = (st) => {
    switch (st) {
      case 'Lead In': return 'border-t-teal-400';
      case 'Contact Made': return 'border-t-monokai-cyan';
      case 'Proposal Sent': return 'border-t-monokai-yellow';
      case 'Negotiation': return 'border-t-monokai-orange';
      case 'Closed Won': return 'border-t-monokai-green';
      default: return 'border-t-teal-500';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col bg-monokai-panel border rounded-xl overflow-hidden shadow-monokai-card transition-all w-72 sm:w-80 shrink-0 border-t-4 ${getStageHeaderColor(stage)} ${
        isDragOver
          ? 'border-teal-400 bg-monokai-panel/90 shadow-teal-glow ring-2 ring-teal-500/30'
          : 'border-monokai-border'
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-monokai-border/80 bg-monokai-subpanel/50 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-monokai-text">
              {stage}
            </h3>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-monokai-darker text-teal-400 border border-monokai-border">
              {deals.length}
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-teal-400 mt-1">
            ${totalValue.toLocaleString()}
          </div>
        </div>

        <button
          onClick={() => onAddDealInStage(stage)}
          className="p-1 rounded-md text-monokai-dim hover:text-teal-400 hover:bg-monokai-hover transition-colors"
          title={`Add deal to ${stage}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Column Cards Drop Area */}
      <div className={`p-2.5 flex-1 overflow-y-auto space-y-2.5 min-h-[480px] max-h-[calc(100vh-250px)] transition-colors ${
        isDragOver ? 'bg-teal-500/5' : ''
      }`}>
        {deals.length === 0 ? (
          <div className="h-40 flex items-center justify-center border-2 border-dashed border-monokai-border/50 rounded-xl text-center p-4">
            <span className="text-xs text-monokai-dim">
              Drag deals here or click '+'
            </span>
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal._id}
              deal={deal}
              onDragStart={onDragStart}
              onSelectDeal={onSelectDeal}
            />
          ))
        )}
      </div>
    </div>
  );
};
