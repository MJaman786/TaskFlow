import React, { useState } from "react";
import { Eye, EyeClosed, AlertCircle } from "lucide-react";

interface InputFieldProps {
  label?: string;
  icon?: React.ReactNode;
  type?: "text" | "email" | "password" | "number" | "checkbox" | "datetime-local";
  name: string;
  placeholder?: string;
  inputClass?: string;
  iconClass?: string;
  value?: string | number;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  touched?: boolean;
  error?: string;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
}

export default function InputField({
  label,
  icon,
  type = "text",
  name,
  placeholder,
  inputClass = "",
  iconClass = "",
  value,
  checked,
  onChange,
  onBlur,
  touched,
  error,
  disabled,
  min,
  max
}: InputFieldProps) {
  const showError = Boolean(touched && error);
  const [isPasswordHidden, setPasswordHidden] = useState<boolean>(true);

  const effectiveType =
    type === "password" ? (isPasswordHidden ? "password" : "text") : type;

  // Checkbox Variant
  if (type === "checkbox") {
    return (
      <div className="flex items-center gap-2.5 select-none">
        <input
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          disabled
          className="w-4 h-4 rounded-xs border-hairline-strong bg-surface-card accent-primary text-on-primary focus:ring-1 focus:ring-ink transition-colors cursor-pointer"
        />
        {label && (
          <label
            htmlFor={name}
            className="text-xs font-medium text-body hover:text-ink transition-colors cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5 font-sans">
      {/* Label */}
      {label && (
        <label className="block text-xs font-medium text-body uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Input Element Container */}
      <div className="relative group">
        {/* Leading Icon */}
        {icon && (
          <div
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors pointer-events-none ${iconClass}`}
          >
            {icon}
          </div>
        )}

        {/* Text/Email/Password/Number Input */}
        <input
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full h-11 bg-surface-card border text-sm text-ink placeholder:text-muted rounded-md transition-all duration-150 outline-none
            ${icon ? "pl-10" : "pl-3.5"} 
            ${type === "password" ? "pr-10" : "pr-3.5"}
            ${showError
              ? "border-error focus:border-error focus:ring-1 focus:ring-error/20"
              : "border-hairline-strong hover:border-ink/50 focus:border-ink focus:ring-1 focus:ring-ink"
            }
            ${inputClass}
          `}
          min={min}
          max={max}
        />

        {/* Password Visibility Toggle Button */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setPasswordHidden((prev) => !prev)}
            aria-label={isPasswordHidden ? "Show password" : "Hide password"}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors cursor-pointer ${iconClass}`}
          >
            {isPasswordHidden ? <EyeClosed size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {/* Validation Error Banner */}
      {showError && (
        <p className="flex items-center gap-1 text-xs text-error font-medium animate-fadeIn">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}