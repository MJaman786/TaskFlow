import React from "react";

interface ActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "default" | "danger" | "success" | "ghost";
  title?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export default function ActionButton({
  icon,
  label,
  onClick,
  variant = "default",
  title,
  disabled = false,
  className = "",
  size = "md",
}: ActionButtonProps) {
  const variantStyles = {
    default: "text-body hover:text-ink hover:bg-surface-strong border border-hairline",
    danger: "text-muted hover:text-error hover:bg-error/10 border border-transparent hover:border-error/20",
    success: "text-muted hover:text-success hover:bg-success/10 border border-transparent hover:border-success/20",
    ghost: "text-muted hover:text-ink hover:bg-surface-strong border-none",
  };

  const sizeStyles = {
    sm: "p-1 text-[11px] rounded-xs",
    md: "p-1.5 text-xs rounded-md",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center gap-1.5 font-medium transition-all duration-150 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}
