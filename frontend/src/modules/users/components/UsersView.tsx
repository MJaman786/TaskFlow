import React, { useState } from 'react';
import { useAdminStats } from '../hooks/useAdminStats';
import { useAdminUsers } from '../hooks/useAdminUsers';
import AdminStatsBanner from './AdminStatsBanner';
import UsersTable from './UsersTable';
import UserModal from '../../../common/Modals/UserModal';
import type { AdminUserListItem } from '../types/users.types';
import SearchBar from '../../../common/Ui/Searchbar';
import { useDebounce } from '../../../utils/helpers/Debouncing';

export default function UsersView() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);

  const debouncedSearch = useDebounce(search, 600);

  const { data: statsRes } = useAdminStats();
  const { data: usersRes, isLoading } = useAdminUsers({ page, limit, search: debouncedSearch || undefined });

  const stats = statsRes?.data?.stats;
  const users = usersRes?.data?.users || [];
  const pagination = usersRes?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleManageUser = (user: AdminUserListItem) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col font-sans p-6 animate-fadeIn">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink font-poppins">Admin Console</h1>
        <p className="text-sm text-muted mt-1">Platform administration and user directory management.</p>
      </div>

      {stats && <AdminStatsBanner stats={stats} />}

      <div className="bg-surface-card border border-hairline-strong rounded-xl shadow-card-soft p-5 mt-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider">User Directory</h3>
          <div className="w-full sm:w-64">
            <SearchBar 
              search={search} 
              setSearch={(val) => { setSearch(val); setPage(1); }} 
              placeholder="Search by name or email..." 
            />
          </div>
        </div>

        <UsersTable
          users={users}
          page={page}
          limit={limit}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          onLimitChange={setLimit}
          isLoading={isLoading}
          onManage={handleManageUser}
        />
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
