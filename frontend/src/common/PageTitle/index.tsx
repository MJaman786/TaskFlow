import { X } from "lucide-react";

interface HeaderProps {
  title: string;
  description?: string;
  className?: string;
  handleBack?: () => void;
}

export default function PageTitle({ title, description, className = "", handleBack }: HeaderProps) {
  return (
    <div className={`font-poppins ml-2 my-3 flex items-center justify-between ${className}`}>
      <div>
        {/* 1. Main Title - Matching the heavy, dark navy typography */}
        <h1 className="text-2xl font-extrabold text-surface-800 tracking-tight">
          {title}
        </h1>

        {/* 2. Sub-description - Matching the light slate, medium-weight font */}
        {description && (
          <p className="text-sm font-medium text-surface-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {handleBack && (
        <button
          onClick={handleBack}
          className="p-2 mr-10 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-xl transition-all duration-200 flex items-center justify-center group"
          aria-label="Close"
        >
          <X
            size={20}
            strokeWidth={2.5}
            className="transition-transform duration-200 group-active:scale-90"
          />
        </button>
      )}
    </div>
  );
}
