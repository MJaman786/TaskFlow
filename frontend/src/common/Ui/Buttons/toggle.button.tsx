import React from "react";

interface ToggleBtnTypes {
  value: boolean;
  handleToggle: () => void;
  name?: string;
}

export default function ToggleBtn({ value, handleToggle, name }: ToggleBtnTypes) {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        className="sr-only peer"
        checked={value}
        onChange={handleToggle}
      />
      <div
        className="w-10 h-5.5 bg-surface-strong border border-hairline-strong peer-focus:outline-none 
        rounded-pill peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
        after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
        after:bg-canvas after:rounded-pill after:h-4.5 after:w-4.5 after:shadow-sm after:transition-all 
        peer-checked:bg-primary peer-checked:border-primary transition-colors"
      />
    </label>
  );
}