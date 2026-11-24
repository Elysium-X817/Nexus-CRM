import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCRM } from '../context/CRMContext';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertCircle,
  Filter,
  User
} from 'lucide-react';

export const TasksPage = () => {
  const { refreshKey, triggerRefresh, addToast, newTaskModal, closeNewTask, openContactDetail } = useCRM();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'today', 'upcoming', 'completed'
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterTab === 'today') params.filter = 'today';
      if (filterTab === 'upcoming') params.filter = 'upcoming';
      if (filterTab === 'completed') params.status = 'completed';

      const data = await api.getTasks(params);
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      addToast(err.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterTab, refreshKey]);

  useEffect(() => {
    if (newTaskModal.isOpen) {
      setTaskToEdit(null);
      setIsFormModalOpen(true);
      closeNewTask();
    }
  }, [newTaskModal.isOpen]);

  const handleToggle = async (taskId) => {
    // Optimistic toggle
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, completed: !t.completed } : t))
    );

    try {
      await api.toggleTask(taskId);
      addToast('Task status updated', 'success');
      triggerRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to update task', 'error');
      fetchTasks();
    }
  };

  const handleDelete = async (taskId, taskTitle) => {
    if (!window.confirm(`Delete task "${taskTitle}"?`)) return;
    try {
      await api.deleteTask(taskId);
      addToast('Task deleted', 'success');
      triggerRefresh();
      fetchTasks();
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'Call': return Phone;
      case 'Email': return Mail;
      case 'Meeting': return Users;
      default: return CheckSquare;
    }
  };

  const isOverdue = (dateString, completed) => {
    if (completed || !dateString) return false;
    const d = new Date(dateString);
    const now = new Date();
    return d < new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-monokai-pink bg-monokai-pink/15 border-monokai-pink/30';
      case 'Low':
        return 'text-monokai-dim bg-monokai-hover border-monokai-border';
      case 'Medium':
      default:
        return 'text-monokai-yellow bg-monokai-yellow/15 border-monokai-yellow/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-monokai-text">
              Tasks & Reminders
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-400 border border-teal-500/30">
              {tasks.filter((t) => !t.completed).length} Pending
            </span>
          </div>
          <p className="text-xs text-monokai-muted mt-1">
            Track customer follow-up calls, meetings, proposal reviews, and action items.
          </p>
        </div>

        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsFormModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-monokai-darker font-bold text-xs tracking-wide shadow-teal-glow transition-all flex items-center gap-2 self-start sm:self-center"
        >
          <Plus size={16} />
          Schedule Follow-up
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-monokai-panel border border-monokai-border rounded-xl shadow-monokai-card overflow-x-auto">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'today', label: "Today's Due" },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterTab === tab.id
                ? 'bg-teal-500 text-monokai-darker font-bold shadow-teal-glow'
                : 'text-monokai-muted hover:text-monokai-text hover:bg-monokai-hover'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List Container */}
      <div className="bg-monokai-panel border border-monokai-border rounded-xl shadow-monokai-card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-monokai-muted">
            Loading tasks and reminders...
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-3">
              <CheckSquare size={24} />
            </div>
            <h3 className="text-base font-semibold text-monokai-text">No tasks found</h3>
            <p className="text-xs text-monokai-muted mt-1 max-w-sm mx-auto">
              {filterTab === 'completed'
                ? 'No completed tasks yet.'
                : 'You have no scheduled tasks in this view. Click "Schedule Follow-up" to create one.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-monokai-border">
            {tasks.map((task) => {
              const Icon = getTaskIcon(task.taskType);
              const overdue = isOverdue(task.dueDate, task.completed);

              return (
                <div
                  key={task._id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                    task.completed
                      ? 'bg-monokai-darker/40 opacity-60'
                      : 'hover:bg-monokai-hover/50'
                  }`}
                >
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggle(task._id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        task.completed
                          ? 'bg-teal-500 border-teal-500 text-monokai-darker shadow-teal-glow'
                          : 'border-monokai-border hover:border-teal-400 bg-monokai-darker'
                      }`}
                    >
                      {task.completed && <CheckCircle2 size={15} strokeWidth={3} />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-semibold tracking-tight ${
                          task.completed ? 'line-through text-monokai-dim' : 'text-monokai-text'
                        }`}>
                          {task.title}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-monokai-subpanel text-teal-400 border border-teal-500/20 font-medium">
                          <Icon size={12} /> {task.taskType}
                        </span>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Linked customer & notes */}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-monokai-muted flex-wrap">
                        {task.customerName && (
                          <div
                            onClick={() => {
                              if (task.contact?._id || task.contact) {
                                openContactDetail(task.contact._id || task.contact);
                              }
                            }}
                            className={`flex items-center gap-1 text-teal-400 font-medium ${
                              task.contact ? 'hover:underline cursor-pointer' : ''
                            }`}
                          >
                            <User size={13} />
                            <span>{task.customerName}</span>
                          </div>
                        )}

                        {task.notes && (
                          <span className="text-monokai-dim truncate max-w-md">
                            • {task.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Due Date & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-monokai-border/40">
                    <div className="flex items-center gap-1.5 text-xs">
                      {overdue ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-monokai-pink/15 text-monokai-pink border border-monokai-pink/30 flex items-center gap-1">
                          <AlertCircle size={13} />
                          Overdue ({new Date(task.dueDate).toLocaleDateString()})
                        </span>
                      ) : (
                        <span className="text-monokai-muted flex items-center gap-1">
                          <Calendar size={13} className="text-monokai-dim" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setTaskToEdit(task);
                          setIsFormModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-monokai-subpanel text-monokai-dim hover:text-monokai-yellow transition-colors"
                        title="Edit Task"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id, task.title)}
                        className="p-1.5 rounded-lg hover:bg-monokai-pink/15 text-monokai-dim hover:text-monokai-pink transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        taskToEdit={taskToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setTaskToEdit(null);
        }}
        onSuccess={fetchTasks}
      />
    </div>
  );
};
