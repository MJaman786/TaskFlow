import React from "react";
import {
    LayoutDashboard,
    FolderOpen,
    Activity,
    User,
    Shield,
    LogOut,
    X,
    Sun,
    Moon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useLogout from "../../modules/auth/hooks/useLogout";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import { useThemeStore } from "../../store/Theme/useThemeStore";

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    path: string;
    adminOnly?: boolean;
}

interface SidebarProps {
    activePage?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export const UserNavItems: MenuItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { label: "Tasks", icon: <FolderOpen size={18} />, path: "/tasks" },
    { label: "Time Logs", icon: <Activity size={18} />, path: "/time-logs" },
    { label: "Profile", icon: <User size={18} />, path: "/profile" },
];

export const AdminNavItems: MenuItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { label: "Tasks", icon: <FolderOpen size={18} />, path: "/tasks" },
    { label: "Time Logs", icon: <Activity size={18} />, path: "/time-logs" },
    { label: "User Directory", icon: <Shield size={18} />, path: "/admin/users", adminOnly: true },
    { label: "Profile", icon: <User size={18} />, path: "/profile" },
];

export default function Sidebar({ activePage, isOpen = false, onClose = () => {} }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const { mutate: logoutUser } = useLogout();

    const isAdmin = user?.role === "ADMIN";
    const navItems = isAdmin ? AdminNavItems : UserNavItems;

    const handleItemClick = (path: string) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logoutUser(undefined, {
            onSettled: () => {
                logout();
                navigate("/login");
            },
        });
    };

    return (
        <aside
            className={`
            fixed lg:static inset-y-0 left-0 z-50 
            w-64 bg-canvas border-r border-hairline
            h-screen overflow-y-auto no-scrollbar 
            flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out
            ${isOpen ? "translate-x-0 lg:ml-0" : "-translate-x-full lg:-ml-64"}
          `}
        >
            <div className="p-5 flex flex-col min-h-full">
                {/* Logo & Mobile Close */}
                <div className="flex items-center justify-between pb-4 border-b border-hairline mb-4">
                    <div
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2.5 cursor-pointer select-none"
                    >
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                                <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="currentColor" className="text-on-primary" />
                                <path d="M9 6L12 8V12L9 14L6 12V8L9 6Z" fill="currentColor" className="text-primary-active" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-inter font-semibold text-[15px] text-ink tracking-tight leading-tight">
                                TaskFlow
                            </span>
                            <span className="font-mono text-[10px] text-muted tracking-wider uppercase">
                                Time Tracking
                            </span>
                        </div>
                    </div>
                    <button
                        className="lg:hidden text-muted hover:text-ink p-1 rounded-md transition-colors"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1 flex-1">
                    <p className="text-[10px] font-mono font-semibold tracking-wider text-muted uppercase px-2.5 mb-2">
                        Console Navigation
                    </p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || activePage === item.label;
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                                    isActive
                                        ? "bg-surface-strong text-ink font-semibold border border-hairline shadow-xs"
                                        : "text-body hover:bg-hairline hover:text-ink"
                                }`}
                            >
                                <span className={isActive ? "text-ink" : "text-muted"}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer Controls: Light/Dark Theme Toggle + User Info & Logout */}
                <div className="pt-4 mt-auto border-t border-hairline space-y-3">
                    {/* Theme Mode Toggle Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-card border border-hairline text-ink hover:bg-surface-strong text-[12px] font-inter transition-colors"
                        title="Toggle Light / Dark Mode"
                    >
                        <div className="flex items-center gap-2">
                            {theme === "dark" ? (
                                <Moon size={15} className="text-amber-400" />
                            ) : (
                                <Sun size={15} className="text-amber-500" />
                            )}
                            <span className="capitalize font-medium">{theme} Mode</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted uppercase bg-canvas px-1.5 py-0.5 rounded border border-hairline">
                            Switch
                        </span>
                    </button>

                    {/* User Profile / Logout */}
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-surface-strong text-ink font-semibold flex items-center justify-center text-[12px] flex-shrink-0 uppercase">
                                {user?.name?.[0] || "U"}
                            </div>
                            <div className="min-w-0">
                                <p className="font-inter font-medium text-[12px] text-ink truncate leading-tight">
                                    {user?.name || "User"}
                                </p>
                                <p className="font-mono text-[10px] text-muted truncate leading-tight">
                                    {user?.email || "Signed In"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                            title="Log out"
                        >
                            <LogOut size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}