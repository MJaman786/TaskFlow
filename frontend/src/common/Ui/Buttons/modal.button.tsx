import React from "react";

interface ButtonProps {
  label: string;
  loadingLabel?: string;
  varient?: "submit" | "cancel" | "clear" | "ghost";
  variant?: "submit" | "cancel" | "clear" | "ghost"; // Alias for compatibility
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  label,
  loadingLabel,
  varient = "submit",
  variant,
  type = "button",
  isLoading = false,
  onClick,
  className = "",
  disabled = false,
}: ButtonProps) {
  const activeVariant = variant || varient;

  const buttonVariant = {
    // Primary Expo CTA: solid black fill, white text, 8px radius
    submit:
      "bg-primary hover:bg-primary-active text-on-primary border border-transparent shadow-sm",

    // Destructive semantic action
    cancel:
      "bg-error/10 hover:bg-error/20 text-error border border-error/20 hover:border-error/30",

    // Secondary card style: pure card surface with hairline-strong border
    clear:
      "bg-surface-card hover:bg-surface-strong text-ink border border-hairline-strong hover:border-ink shadow-sm",

    // Ghost neutral style
    ghost:
      "bg-transparent hover:bg-surface-strong text-body hover:text-ink border border-transparent",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative inline-flex items-center justify-center gap-2 h-10 px-4.5 py-2.5 rounded-md 
        font-sans font-medium text-sm transition-all duration-150 select-none
        active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        cursor-pointer
        ${buttonVariant[activeVariant]}
        ${className}
      `}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className="tracking-tight">{isLoading ? loadingLabel : label}</span>
    </button>
  );
}