import React, { useState, useCallback } from 'react';
import { Plus, LayoutList, LayoutGrid } from 'lucide-react';
import TaskFilterBar from './TaskFilterBar';
import TaskTable from './TaskTable';
import TaskCard from './TaskCard';
import TaskModal, {type ModalMode } from '../../../common/Modals/Task/index';
import DeleteModal from '../../../common/Modals/DeleteModal/index';
import { useGetTasks } from '../hooks/useGetTasks';
import { useTaskMutations } from '../hooks/useTaskMutations';
import type { Task, TaskStatus, TaskPriority } from '../types/task.types';
import Button from '../../../common/Ui/Buttons/modal.button';
import ActionButton from '../../../common/Ui/Buttons/action.button';
import { useDebounce } from '../../../utils/helpers/Debouncing';

export default function TasksView() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [priority, setPriority] = useState<TaskPriority | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const { deleteTask } = useTaskMutations();

  const debouncedSearch = useDebounce(search, 600);

  const { data: res, isLoading } = useGetTasks({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: status !== 'ALL' ? status : undefined,
    priority: priority !== 'ALL' ? priority : undefined,
  });

  const tasks = res?.data?.tasks || [];
  const pagination = res?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleOpenModal = useCallback((mode: ModalMode, task?: Task) => {
    setModalMode(mode);
    setSelectedTask(task || null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
  }, []);

  const handleDeleteClick = useCallback((task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (taskToDelete) {
      deleteTask({ id: taskToDelete.id }, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }
      });
    }
  }, [deleteTask, taskToDelete]);

  return (
    <div className="w-full h-full flex flex-col font-sans p-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted uppercase tracking-wider">Sprint 42 • Engineering Queue</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-500 text-[9px] font-mono uppercase">
              • Active cycle
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink font-poppins flex items-baseline gap-3">
            Tasks 
            <span className="text-sm font-mono font-medium text-muted">{pagination.total} total</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-surface-card border border-hairline-strong rounded-md p-1">
            <ActionButton
              icon={<LayoutList size={16} />}
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-surface-strong text-ink' : ''}
              title="List View"
            />
            <ActionButton
              icon={<LayoutGrid size={16} />}
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              onClick={() => setViewMode('kanban')}
              className={viewMode === 'kanban' ? 'bg-surface-strong text-ink' : ''}
              title="Grid View"
            />
          </div>
          <Button 
            label="Create Task" 
            // icon={<Plus size={16} />} 
            onClick={() => handleOpenModal('create')} 
          />
        </div>
      </div>

      {/* Filter Bar */}
      <TaskFilterBar
        search={search}
        setSearch={(val) => { setSearch(val); setPage(1); }}
        status={status}
        setStatus={(val) => { setStatus(val); setPage(1); }}
        priority={priority}
        setPriority={(val) => { setPriority(val); setPage(1); }}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Content */}
      <div className="flex-1 mt-2">
        {viewMode === 'list' ? (
          <TaskTable
            tasks={tasks}
            page={page}
            limit={limit}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
            onLimitChange={setLimit}
            isLoading={isLoading}
            onEdit={(t) => handleOpenModal('edit', t)}
            onView={(t) => handleOpenModal('view', t)}
            onDelete={handleDeleteClick}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
              <div className="col-span-full py-12 flex justify-center"><span className="text-muted">Loading...</span></div>
            ) : tasks.length > 0 ? (
              tasks.map(t => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onEdit={(t) => handleOpenModal('edit', t)}
                  onView={(t) => handleOpenModal('view', t)}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted">
                <span className="font-medium text-ink">No tasks found</span>
                <span className="text-xs mt-1">Adjust your filters or create a new task</span>
              </div>
            )}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        task={selectedTask}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setTaskToDelete(null); }}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={taskToDelete ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.` : ''}
      />
    </div>
  );
}
