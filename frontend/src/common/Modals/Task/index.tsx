import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Clock, Eye, Edit3, PlusCircle } from 'lucide-react';
import InputField from '../../Ui/Input';
import Dropdown from '../../Ui/Dropdown';
import Button from '../../Ui/Buttons/modal.button';
import { useTaskMutations } from '../../../modules/tasks/hooks/useTaskMutations';
import { formatDuration } from '../../../utils/formatters/FormatDuration';
import type { Task } from '../../../modules/tasks/types/task.types';
import useNlpSuggest from '../../../modules/tasks/hooks/useNlpSuggest';

export type ModalMode = 'create' | 'edit' | 'view';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  task?: Task | null;
}

const TaskValidationSchema = Yup.object().shape({
  title: Yup.string().trim().min(2, 'Title must be at least 2 characters').max(250).required('Task title is required'),
  description: Yup.string().trim().max(2000, 'Max 2000 characters').optional(),
  priority: Yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH']).required('Priority is required'),
  status: Yup.string().oneOf(['PENDING', 'IN_PROGRESS', 'COMPLETED']).required('Status is required'),
  dueDate: Yup.string().nullable().optional(),
});

export default function TaskModal({ isOpen, onClose, mode, task }: TaskModalProps) {
  const { createTask, updateTask, isCreating, isUpdating } = useTaskMutations();
  const { mutate: suggestTask, isPending: isSuggesting } = useNlpSuggest();
  const isView = mode === 'view';

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'MEDIUM',
      status: task?.status || 'PENDING',
      dueDate: task?.due_date ? task.due_date.split('T')[0] : '',
    },
    validationSchema: TaskValidationSchema,
    onSubmit: (values) => {
      if (isView) return;

      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        priority: values.priority as 'LOW' | 'MEDIUM' | 'HIGH',
        status: values.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
        due_date: values.dueDate ? new Date(values.dueDate).toISOString() : null,
      };

      if (mode === 'edit' && task?.id) {
        updateTask(
          { id: task.id, payload },
          { onSuccess: () => onClose() }
        );
      } else {
        createTask(
          { payload },
          { onSuccess: () => onClose() }
        );
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn overflow-hidden">
      <div className="bg-surface-card border border-hairline-strong rounded-xl w-full max-w-lg shadow-card-soft font-sans flex flex-col max-h-full">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-hairline shrink-0">
          <div className="flex items-center gap-2">
            {mode === 'create' && <PlusCircle size={18} className="text-text-link" />}
            {mode === 'edit' && <Edit3 size={18} className="text-amber-500" />}
            {mode === 'view' && <Eye size={18} className="text-emerald-500" />}
            <h3 className="text-base font-bold text-ink font-poppins capitalize">
              {mode === 'create' && 'Create New Task'}
              {mode === 'edit' && 'Edit Task Details'}
              {mode === 'view' && 'Task Inspection View'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-ink p-1 rounded-md transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-5 flex-1 min-h-0">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
          
          {/* Read-Only Stats Bar (View Mode) */}
          {isView && task && (
            <div className="p-3 bg-surface-strong/50 border border-hairline rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-muted">
                <Clock size={13} className="text-text-link" />
                Tracked Time:
              </span>
              <span className="font-bold text-ink text-sm">
                {formatDuration(task.total_time_spent_seconds || 0)}
              </span>
            </div>
          )}

          {/* Title & NLP Auto-suggest */}
          <div className="relative">
            <InputField
              label="Task Title *"
              placeholder="e.g., Follow up with UI Designer"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.title}
              error={formik.errors.title}
              disabled={isView || isSuggesting}
            />
            {!isView && (
              <button
                type="button"
                onClick={() => {
                  if (!formik.values.title.trim()) return;
                  suggestTask(
                    { payload: { input: formik.values.title } },
                    {
                      onSuccess: (res) => {
                        if (res?.data) {
                          formik.setFieldValue('title', res.data.suggestedTitle || formik.values.title);
                          formik.setFieldValue('description', res.data.suggestedDescription || formik.values.description);
                          formik.setFieldValue('priority', res.data.suggestedPriority || formik.values.priority);
                        }
                      }
                    }
                  );
                }}
                disabled={isSuggesting || !formik.values.title.trim()}
                title="Autofill with AI"
                className="absolute right-2 top-[28px] text-[10px] font-mono bg-purple-500/10 text-purple-500 border border-purple-500/20 px-2 py-1 rounded-sm hover:bg-purple-500/20 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
              >
                {isSuggesting ? 'AI Thinking...' : '✨ Auto-Fill'}
              </button>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-body uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isView}
              placeholder="Provide specifications, criteria, or context..."
              className={`w-full p-3 bg-surface-card border text-xs text-ink placeholder:text-muted rounded-md transition-all outline-none resize-none font-sans ${
                isView
                  ? 'bg-surface-strong/40 border-hairline text-muted cursor-not-allowed'
                  : 'border-hairline-strong hover:border-ink/50 focus:border-ink focus:ring-1 focus:ring-ink'
              }`}
            />
          </div>

          {/* Dropdown Selectors: Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-body uppercase tracking-wider">
                Priority Level
              </label>
              <Dropdown
                options={[
                  { label: 'Low Priority', value: 'LOW' },
                  { label: 'Medium Priority', value: 'MEDIUM' },
                  { label: 'High Priority', value: 'HIGH' },
                ]}
                value={formik.values.priority}
                onChange={(val) => formik.setFieldValue('priority', Array.isArray(val) ? val[0] : val)}
                disabled={isView}
                height="42px"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-body uppercase tracking-wider">
                Task Status
              </label>
              <Dropdown
                options={[
                  { label: 'Pending', value: 'PENDING' },
                  { label: 'In Progress', value: 'IN_PROGRESS' },
                  { label: 'Completed', value: 'COMPLETED' },
                ]}
                value={formik.values.status}
                onChange={(val) => formik.setFieldValue('status', Array.isArray(val) ? val[0] : val)}
                disabled={isView}
                height="42px"
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-medium text-body uppercase tracking-wider mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              name="dueDate"
              value={formik.values.dueDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isView}
              className={`w-full h-10 px-3 bg-surface-card border text-xs text-ink rounded-md outline-none transition-all ${
                isView
                  ? 'bg-surface-strong/40 border-hairline text-muted cursor-not-allowed'
                  : 'border-hairline-strong hover:border-ink/50 focus:border-ink'
              }`}
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-hairline">
            <Button
              label={isView ? 'Close' : 'Cancel'}
              variant="clear"
              onClick={onClose}
            />
            {!isView && (
              <Button
                label={mode === 'create' ? 'Create Task' : 'Save Changes'}
                loadingLabel="Saving..."
                isLoading={isCreating || isUpdating}
                type="submit"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
