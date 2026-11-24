import React, { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard = ({
  deals = [],
  onDealStageMoved,
  onSelectDeal,
  onAddDealInStage
}) => {
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = [
    'Lead In',
    'Contact Made',
    'Proposal Sent',
    'Negotiation',
    'Closed Won'
  ];

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.setData('text/plain', deal._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropDeal = (targetStage) => {
    if (!draggedDeal) return;
    if (draggedDeal.stage !== targetStage) {
      onDealStageMoved(draggedDeal, targetStage);
    }
    setDraggedDeal(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[550px] scrollbar-thin">
      {stages.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage);

        return (
          <KanbanColumn
            key={stage}
            stage={stage}
            deals={stageDeals}
            onDragStart={handleDragStart}
            onDropDeal={handleDropDeal}
            onSelectDeal={onSelectDeal}
            onAddDealInStage={onAddDealInStage}
          />
        );
      })}
    </div>
  );
};
