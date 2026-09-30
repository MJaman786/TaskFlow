import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import TimeLogTable from './TimeLogTable';
import TimeLogModal, { type ModalMode } from '../../../common/Modals/TimeLog/index';
import { useGetTimeLogs } from '../hooks/useGetTimeLogs';
import type { TimeLog } from '../types/timetrack.types';
import Button from '../../../common/Ui/Buttons/modal.button';

export default function TimeLogsView() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedLog, setSelectedLog] = useState<TimeLog | null>(null);

  const { data: res, isLoading } = useGetTimeLogs({ page, limit });

  const logs = res?.data?.timeLogs || [];
  const pagination = res?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleOpenModal = useCallback((mode: ModalMode, log?: TimeLog) => {
    setModalMode(mode);
    setSelectedLog(log || null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLog(null);
  }, []);

  return (
    <div className="w-full h-full flex flex-col font-sans p-6 animate-fadeIn">

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted uppercase tracking-wider">Productivity Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold text-ink font-poppins flex items-baseline gap-3">
            Time Logs 
            <span className="text-sm font-mono font-medium text-muted">{pagination.total} entries</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            label="Log Manual Time" 
            // icon={<Plus size={16} />} 
            onClick={() => handleOpenModal('create')} 
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 mt-2">
        <TimeLogTable
          logs={logs}
          page={page}
          limit={limit}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          onLimitChange={setLimit}
          isLoading={isLoading}
          onView={(log) => handleOpenModal('view', log)}
        />
      </div>

      <TimeLogModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        log={selectedLog}
      />
    </div>
  );
}
