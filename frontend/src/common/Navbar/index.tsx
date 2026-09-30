import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Menu,
    User,
    LogOut,
    Sun,
    Moon,
    Shield,
} from "lucide-react";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import { useThemeStore } from "../../store/Theme/useThemeStore";
import useLogout from "../../modules/auth/hooks/useLogout";

interface NavbarProps {
    title?: string;
    onMenuToggle?: () => void;
}

export default function Navbar({ title, onMenuToggle }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isLoggedIn } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const { mutate: logoutUser } = useLogout();

    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logoutUser(undefined, {
            onSettled: () => {
                logout();
                navigate("/login");
            },
        });
    };

    // Determine clean breadcrumb/title from route path
    const getPageTitle = () => {
        if (title) return title;
        const path = location.pathname.replace(/^\//, "");
        if (!path) return "TaskFlow";
        if (path === "dashboard") return "Dashboard";
        if (path === "tasks") return "Tasks";
        if (path === "time-logs") return "Time Logs";
        if (path === "profile") return "Profile";
        if (path.startsWith("admin")) return "User Directory";
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    const isPublic =
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/verify-email" ||
        location.pathname === "/forgot-password" ||
        location.pathname === "/reset-password";

    return (
        <header className="sticky top-0 z-30 h-16 w-full bg-canvas/80 backdrop-blur-md border-b border-hairline px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors py-4">
            {/* Left: Mobile hamburger & Active Context / Logo */}
            <div className="flex items-center gap-3">
                {onMenuToggle && (
                    <button
                        type="button"
                        onClick={onMenuToggle}
                        className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface-strong transition-colors cursor-pointer"
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={20} />
                    </button>
                )}
                {isPublic ? (
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                                <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="currentColor" className="text-on-primary" />
                                <path d="M9 6L12 8V12L9 14L6 12V8L9 6Z" fill="currentColor" className="text-primary-active" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-poppins font-semibold text-sm text-ink tracking-tight leading-tight">
                                TaskFlow
                            </span>
                            <span className="font-mono text-[9px] text-muted tracking-wider uppercase">
                                Task & Time Tracker
                            </span>
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink font-poppins text-sm">
                            {getPageTitle()}
                        </span>
                    </div>
                )}
            </div>

            {/* Right: Theme Toggle & Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Theme Toggle (Sun / Moon) */}
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface-strong border border-hairline transition-colors cursor-pointer"
                    title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? (
                        <Moon size={15} className="text-amber-400" />
                    ) : (
                        <Sun size={15} className="text-amber-500" />
                    )}
                </button>

                {/* Profile Dropdown or Public Auth CTAs */}
                {isLoggedIn && user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setProfileDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-surface-strong transition-colors border border-hairline cursor-pointer"
                        >
                            <span className="font-sans text-xs font-medium text-ink hidden md:inline">
                                {user.name}
                            </span>
                            <div className="w-7 h-7 rounded-full bg-surface-strong text-ink font-semibold flex items-center justify-center text-xs uppercase border border-hairline">
                                {user.name?.[0] || "U"}
                            </div>
                        </button>

                        {profileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-hairline-strong rounded-xl shadow-card-soft p-2 text-sm z-50 animate-fadeIn font-sans">
                                <div className="px-3 py-2 border-b border-hairline">
                                    <p className="font-semibold text-ink truncate text-xs">{user.name}</p>
                                    <p className="font-mono text-[10.5px] text-muted truncate">{user.email}</p>
                                    <span className="inline-block font-mono text-[9.5px] mt-1 px-1.5 py-0.5 rounded bg-surface-strong text-body border border-hairline uppercase">
                                        Role: {user.role}
                                    </span>
                                </div>
                                <div className="py-1">
                                    <Link
                                        to="/profile"
                                        onClick={() => setProfileDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-body hover:text-ink hover:bg-surface-strong transition-colors"
                                    >
                                        <User size={14} />
                                        <span>Account Settings</span>
                                    </Link>
                                    {user.role === "ADMIN" && (
                                        <Link
                                            to="/admin/users"
                                            onClick={() => setProfileDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-amber-500 hover:bg-amber-500/10 transition-colors font-medium"
                                        >
                                            <Shield size={14} />
                                            <span>User Directory</span>
                                        </Link>
                                    )}
                                </div>
                                <div className="pt-1 border-t border-hairline">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-error hover:bg-error/10 transition-colors cursor-pointer font-medium"
                                    >
                                        <LogOut size={14} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="px-3 py-1.5 rounded-lg border border-hairline text-xs font-medium text-ink hover:bg-surface-strong transition-colors shadow-2xs"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-medium hover:bg-primary-active transition-colors shadow-2xs"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}