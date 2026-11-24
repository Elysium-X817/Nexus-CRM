import React from 'react';
import { Clock, Phone, Mail, Users, CheckCircle, AlertCircle, ArrowRight, Calendar } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../services/api';

export const TodaysFollowUps = ({ tasks = [], onTaskToggled }) => {
  const { setCurrentPage, openContactDetail, openNewTask, addToast } = useCRM();

  const handleToggle = async (e, taskId) => {
    e.stopPropagation();
    try {
      await api.toggleTask(taskId);
      addToast('Task status updated', 'success');
      if (onTaskToggled) onTaskToggled();
    } catch (err) {
      addToast(err.message || 'Failed to update task', 'error');
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'Call': return Phone;
      case 'Email': return Mail;
      case 'Meeting': return Users;
      default: return Clock;
    }
  };

  const isOverdue = (dateString) => {
    const d = new Date(dateString);
    const now = new Date();
    return d < new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  };

  return (
    <div className="bg-monokai-panel border border-monokai-border rounded-xl p-6 shadow-monokai-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-monokai-border mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-monokai-yellow" />
            <h3 className="text-base font-semibold text-monokai-text">Today's Follow-ups</h3>
          </div>
          <p className="text-xs text-monokai-muted mt-0.5">
            Urgent outreach and scheduled customer commitments
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('tasks')}
          className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[290px] pr-1">
        {tasks.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2">
              <CheckCircle size={20} />
            </div>
            <p className="text-sm font-medium text-monokai-text">You're all caught up!</p>
            <p className="text-xs text-monokai-dim mt-0.5">No urgent follow-ups pending for today.</p>
            <button
              onClick={() => openNewTask()}
              className="mt-3 px-3 py-1.5 rounded-lg bg-monokai-subpanel hover:bg-monokai-hover border border-monokai-border text-xs text-teal-400 font-medium transition-colors"
            >
              + Schedule Follow-up
            </button>
          </div>
        ) : (
          tasks.map((task) => {
            const Icon = getTaskIcon(task.taskType);
            const overdue = isOverdue(task.dueDate);

            return (
              <div
                key={task._id}
                onClick={() => {
                  if (task.contact?._id) {
                    openContactDetail(task.contact._id);
                  }
                }}
                className={`flex items-start justify-between gap-3 p-3 rounded-lg border transition-all ${
                  task.completed
                    ? 'bg-monokai-subpanel/40 border-monokai-border/40 opacity-60'
                    : 'bg-monokai-subpanel hover:bg-monokai-hover border-monokai-border hover:border-teal-500/30 cursor-pointer'
                }`}
              >
                {/* Left: Checkbox + Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={(e) => handleToggle(e, task._id)}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      task.completed
                        ? 'bg-teal-500 border-teal-500 text-monokai-darker'
                        : 'border-monokai-border hover:border-teal-400 bg-monokai-darker'
                    }`}
                  >
                    {task.completed && <CheckCircle size={12} strokeWidth={3} />}
                  </button>

                  <div className="min-w-0">
                    <p className={`text-xs font-medium truncate ${task.completed ? 'line-through text-monokai-dim' : 'text-monokai-text'}`}>
                      {task.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-monokai-muted truncate">
                      <span className="flex items-center gap-1 text-teal-400/90 font-medium">
                        <Icon size={12} /> {task.taskType}
                      </span>
                      {task.customerName && (
                        <span>• {task.customerName}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Badge */}
                <div className="shrink-0 flex items-center gap-1.5">
                  {overdue ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-monokai-pink/15 text-monokai-pink border border-monokai-pink/30 flex items-center gap-1">
                      <AlertCircle size={10} /> Overdue
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-monokai-yellow/15 text-monokai-yellow border border-monokai-yellow/30">
                      Today
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
