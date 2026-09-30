// components/LayoutWrapper.tsx
import React, { useState } from "react";
import Sidebar from "../Sidebar/index";
import Navbar from "../Navbar/index";

interface Props {
  children: React.ReactNode;
  activePage: string;
}

export default function LayoutWrapper({ children, activePage }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="font-poppins h-screen w-full bg-surface-50 text-surface-800 flex overflow-hidden antialiased selection:bg-primary-100 selection:text-primary-900">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {/* <Sidebar
        activePage={activePage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      /> */}

      {/* Main area */}
      <main className="flex-1 h-screen overflow-y-auto no-scrollbar flex flex-col relative w-full">
        <Navbar
          // title={activePage}
          // onMenuToggle={() => setIsSidebarOpen(true)}
        />
        <div className="flex-1 w-full mx-auto flex flex-col gap-6">
          {children}
        </div>
      </main>
    </div>
  );
}
