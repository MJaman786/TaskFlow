import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Clock,
  ArrowRight,
  Shield,
  Sun,
  Moon,
//   Github,
  Globe,
  Key,
} from 'lucide-react';
import InputField from '../../../common/Ui/Input';
import Button from '../../../common/Ui/Buttons/modal.button';
import useLogin from '../hooks/useLogin';
import { useThemeStore } from '../../../store/Theme/useThemeStore';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Please enter a valid work email')
    .required('Work email is required'),
  password: Yup.string().required('Password is required'),
  rememberMe: Yup.boolean().optional(),
});

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { mutate: loginUser, isPending } = useLogin();
  const [rememberSession, setRememberSession] = useState(true);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      loginUser(
        {
          payload: {
            email: values.email.trim().toLowerCase(),
            password: values.password,
          },
        },
        {
          onSuccess: (res) => {
            if (res?.success) {
              navigate('/dashboard');
            }
          },
        }
      );
    },
  });

  return (
    <div className="relative min-h-screen w-full bg-canvas text-ink flex flex-col justify-between items-center px-4 py-8 sm:py-12 transition-colors duration-200 font-sans selection:bg-sky-light/40 overflow-x-hidden">
      {/* Background Atmospheric Radial Wash */}
      <div className="hero-atmospheric-wash absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] pointer-events-none -z-10" />

      {/* Floating Theme Switcher */}
      <div className="w-full max-w-md flex justify-end mb-2">
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
      <div className="w-full max-w-[480px] bg-surface-card border border-hairline-strong rounded-2xl p-6 sm:p-9 shadow-card relative z-10">
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
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-poppins text-ink">
            Sign in to TrackFlow
          </h1>
          <p className="text-xs sm:text-sm text-body leading-relaxed">
            Track engineering tasks and billable hours with precision
          </p>
        </div>

        {/* Formik Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Demo Credentials */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              onClick={() => {
                formik.setFieldValue('email', 'admin@taskflow.com');
                formik.setFieldValue('password', 'Admin@1234');
              }}
              className="h-9 px-3 rounded-lg border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-500 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => {
                formik.setFieldValue('email', 'user@taskflow.com');
                formik.setFieldValue('password', 'User@1234');
              }}
              className="h-9 px-3 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Demo User
            </button>
          </div>
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

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-body uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-text-link hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <InputField
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

          {/* Session Security Row */}
          <div className="flex items-center justify-between pt-1 select-none text-xs">
            <label className="inline-flex items-center gap-2 cursor-pointer text-body hover:text-ink">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="w-4 h-4 rounded-xs border-hairline-strong bg-surface-card accent-primary cursor-pointer"
              />
              <span className="font-medium">Trust this session for 30 days</span>
            </label>

            <span className="font-mono text-[10px] text-muted flex items-center gap-1">
              <Shield size={11} className="text-emerald-500" />
              AES-256
            </span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            label="Sign in →"
            loadingLabel="Authenticating..."
            isLoading={isPending}
            className="w-full h-11 text-sm font-semibold mt-2"
          />

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-hairline" />
            </div>
            <div className="relative flex justify-center text-[10.5px] uppercase font-mono">
              <span className="bg-surface-card px-3 text-muted">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Auth Stubs */}
          <div className="grid grid-cols-3 gap-2.5">
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
              <span>SSO</span>
            </button>
          </div>

          {/* Active Telemetry Node Card */}
          <div className="mt-5 p-3 rounded-xl bg-surface-strong/50 border border-hairline flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-muted">
              <Clock size={13} className="text-amber-500" />
              <span>Active telemetry node</span>
            </div>
            <div className="text-ink font-semibold text-[11px]">
              us-east-1 <span className="text-muted">//</span>{' '}
              <span className="text-emerald-500">12ms</span>
            </div>
          </div>

          {/* Sign Up Redirect Link */}
          <div className="text-center pt-3">
            <p className="text-xs text-body">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-text-link hover:underline transition-colors"
              >
                Start a 14-day team trial
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
          <span>•</span>
          <a href="#terms" className="hover:text-ink transition-colors">
            Terms of Service
          </a>
          <span>•</span>
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