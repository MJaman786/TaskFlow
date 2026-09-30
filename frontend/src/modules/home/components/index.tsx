import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Terminal,
  GitBranch,
  Clock,
  Shield,
  Layers,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Activity,
  Cpu,
  Monitor,
  Calendar,
  Lock,
  ExternalLink,
  ChevronRight,
  Download,
} from 'lucide-react';
import Navbar from '../../../common/Navbar';
import showToast from '../../../utils/helpers/ShowToast';

// ─── Mini Reusable Component: Feature Card ────────────────────────────────────
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  snippetKey: string;
  snippetValue: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  snippetKey,
  snippetValue,
}) => (
  <div className="p-6 rounded-2xl bg-surface-card border border-hairline hover:border-hairline-strong shadow-card-soft hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group">
    <div className="space-y-3">
      <div className="w-10 h-10 rounded-xl bg-surface-strong border border-hairline flex items-center justify-center text-ink group-hover:scale-105 transition-transform duration-150">
        {icon}
      </div>
      <div>
        <h3 className="font-poppins font-bold text-base text-ink tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-body leading-relaxed mt-1.5">
          {description}
        </p>
      </div>
    </div>
    <div className="mt-5 pt-3.5 border-t border-hairline">
      <div className="p-2.5 rounded-lg bg-surface-strong/60 border border-hairline font-mono text-[11px] text-ink overflow-x-auto no-scrollbar">
        <span className="text-text-link font-semibold">{snippetKey}:</span>{' '}
        <span className="text-muted">{snippetValue}</span>
      </div>
    </div>
  </div>
);

// ─── Mini Reusable Component: Operational Step Card ───────────────────────────
interface StepCardProps {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  codePreview: string;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  icon,
  title,
  description,
  codePreview,
}) => (
  <div className="p-6 rounded-2xl bg-surface-card border border-hairline shadow-card-soft flex flex-col justify-between space-y-4">
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-strong text-muted border border-hairline">
          {step}
        </span>
        <div className="text-muted">{icon}</div>
      </div>
      <h4 className="font-poppins font-bold text-sm sm:text-base text-ink">
        {title}
      </h4>
      <p className="text-xs text-body leading-relaxed">{description}</p>
    </div>
    <div className="p-3 bg-surface-dark text-on-dark rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto no-scrollbar border border-hairline-strong/20">
      <pre className="text-emerald-400 whitespace-pre-wrap">{codePreview}</pre>
    </div>
  </div>
);

// ─── Mini Reusable Component: Pulse Metric Stat Card ──────────────────────────
interface PulseStatProps {
  label: string;
  value: string;
  subtext: string;
}

const PulseStatCard: React.FC<PulseStatProps> = ({ label, value, subtext }) => (
  <div className="p-4 sm:p-5 rounded-xl bg-surface-card border border-hairline shadow-card-soft space-y-1.5">
    <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted block">
      {label}
    </span>
    <div className="text-2xl sm:text-3xl font-black font-poppins text-ink tracking-tight">
      {value}
    </div>
    <span className="font-mono text-[11px] text-emerald-500 font-medium block">
      {subtext}
    </span>
  </div>
);

// ─── Main Home Screen Page ────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const [copiedCli, setCopiedCli] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('curl -fsSL https://trackflow.dev/install.sh | sh');
    setCopiedCli(true);
    showToast({ msg: 'Installation command copied to clipboard!', type: 'success' });
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-canvas text-ink font-sans flex flex-col selection:bg-sky-light/40 overflow-x-hidden transition-colors duration-200">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section with Atmospheric Glow */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-hairline">
        {/* Background Atmospheric Radial Glow Wash */}
        <div className="hero-atmospheric-wash absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-hairline bg-surface-card/90 backdrop-blur-md shadow-xs text-xs font-mono text-body select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>TrackFlow OS 2.4 is live</span>
            <span className="text-muted">•</span>
            <Link to="/signup" className="text-text-link hover:underline font-medium inline-flex items-center gap-0.5">
              Read changelog <ChevronRight size={12} />
            </Link>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-poppins text-ink tracking-tight leading-[1.08]">
            Precision task &amp; time telemetry for engineering teams
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-body leading-relaxed font-sans">
            Automatic background git branch tracking, deep focus blocks, and developer-first timesheets without manual clock-punching.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/signup"
              className="w-full sm:w-auto h-11 px-6 bg-primary hover:bg-primary-active text-on-primary rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <span>Start tracking free</span>
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              onClick={handleCopyInstall}
              className="w-full sm:w-auto h-11 px-5 rounded-xl border border-hairline-strong bg-surface-card hover:bg-surface-strong text-ink font-mono text-xs flex items-center justify-center gap-2 shadow-xs transition-all duration-150 cursor-pointer"
            >
              <Terminal size={14} className="text-text-link" />
              <span>Install: CLI / Daemon</span>
              {copiedCli ? <Check size={13} className="text-emerald-500 ml-1" /> : <Copy size={13} className="text-muted ml-1" />}
            </button>
          </div>

          <p className="text-[11.5px] font-mono text-muted">
            No credit card required. macOS, Linux, Windows, &amp; VS Code extension.
          </p>

          {/* 3. Hero Visual Window Mockup */}
          <div className="mt-12 rounded-2xl border border-hairline-strong bg-surface-card shadow-2xl overflow-hidden text-left font-sans max-w-5xl mx-auto">
            {/* Window Title Bar */}
            <div className="px-4 py-3 bg-surface-strong/80 border-b border-hairline flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-2 font-mono text-[11px] text-ink font-semibold flex items-center gap-1.5">
                  <GitBranch size={13} className="text-text-link" />
                  feat/distributed-mesh
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  02:44:27 LOGGING
                </span>
                <span className="text-[11px] text-muted hidden sm:inline">
                  ⚡ 12ms daemon ping
                </span>
              </div>
            </div>

            {/* Window Content: 3-Column Studio Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-hairline bg-surface-card">
              {/* Left Column: Sprint Backlog */}
              <div className="lg:col-span-3 p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between text-xs font-mono text-muted pb-2 border-b border-hairline">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Sprint 42 Backlog</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-strong">3 Active</span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-surface-strong/40 border border-hairline space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-emerald-500 font-bold">In Progress</span>
                      <span className="text-muted">TRK-105</span>
                    </div>
                    <p className="text-xs font-medium text-ink leading-snug">
                      Raft consensus peer sync under high packet drop
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> 07h 48m
                      </span>
                      <span>8 commits</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-strong/20 border border-hairline space-y-1.5 opacity-80">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-text-link font-bold">Code Review</span>
                      <span className="text-muted">TRK-104</span>
                    </div>
                    <p className="text-xs font-medium text-ink leading-snug">
                      Zero-copy telemetry ring buffer allocation
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted pt-1">
                      <span>06h 42m</span>
                      <span>PR #386</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-strong/20 border border-hairline space-y-1.5 opacity-70">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-muted font-bold">Done</span>
                      <span className="text-muted">TRK-98</span>
                    </div>
                    <p className="text-xs font-medium text-ink leading-snug">
                      Daemon-systemd-socket-unit initialization
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted pt-1">
                      <span>Merged</span>
                      <span>80% Sub</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column: Active Session Stream & Velocity Timeline */}
              <div className="lg:col-span-6 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-hairline text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-ink">Active Session Stream</span>
                  </div>
                  <span className="text-muted text-[11px]">Auto-Mapped • Today, 24 Oct</span>
                </div>

                {/* Timeline Bar Distribution */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted">
                    <span>09:00</span>
                    <span>10:30</span>
                    <span>12:00</span>
                    <span>13:30</span>
                    <span>15:00</span>
                  </div>
                  <div className="w-full h-7 rounded-lg bg-surface-strong flex overflow-hidden p-1 gap-1 border border-hairline">
                    <div className="h-full bg-primary rounded-xs flex-1" title="Deep Focus Block" />
                    <div className="h-full bg-emerald-500 rounded-xs w-16" title="PR Review" />
                    <div className="h-full bg-amber-500 rounded-xs w-6" title="Standup / Sync" />
                    <div className="h-full bg-primary rounded-xs flex-1" title="Deep Focus Block" />
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-muted pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary" /> IDE Focus (82%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> PR Reviews
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Sync Latency
                    </span>
                  </div>
                </div>

                {/* Commit & Branch Telemetry Logs */}
                <div className="space-y-2 pt-2">
                  <div className="p-3 rounded-xl bg-surface-strong/30 border border-hairline flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-mono font-semibold text-ink flex items-center gap-1.5">
                        <GitBranch size={12} className="text-text-link" />
                        <span>commit 7fda20b — "refactor gossip broadcast payload"</span>
                      </div>
                      <p className="text-[11px] text-muted font-mono">
                        Repository: mesh-node-core • +142 -26 loc
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-muted shrink-0">3m ago</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-strong/30 border border-hairline flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-mono font-semibold text-ink flex items-center gap-1.5">
                        <Zap size={12} className="text-amber-500" />
                        <span>branch switch feat/distributed-mesh</span>
                      </div>
                      <p className="text-[11px] text-muted font-mono">
                        Auto-resumed context timer • Active ticket linked
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-muted shrink-0">48m ago</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-strong/30 border border-hairline flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-mono font-semibold text-ink flex items-center gap-1.5">
                        <Clock size={12} className="text-emerald-500" />
                        <span>90min Deep Work block finished (no tab switches)</span>
                      </div>
                      <p className="text-[11px] text-muted font-mono">
                        Slack notification auto-downtime restored
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-muted shrink-0">1h 12m ago</span>
                  </div>
                </div>

                {/* Velocity Pacing Indicator */}
                <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-hairline text-muted">
                  <span>Velocity Pacing: <strong className="text-ink">6.2 hrs active</strong></span>
                  <div className="w-24 h-5 flex items-end gap-1">
                    <div className="w-3 bg-emerald-500/30 h-2 rounded-xs" />
                    <div className="w-3 bg-emerald-500/50 h-3 rounded-xs" />
                    <div className="w-3 bg-emerald-500/70 h-4 rounded-xs" />
                    <div className="w-3 bg-emerald-500 h-5 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Right Column: Daemon Health & Status */}
              <div className="lg:col-span-3 p-4 sm:p-5 space-y-4">
                <div className="pb-2 border-b border-hairline text-xs font-mono font-semibold text-muted uppercase tracking-wider">
                  Daemon Health
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Daemon Status</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-strong/40 border border-hairline text-[11px] text-muted">
                    <code>pid: 4892 • socket /var/run</code>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted">Memory footprint</span>
                    <span className="text-ink font-semibold">18.4 MB</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted">CPU idle draw</span>
                    <span className="text-ink font-semibold">&lt; 0.1%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted">E2EE Local DB</span>
                    <span className="text-ink font-semibold">Encrypted (AES-GCM)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted">IDE Extension</span>
                    <span className="text-ink font-semibold">VS Code 1.94</span>
                  </div>
                </div>

                {/* Mini Shell Box */}
                <div className="p-3 bg-surface-dark text-on-dark rounded-xl font-mono text-[10.5px] space-y-1 border border-hairline-strong/20">
                  <p className="text-muted">// live telemetry sync</p>
                  <p className="text-emerald-400 font-bold">$ trackflow ping</p>
                  <p className="text-white/80">0 packets lost [11ms]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Enterprise Integrations Logo Cloud */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-hairline bg-canvas-soft/60">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <p className="font-mono text-xs text-muted uppercase tracking-wider">
            Powering engineering velocity at modern tech organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 font-mono font-semibold text-sm text-body">
            <span className="flex items-center gap-2 hover:text-ink transition-colors cursor-default">
              <Layers size={16} /> Linear
            </span>
            <span className="flex items-center gap-2 hover:text-ink transition-colors cursor-default">
              <Zap size={16} /> Vercel
            </span>
            <span className="flex items-center gap-2 hover:text-ink transition-colors cursor-default">
              <Activity size={16} /> Supabase
            </span>
            <span className="flex items-center gap-2 hover:text-ink transition-colors cursor-default">
              <Code2 size={16} /> Retool
            </span>
            <span className="flex items-center gap-2 hover:text-ink transition-colors cursor-default">
              <Terminal size={16} /> Raycast
            </span>
            <span className="flex items-center gap-2 hover:text-ink transition-colors cursor-default">
              <Cpu size={16} /> PostHog
            </span>
          </div>
        </div>
      </section>

      {/* 5. Feature Grid ("Built for engineers who hate stopwatches") */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-hairline bg-canvas">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-text-link font-semibold">
              Engineering Ergonomics
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-poppins text-ink tracking-tight">
              Built for engineers who hate stopwatches.
            </h2>
            <p className="text-sm sm:text-base text-body max-w-2xl leading-relaxed">
              Everything happens invisibly inside your terminal, editor, and git hooks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<GitBranch size={20} />}
              title="Automated Git & Branch Telemetry"
              description="Seamlessly logs work directly from git commits, branch switches, and PR reviews without manual ticket selection or context switching."
              snippetKey="auto_bind"
              snippetValue="git checkout feat/* -> starts ticket clock"
            />

            <FeatureCard
              icon={<Shield size={20} />}
              title="Zero-Distraction Focus Sessions"
              description="Built-in Pomodoro and flow blocks automatically mute team notifications, set Slack statuses, and shield engineering focus hours."
              snippetKey="dnd_lock"
              snippetValue="Slack + Linear + GitHub PR pings suppressed"
            />

            <FeatureCard
              icon={<Calendar size={20} />}
              title="Engineering Audit & Timesheets"
              description="Painless automated timesheet summaries ready for sprint retrospectives, R&D tax credits, and transparent contractor billing."
              snippetKey="export"
              snippetValue="CSV, JSON, QuickBooks, Stripe Invoicing API"
            />

            <FeatureCard
              icon={<Cpu size={20} />}
              title="Local-First Daemon Architecture"
              description="Ultra-low memory daemon runs silently with end-to-end encryption, local SQLite storage, and complete offline autonomy."
              snippetKey="memory"
              snippetValue="< 20MB • 0 tracking telemetry sent to cloud"
            />

            <FeatureCard
              icon={<Activity size={20} />}
              title="Custom Metrics & Velocity Analytics"
              description="Correlate coding time with merged PRs, velocity metrics, test suite duration, and architectural blockers across engineering pods."
              snippetKey="correlate"
              snippetValue="84% time inside active code / 16% review"
            />

            <FeatureCard
              icon={<Code2 size={20} />}
              title="Native IDE & Terminal Integrations"
              description="VS Code, JetBrains IDEs, Neovim plugins, and Zsh / Fish shell hooks keep engineers immersed entirely inside their keyboard workflows."
              snippetKey="nvim/lua"
              snippetValue="require('trackflow').setup({ daemon = true })"
            />
          </div>
        </div>
      </section>

      {/* 6. Operational Flow Section ("Zero manual clock-ins") */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-hairline bg-canvas-soft/40">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted font-semibold">
                Operational Flow
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-ink tracking-tight">
                Zero manual clock-ins. Zero friction.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-body max-w-md leading-relaxed">
              Setup once on your developer machine. From then on, every branch checkout and commit logs automatically to the right sprint ticket.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              step="STEP 01"
              icon={<Download size={16} />}
              title="Pair Local Daemon"
              description="Install the lightweight CLI binary via package managers. Runs as a background service without administrator permissions."
              codePreview={`$ brew install trackflow-cli\n$ trackflow daemon start`}
            />

            <StepCard
              step="STEP 02"
              icon={<Code2 size={16} />}
              title="Code Normally"
              description="TrackFlow detects your active branch nomenclature (e.g., feat/TRK-104) and maps duration cleanly to backlog issues."
              codePreview={`✔ Auto-detected: TRK-104\n+ Active window: editor.rs [VS Code]`}
            />

            <StepCard
              step="STEP 03"
              icon={<CheckCircle2 size={16} />}
              title="Review & Sync"
              description="Approve daily telemetry blocks with a single keystroke. Automatically publish bulleted summaries directly into daily standups and Jira."
              codePreview={`✔ Standup sync complete:\nLogged 6h 40m across 3 PRs`}
            />
          </div>
        </div>
      </section>

      {/* 7. Command-Line Ergonomics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-hairline bg-canvas">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-text-link font-semibold">
                Command-Line Ergonomics
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-ink tracking-tight leading-tight">
                Engineers stay in the terminal. TrackFlow stays with them.
              </h2>
            </div>

            <p className="text-sm text-body leading-relaxed">
              Inspect real-time telemetry, toggle focus buffers, switch sprint tickets, and audit commit logs directly from your shell without touching a browser window.
            </p>

            <ul className="space-y-3 font-mono text-xs text-ink">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>Fast POSIX-compliant binary with tab completion</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>Git pre-commit &amp; post-checkout automated hooks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>Tmux &amp; Starship prompt active timer integration</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-hairline-strong bg-surface-dark text-on-dark shadow-2xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between text-[11px] text-on-dark-soft">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 text-white">zsh • trackflow-cli v0.4.1</span>
                </div>
                <span>daemon: online (pid 4892)</span>
              </div>

              <div className="p-5 space-y-3 leading-relaxed text-[11.5px] overflow-x-auto no-scrollbar">
                <p className="text-on-dark-soft"># query real-time telemetry session daemon</p>
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-emerald-400">➜</span> trackflow status --live
                </p>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-white/90">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">
                      ● Active Session: TRK-412 (Payment Webhook Refactor)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                      FOCUS_BLOCK
                    </span>
                  </div>
                  <p className="text-[11px]">
                    ⏱ Elapsed: <strong className="text-white font-mono">01:32:45</strong> | Branch:{' '}
                    <span className="text-sky-300">fix/webhook-race</span> | 14 commits
                  </p>
                  <p className="text-[11px] text-on-dark-soft">
                    IDE: Neovim 0.10 • Active File: webhook_handler.go • CPU: 0.08%
                  </p>
                </div>

                <p className="text-on-dark-soft pt-2"># push timesheet block to sprint board</p>
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-emerald-400">➜</span> trackflow sync --board=sprint-42
                </p>
                <p className="text-emerald-400 font-medium">
                  ✔ 1.54 hrs synced to TRK-412 in Linear API [HTTP 200 OK]
                </p>
                <p className="text-white/80">
                  ✔ Slack notification restored • Focus block closed cleanly
                </p>
                <p className="text-emerald-400 flex items-center gap-1 font-bold pt-1">
                  <span>➜</span> <span className="animate-pulse">_</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Pod Telemetry & Velocity Distribution Table ("Engineering Pulse") */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-hairline bg-canvas-soft/30">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-muted font-semibold">
                Engineering Pulse
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-ink tracking-tight mt-1">
                Pod Telemetry &amp; Velocity Distribution
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-muted">
              <span>Weekly Cycle: Oct 20 – Oct 26</span>
              <span className="px-2 py-0.5 rounded bg-surface-strong text-ink font-semibold border border-hairline">
                Real-time Aggregation
              </span>
            </div>
          </div>

          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <PulseStatCard
              label="Total Focus Hours"
              value="164.8 hrs"
              subtext="+13.4% vs last sprint"
            />
            <PulseStatCard
              label="Mean Deep Work Block"
              value="1h 48m"
              subtext="Minimal context breaks"
            />
            <PulseStatCard
              label="PR Turnaround Velocity"
              value="4.2 hrs"
              subtext="22 PRs merged"
            />
            <PulseStatCard
              label="Manual Time Entries"
              value="0.0 %"
              subtext="100% automated daemon sync"
            />
          </div>

          {/* Table Container */}
          <div className="rounded-2xl border border-hairline-strong bg-surface-card shadow-card-soft overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-canvas-soft border-b border-hairline text-muted uppercase text-[10.5px]">
                    <th className="py-3 px-4">Engineer &amp; Active Ticket</th>
                    <th className="py-3 px-4">Branch</th>
                    <th className="py-3 px-4">IDE Context</th>
                    <th className="py-3 px-4 text-right">Recorded Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline text-ink">
                  <tr className="hover:bg-surface-strong/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-[10px] shrink-0">
                          AK
                        </div>
                        <div>
                          <span className="font-semibold text-ink block font-sans">Alex K.</span>
                          <span className="text-[10.5px] text-muted">TRK-290 (Distributed Raft Engine)</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-link">feat/raft-election</td>
                    <td className="py-3.5 px-4 text-body">VS Code 1.94</td>
                    <td className="py-3.5 px-4 text-right font-bold text-ink">03:42:50</td>
                  </tr>

                  <tr className="hover:bg-surface-strong/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          SL
                        </div>
                        <div>
                          <span className="font-semibold text-ink block font-sans">Sarah L.</span>
                          <span className="text-[10.5px] text-muted">TRK-311 (gRPC Multiplexing Gate)</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-link">fix/grpc-rst-stream</td>
                    <td className="py-3.5 px-4 text-body">GoLand 2024.2</td>
                    <td className="py-3.5 px-4 text-right font-bold text-ink">02:18:44</td>
                  </tr>

                  <tr className="hover:bg-surface-strong/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          MR
                        </div>
                        <div>
                          <span className="font-semibold text-ink block font-sans">Marco R.</span>
                          <span className="text-[10.5px] text-muted">TRK-402 (Rust Memory Pinning Fix)</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-link">perf/pin-alloc</td>
                    <td className="py-3.5 px-4 text-body">Neovim [tmux]</td>
                    <td className="py-3.5 px-4 text-right font-bold text-ink">04:05:12</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Bottom Call-to-Action Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden bg-canvas">
        <div className="hero-atmospheric-wash absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold font-poppins text-ink tracking-tight leading-tight">
            Build faster. Track accurately. Never guess your hours again.
          </h2>

          <p className="text-sm sm:text-base text-body leading-relaxed max-w-xl mx-auto">
            Join thousands of engineering teams utilizing quiet, automated telemetry to eliminate standup friction and clock-punching fatigue.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto h-11 px-7 bg-primary hover:bg-primary-active text-on-primary rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <span>Get Started with TrackFlow</span>
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto h-11 px-6 rounded-xl border border-hairline-strong bg-surface-card hover:bg-surface-strong text-ink font-medium text-sm transition-all shadow-xs cursor-pointer"
            >
              Book Architecture Demo
            </button>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline font-mono text-[11px] text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Status: All systems 100% operational // 99.99% uptime</span>
            </span>
          </div>
        </div>
      </section>

      {/* 10. Comprehensive Footer */}
      <footer className="mt-auto border-t border-hairline py-12 px-4 sm:px-6 lg:px-8 bg-canvas-soft/80 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-xs text-body mb-10">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary text-on-primary rounded-md flex items-center justify-center font-mono font-bold text-[11px]">
                TF
              </div>
              <span className="font-poppins font-bold text-sm text-ink">TrackFlow</span>
            </div>
            <p className="text-muted leading-relaxed max-w-sm text-xs">
              Infrastructure-grade developer task scheduling, telemetry logging, and active time-tracking.
            </p>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-2.5">
            <p className="font-mono uppercase tracking-wider text-[11px] font-semibold text-ink">
              Product
            </p>
            <ul className="space-y-1.5 text-muted">
              <li><Link to="/tasks" className="hover:text-ink transition-colors">Features</Link></li>
              <li><Link to="/tasks" className="hover:text-ink transition-colors">Workflows</Link></li>
              <li><Link to="/time-logs" className="hover:text-ink transition-colors">Telemetry Log</Link></li>
              <li><a href="#pricing" className="hover:text-ink transition-colors">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-2.5">
            <p className="font-mono uppercase tracking-wider text-[11px] font-semibold text-ink">
              Resources
            </p>
            <ul className="space-y-1.5 text-muted">
              <li><a href="#docs" className="hover:text-ink transition-colors">Documentation</a></li>
              <li><a href="#changelog" className="hover:text-ink transition-colors">Changelog</a></li>
              <li><a href="#integrations" className="hover:text-ink transition-colors">Integrations</a></li>
              <li><a href="#guides" className="hover:text-ink transition-colors">Guides</a></li>
            </ul>
          </div>

          {/* Column 3: Developers */}
          <div className="space-y-2.5">
            <p className="font-mono uppercase tracking-wider text-[11px] font-semibold text-ink">
              Developers
            </p>
            <ul className="space-y-1.5 text-muted">
              <li><a href="#api" className="hover:text-ink transition-colors">API Reference</a></li>
              <li><a href="#cli" className="hover:text-ink transition-colors">CLI Tooling</a></li>
              <li><a href="#sdks" className="hover:text-ink transition-colors">SDKs &amp; Webhooks</a></li>
              <li><a href="#status" className="hover:text-ink transition-colors">System Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>All systems operational</span>
          </div>
          <p>© 2026 TrackFlow Inc. Precision infrastructure for developer workflows.</p>
        </div>
      </footer>
    </div>
  );
}