import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from '../../Ui/Buttons/modal.button';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  isLoading = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-surface-card border border-hairline-strong rounded-xl w-full max-w-sm shadow-card-soft overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-hairline">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle size={18} />
            <h3 className="text-base font-bold text-ink font-poppins">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-ink p-1 rounded-md transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 text-sm text-muted">
          {message}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-hairline bg-surface-strong/30">
          <Button
            label="Cancel"
            variant="clear"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            label="Delete"
            loadingLabel="Deleting..."
            isLoading={isLoading}
            onClick={onConfirm}
            className="bg-error text-white hover:bg-error/90 border-error"
          />
        </div>
      </div>
    </div>
  );
}
