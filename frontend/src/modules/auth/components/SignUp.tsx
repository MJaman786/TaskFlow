import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
//   Github,
  Globe,
  Key,
  Sun,
  Moon,
  Terminal,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import InputField from '../../../common/Ui/Input';
import Button from '../../../common/Ui/Buttons/modal.button';
import useRegister from '../hooks/useRegister';
import { useThemeStore } from '../../../store/Theme/useThemeStore';
import type { UserRole } from '../types/auth.types';

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .required('Full name is required'),
  email: Yup.string()
    .trim()
    .email('Please provide a valid work email')
    .required('Work email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128)
    .required('Master password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  role: Yup.string()
    .oneOf(['USER', 'ADMIN'])
    .required('Primary role selection is required'),
  agreeTerms: Yup.boolean().oneOf(
    [true],
    'You must accept the Terms of Service and Telemetry Policy'
  ),
});

export default function SignUp() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { mutate: registerUser, isPending } = useRegister();

  // Dynamic Password Entropy Checker
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'USER' as UserRole,
      agreeTerms: false,
    },
    validationSchema: SignUpSchema,
    onSubmit: (values) => {
      registerUser(
        {
          payload: {
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password,
            confirmPassword: values.confirmPassword,
            role: values.role,
          },
        },
        {
          onSuccess: (res) => {
            if (res?.success) {
              // Redirect to OTP verification with user's email preset
              navigate(`/verify-email?email=${encodeURIComponent(values.email.trim())}`);
            }
          },
        }
      );
    },
  });

  // Calculate Password Strength Level for the visual entropy bar
  const entropyInfo = useMemo(() => {
    const pwd = formik.values.password;
    if (!pwd) return { label: 'Empty', bits: 0, pct: '0%', color: 'bg-hairline' };
    if (pwd.length < 6) return { label: 'Weak (< 6 chars)', bits: 24, pct: '25%', color: 'bg-error' };
    
    let score = 0;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    if (pwd.length >= 10) score++;

    if (score <= 2) return { label: 'Moderate', bits: 42, pct: '50%', color: 'bg-amber-500' };
    if (score === 3 || score === 4) return { label: 'Strong', bits: 68, pct: '80%', color: 'bg-emerald-500' };
    return { label: 'Optimal', bits: 96, pct: '100%', color: 'bg-emerald-400' };
  }, [formik.values.password]);

  return (
    <div className="relative min-h-screen w-full bg-canvas text-ink flex flex-col justify-between items-center px-4 py-8 sm:py-12 transition-colors duration-200 font-sans selection:bg-sky-light/40 overflow-x-hidden">
      {/* Background Atmospheric Radial Wash */}
      <div className="hero-atmospheric-wash absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none -z-10" />

      {/* Floating Theme Switcher */}
      <div className="w-full max-w-lg flex justify-end mb-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg bg-surface-card border border-hairline-strong hover:bg-surface-strong text-muted hover:text-ink transition-colors cursor-pointer shadow-xs"
        >
          {theme === 'dark' ? (
            <Moon size={15} className="text-amber-400" />
          ) : (
            <Sun size={15} className="text-amber-500" />
          )}
        </button>
      </div>

      {/* Main Glass/Card Container */}
      <div className="w-full max-w-lg bg-surface-card border border-hairline-strong rounded-2xl p-6 sm:p-9 shadow-card relative z-10">
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-5 border-b border-hairline mb-5">
          <div className="flex items-center gap-2 select-none">
            <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="currentColor" />
                <path d="M9 6L12 8V12L9 14L6 12V8L9 6Z" fill="var(--canvas)" />
              </svg>
            </div>
            <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-ink">
              TRACKFLOW // OS
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-strong border border-hairline font-mono text-[10px] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>v2.4.0-prod</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1 mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-poppins text-ink">
            Create your TrackFlow account
          </h1>
          <p className="text-xs sm:text-sm text-body leading-relaxed">
            Join engineering teams tracking telemetry, branch velocity, and deep work blocks.
          </p>
        </div>

        {/* Social Auth Stubs */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {/* <button
            type="button"
            onClick={() => alert('SSO with GitHub is enabled for enterprise accounts.')}
            className="h-9 px-3 rounded-lg border border-hairline-strong bg-surface-card hover:bg-surface-strong text-ink text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Github size={13} />
            <span>GitHub</span>
          </button> */}

          <button
            type="button"
            onClick={() => alert('SSO with Google Workspace is enabled for enterprise accounts.')}
            className="h-9 px-3 rounded-lg border border-hairline-strong bg-surface-card hover:bg-surface-strong text-ink text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Globe size={13} className="text-text-link" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => alert('SAML SSO is available on Enterprise tier.')}
            className="h-9 px-3 rounded-lg border border-hairline-strong bg-surface-card hover:bg-surface-strong text-ink text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Key size={13} className="text-amber-500" />
            <span>SAML</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-hairline" />
          </div>
          <div className="relative flex justify-center text-[10.5px] uppercase font-mono">
            <span className="bg-surface-card px-3 text-muted">
              or register with email
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <InputField
            label="Full name"
            name="name"
            placeholder="Alex Chen"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.name}
            error={formik.errors.name}
          />

          <InputField
            label="Work email"
            type="email"
            name="email"
            placeholder="engineer@company.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.email}
            error={formik.errors.email}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-muted">6+ chars required</span>
              </div>
              <InputField
                label="Master password"
                type="password"
                name="password"
                placeholder="••••••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.password}
                error={formik.errors.password}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-muted">Match check</span>
              </div>
              <InputField
                label="Confirm password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••••••"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.confirmPassword}
                error={formik.errors.confirmPassword}
              />
            </div>
          </div>

          {/* Entropy Check Bar (Matches Wireframe) */}
          {formik.values.password && (
            <div className="p-3 bg-surface-strong/40 border border-hairline rounded-lg space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted">Entropy check</span>
                <span className="font-semibold text-ink">
                  Strength: {entropyInfo.label} ({entropyInfo.bits} bits)
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-card border border-hairline rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${entropyInfo.color}`}
                  style={{ width: entropyInfo.pct }}
                />
              </div>
            </div>
          )}

          {/* Primary Role Selector (Mapped to USER vs ADMIN) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-body uppercase tracking-wider">
              Primary role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => formik.setFieldValue('role', 'USER')}
                className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  formik.values.role === 'USER'
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-card text-body hover:text-ink border-hairline-strong'
                }`}
              >
                <span>Engineer (USER)</span>
              </button>

              <button
                type="button"
                onClick={() => formik.setFieldValue('role', 'ADMIN')}
                className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  formik.values.role === 'ADMIN'
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-card text-body hover:text-ink border-hairline-strong'
                }`}
              >
                <Shield size={12} />
                <span>Lead / Admin (ADMIN)</span>
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-body hover:text-ink cursor-pointer select-none">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formik.values.agreeTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-4 h-4 mt-0.5 rounded-xs border-hairline-strong bg-surface-card accent-primary cursor-pointer shrink-0"
              />
              <span className="leading-relaxed">
                Agree to{' '}
                <a href="#terms" className="text-text-link hover:underline">
                  Developer Terms of Service
                </a>{' '}
                and{' '}
                <a href="#telemetry" className="text-text-link hover:underline">
                  Telemetry Policy
                </a>
                .
              </span>
            </label>
            {formik.touched.agreeTerms && formik.errors.agreeTerms && (
              <p className="text-xs text-error font-medium mt-1">
                {formik.errors.agreeTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            label="Create Account & Continue →"
            loadingLabel="Provisioning workspace..."
            isLoading={isPending}
            className="w-full h-11 text-sm font-semibold mt-2"
          />

          {/* Local Daemon Pairing Box (Matches Wireframe) */}
          <div className="p-3 bg-surface-strong/50 border border-hairline rounded-xl space-y-1 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted flex items-center gap-1.5">
                <Terminal size={12} className="text-text-link" />
                Local daemon pairing ready
              </span>
              <span className="text-ink font-semibold text-[11px]">pid: 4092</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted">Target zone: us-east-1</span>
              <span className="text-emerald-500 font-semibold">12ms latency</span>
            </div>
          </div>

          {/* Sign In Redirect Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-body">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-text-link hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Footer Info */}
      <footer className="mt-8 text-center space-y-2 text-xs text-muted font-sans">
        <div className="flex items-center justify-center gap-4">
          <a href="#privacy" className="hover:text-ink transition-colors">
            Privacy Policy
          </a>
          <span>/</span>
          <a href="#terms" className="hover:text-ink transition-colors">
            Terms of Service
          </a>
          <span>/</span>
          <span className="flex items-center gap-1 hover:text-ink transition-colors cursor-pointer">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            System Status
          </span>
        </div>
        <p className="font-mono text-[11px] text-muted">
          © 2026 TrackFlow Inc. Precision Developer Infrastructure.
        </p>
      </footer>
    </div>
  );
}