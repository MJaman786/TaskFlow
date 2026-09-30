import React from 'react';
import { X, ShieldAlert, Trash2 } from 'lucide-react';
import Button from '../../Ui/Buttons/modal.button';
import { useAdminMutations } from '../../../modules/users/hooks/useAdminMutations';
import type { AdminUserListItem } from '../../../modules/users/types/users.types';
import { format } from 'date-fns';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserListItem | null;
}

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const { updateStatus, isUpdatingStatus, deleteUser, isDeleting } = useAdminMutations();

  if (!isOpen || !user) return null;

  const handleToggleStatus = () => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    updateStatus({ id: user.id, payload: { status: newStatus } }, { onSuccess: onClose });
  };

  const handleDelete = () => {
    if (window.confirm(`CRITICAL WARNING: Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) {
      deleteUser({ id: user.id }, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-surface-card border border-hairline-strong rounded-xl w-full max-w-md shadow-card-soft overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-hairline">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-strong text-ink flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {user.name.substring(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-bold text-ink font-poppins capitalize leading-tight">{user.name}</h3>
              <p className="text-[10px] font-mono text-muted">{user.email}</p>
            </div>
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
        <div className="p-5 space-y-4">
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-canvas-soft border border-hairline rounded-lg">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-1">Role</span>
              <span className={`inline-flex px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {user.role}
              </span>
            </div>
            <div className="p-3 bg-canvas-soft border border-hairline rounded-lg">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-1">Status</span>
              <span className={`inline-flex px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-error/10 text-error'}`}>
                {user.status}
              </span>
            </div>
          </div>

          <div className="p-4 bg-surface-strong/30 border border-hairline rounded-lg space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-hairline">
              <span className="text-muted">Tasks Created</span>
              <span className="font-mono text-ink font-bold">{user.total_tasks_created}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-hairline">
              <span className="text-muted">Registered Date</span>
              <span className="font-mono text-ink">{user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Email Verification</span>
              <span className={`font-mono ${user.is_email_verified ? 'text-emerald-500' : 'text-warning'}`}>
                {user.is_email_verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
          
          {/* Admin Actions */}
          <div className="pt-4 mt-2 border-t border-hairline space-y-3">
            <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Administrative Actions</h4>
            
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={isUpdatingStatus}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 ${user.status === 'ACTIVE' ? 'border-warning/20 bg-warning/5 hover:bg-warning/10 text-warning' : 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500'}`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} />
                <span className="text-sm font-semibold">{user.status === 'ACTIVE' ? 'Suspend User' : 'Restore User'}</span>
              </div>
              <span className="text-[10px] font-mono">{isUpdatingStatus ? 'Updating...' : 'Toggle Status'}</span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-error/20 bg-error/5 hover:bg-error/10 text-error transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Trash2 size={16} />
                <span className="text-sm font-semibold">Delete Account</span>
              </div>
              <span className="text-[10px] font-mono">{isDeleting ? 'Deleting...' : 'Permanent'}</span>
            </button>
          </div>

          {/* Close Action */}
          <div className="flex items-center justify-end pt-4">
            <Button
              label="Close Window"
              variant="clear"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
