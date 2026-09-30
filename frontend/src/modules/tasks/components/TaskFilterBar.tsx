import React from 'react';
import SearchBar from '../../../common/Ui/Searchbar';
import Dropdown from '../../../common/Ui/Dropdown';
import type{ TaskStatus, TaskPriority } from '../types/task.types';

interface TaskFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  status: TaskStatus | 'ALL';
  setStatus: (val: TaskStatus | 'ALL') => void;
  priority: TaskPriority | 'ALL';
  setPriority: (val: TaskPriority | 'ALL') => void;
  viewMode: 'list' | 'kanban';
  setViewMode: (val: 'list' | 'kanban') => void;
}

export default function TaskFilterBar({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  viewMode,
  setViewMode
}: TaskFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center w-full mb-6 font-sans">
      <div className="flex-1 w-full">
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholder="Filter tasks by key, title, or tags..."
        />
      </div>

      <div className="flex gap-3 items-center w-full md:w-auto">
        <div className="w-full md:w-36">
          <Dropdown
            options={[
              { label: 'Status: All', value: 'ALL' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Completed', value: 'COMPLETED' },
            ]}
            value={status}
            onChange={(val) => setStatus(Array.isArray(val) ? val[0] as any : val as any)}
            height="44px"
          />
        </div>

        <div className="w-full md:w-36">
          <Dropdown
            options={[
              { label: 'Priority: Any', value: 'ALL' },
              { label: 'Low', value: 'LOW' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'High', value: 'HIGH' },
            ]}
            value={priority}
            onChange={(val) => setPriority(Array.isArray(val) ? val[0] as any : val as any)}
            height="44px"
          />
        </div>
      </div>
    </div>
  );
}
