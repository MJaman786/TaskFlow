import React from "react";

interface StatusButtonTypes {
  label: string;
  variant: string;
  onClick: (val: string) => void;
  currentStatus: string;
  className?: string;
}

export default function StatusButton({
  label,
  variant = "",
  onClick,
  currentStatus = "",
  className = "",
}: StatusButtonTypes) {
  const isActive = variant === currentStatus;

  return (
    <button
      type="button"
      onClick={() => onClick?.(variant)}
      className={`
        font-sans text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-pill border 
        transition-all duration-150 cursor-pointer flex items-center justify-center
        ${
          isActive
            ? "bg-primary text-on-primary border-primary shadow-sm"
            : "bg-surface-card hover:bg-surface-strong text-body hover:text-ink border-hairline-strong"
        }
        ${className}
      `}
    >
      {label}
    </button>
  );
}