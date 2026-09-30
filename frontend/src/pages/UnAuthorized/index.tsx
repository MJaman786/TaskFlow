import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldAlert, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/Theme/useThemeStore';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-canvas text-ink flex flex-col justify-between p-6 sm:p-10 font-sans selection:bg-sky-light/40 transition-colors duration-200 select-none overflow-hidden">
      {/* Background Radial Wash */}
      <div className="hero-atmospheric-wash absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none -z-10" />

      {/* Top Telemetry Header Bar */}
      <header className="w-full flex items-center justify-between text-xs font-mono text-muted border-b border-hairline pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="font-semibold uppercase tracking-wider text-ink">
            BOUNDARY LEVEL: STRICT
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono tracking-wider">
            HTTP_STATUS // TELEMETRY_ACTIVE
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-md bg-surface-card border border-hairline hover:bg-surface-strong text-muted hover:text-ink transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Moon size={13} className="text-amber-400" /> : <Sun size={13} className="text-amber-500" />}
          </button>
        </div>
      </header>

      {/* Center 403 Hero Box */}
      <main className="w-full max-w-lg mx-auto flex flex-col items-center text-center my-auto py-10 space-y-5">
        {/* Error Code Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-strong border border-hairline font-mono text-xs text-muted shadow-2xs">
          <ShieldAlert size={14} className="text-amber-500" />
          <span className="tracking-wide text-ink font-semibold">ERR_HTTP_403</span>
        </div>

        {/* Massive Error Heading */}
        <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black font-poppins tracking-tighter text-ink leading-none">
          403
        </h1>

        {/* Title & Context */}
        <div className="space-y-1.5 max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins tracking-tight text-ink">
            Access Denied
          </h2>
          <p className="text-xs sm:text-sm text-body leading-relaxed">
            You do not have permission to access this protected resource.
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto h-11 px-5 rounded-md bg-primary hover:bg-primary-active text-on-primary font-medium text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Back to Dashboard</span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={handleGoBack}
            className="w-full sm:w-auto h-11 px-5 rounded-md bg-surface-card hover:bg-surface-strong border border-hairline-strong text-ink font-medium text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to Previous Page</span>
          </button>
        </div>
      </main>

      {/* Security Protocol Footer Bar */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between text-xs text-muted font-mono border-t border-hairline pt-4 gap-2">
        <span>TrackFlow Runtime Security Core • Session Boundary</span>
        <div className="flex items-center gap-5">
          <a href="#diagnostic" className="hover:text-ink transition-colors">
            Diagnostic Log
          </a>
          <a href="#protocols" className="hover:text-ink transition-colors">
            Security Protocols
          </a>
          <span className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            System Status
          </span>
        </div>
      </footer>
    </div>
  );
}