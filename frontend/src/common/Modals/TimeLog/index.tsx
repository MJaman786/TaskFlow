import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Clock } from 'lucide-react';
import InputField from '../../Ui/Input';
import Dropdown from '../../Ui/Dropdown';
import Button from '../../Ui/Buttons/modal.button';
import { useTimeTrackMutations } from '../../../modules/timetrack/hooks/useTimeTrackMutations';
import { useGetTasks } from '../../../modules/tasks/hooks/useGetTasks';
import type { TimeLog } from '../../../modules/timetrack/types/timetrack.types';
import { formatDuration } from '../../../utils/formatters/FormatDuration';

export type ModalMode = 'create' | 'edit' | 'view';

interface TimeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  log?: TimeLog | null;
}

const TimeLogValidationSchema = Yup.object().shape({
  taskId: Yup.string().required('Task is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
});

export default function TimeLogModal({ isOpen, onClose, mode, log }: TimeLogModalProps) {
  const { logManualTime, isLoggingManual } = useTimeTrackMutations();
  const isView = mode === 'view';

  // Fetch tasks to populate dropdown
  const { data: tasksRes } = useGetTasks({ limit: 100 });
  const tasksOptions = tasksRes?.data?.tasks?.map(t => ({ label: t.title, value: t.id })) || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      taskId: log?.task_id || '',
      startTime: log?.start_time ? log.start_time.slice(0, 16) : '', // 'YYYY-MM-DDTHH:mm'
      endTime: log?.end_time ? log.end_time.slice(0, 16) : '',
    },
    validationSchema: TimeLogValidationSchema,
    onSubmit: (values) => {
      if (isView) return;

      const payload = {
        taskId: values.taskId,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
      };

      if (mode === 'create') {
        logManualTime(
          { payload },
          { onSuccess: () => onClose() }
        );
      }
      // Note: We don't have an update API based on types, so we assume edit is not supported or falls back to delete/create. Let's keep this simpler.
    },
  });

  if (!isOpen) return null;

  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localMinTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-surface-card border border-hairline-strong rounded-xl w-full max-w-md max-h-full shadow-card-soft flex flex-col font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-hairline shrink-0">
          <div className="flex items-center gap-2">
            <Clock size={18} className={mode === 'view' ? 'text-emerald-500' : 'text-text-link'} />
            <h3 className="text-base font-bold text-ink font-poppins capitalize">
              {mode === 'create' && 'Manual Time Entry'}
              {mode === 'view' && 'Time Log Details'}
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
        <form onSubmit={formik.handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          
          {isView && log && (
            <div className="p-3 bg-surface-strong/50 border border-hairline rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-muted">Total Logged:</span>
              <span className="font-bold text-ink text-sm">
                {formatDuration(log.duration_seconds)}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-body uppercase tracking-wider">
              Select Task *
            </label>
            <Dropdown
              options={tasksOptions}
              value={formik.values.taskId}
              onChange={(val) => formik.setFieldValue('taskId', Array.isArray(val) ? val[0] : val)}
              disabled={isView || mode === 'edit'}
              height="42px"
            />
            {formik.touched.taskId && formik.errors.taskId && (
              <p className="text-xs text-error mt-1">{formik.errors.taskId}</p>
            )}
          </div>

          <InputField
            label="Start Time *"
            type="datetime-local"
            name="startTime"
            value={formik.values.startTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.startTime}
            error={formik.errors.startTime}
            disabled={isView}
            min={localMinTime}
          />

          <InputField
            label="End Time *"
            type="datetime-local"
            name="endTime"
            value={formik.values.endTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.endTime}
            error={formik.errors.endTime}
            disabled={isView}
            min={localMinTime}
          />

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-hairline mt-2 shrink-0">
            <Button
              label={isView ? 'Close' : 'Cancel'}
              variant="clear"
              onClick={onClose}
            />
            {!isView && (
              <Button
                label="Save Time Log"
                loadingLabel="Saving..."
                isLoading={isLoggingManual}
                type="submit"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
