import React, { useState } from "react";
import Sidebar from "../Sidebar/index";
import Navbar from "../Navbar/index";
import { Outlet } from "react-router-dom";
import ActiveTimerBar from "../../modules/timetrack/components/ActiveTimerBar";

interface Props {
    activePage: string;
}

export default function AdminLayoutWrapper({ activePage }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);

    return (
        <div className="font-inter h-screen w-full bg-canvas text-ink flex overflow-hidden antialiased selection:bg-sky-light/40">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar with Admin options */}
            <Sidebar
                activePage={activePage}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Admin area */}
            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar flex flex-col relative w-full bg-canvas-soft">
                <ActiveTimerBar />
                <Navbar
                    title={activePage}
                    onMenuToggle={() => setIsSidebarOpen(prev => !prev)}
                />
                <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
