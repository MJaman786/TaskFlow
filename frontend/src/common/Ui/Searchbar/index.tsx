import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  search,
  setSearch,
  placeholder,
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative group w-full font-sans ${className}`}>
      {/* Search Icon */}
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors pointer-events-none"
      />

      {/* Input Field */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder ?? "Search snippets, tags, or languages…"}
        className="w-full h-11 bg-surface-card border border-hairline-strong rounded-md pl-10 pr-9 text-sm text-ink placeholder:text-muted outline-none transition-all duration-150 hover:border-ink/50 focus:border-ink focus:ring-1 focus:ring-ink"
      />

      {/* 1-Click Clear Trigger */}
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          aria-label="Clear search query"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}