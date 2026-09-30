import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Shield,
  Clock,
  RefreshCw,
  Key,
  ShieldCheck,
  ArrowLeft,
  Sun,
  Moon,
  Terminal,
} from 'lucide-react';
import Button from '../../../common/Ui/Buttons/modal.button';
import useVerifyEmail from '../hooks/useVerifyEmail';
import useResendVerification from '../hooks/useResendVerification';
import { useThemeStore } from '../../../store/Theme/useThemeStore';

const OtpSchema = Yup.object().shape({
  email: Yup.string().trim().email('Invalid email').required('Email is required'),
  otp: Yup.string()
    .trim()
    .length(6, 'Must be exactly 6 digits')
    .matches(/^\d{6}$/, 'Passcode must contain only digits')
    .required('Passcode is required'),
});

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailParam = searchParams.get('email') || '';

  const { theme, toggleTheme } = useThemeStore();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyEmail();
  const { mutate: resendOtp, isPending: isResending } = useResendVerification();

  // 6 Individual digit inputs state
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 5-minute (300s) countdown timer
  const [secondsLeft, setSecondsLeft] = useState<number>(300);
  const [isChangingEmail, setIsChangingEmail] = useState<boolean>(false);
  const [targetEmail, setTargetEmail] = useState<string>(emailParam || 'engineer@company.com');

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formattedTimer = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [secondsLeft]);

  // Masked target email (e.g., e***r@company.com)
  const maskedEmail = useMemo(() => {
    if (!targetEmail || !targetEmail.includes('@')) return targetEmail;
    const [user, domain] = targetEmail.split('@');
    if (user.length <= 2) return `${user[0]}***@${domain}`;
    return `${user[0]}***${user[user.length - 1]}@${domain}`;
  }, [targetEmail]);

  const formik = useFormik({
    initialValues: {
      email: targetEmail,
      otp: '',
    },
    enableReinitialize: true,
    validationSchema: OtpSchema,
    onSubmit: (values) => {
      verifyOtp(
        {
          payload: {
            email: values.email.trim().toLowerCase(),
            otp: values.otp.trim(),
          },
        },
        {
          onSuccess: (res) => {
            if (res?.success) {
              navigate('/login');
            }
          },
        }
      );
    },
  });

  // Handle single digit change & auto-advance
  const handleDigitChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '');
    if (!sanitized) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      formik.setFieldValue('otp', nextDigits.join(''));
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = sanitized[sanitized.length - 1]; // take last entered digit
    setDigits(nextDigits);
    formik.setFieldValue('otp', nextDigits.join(''));

    // Move focus to next input
    if (index < 5 && sanitized) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle clipboard paste (paste 6 digits across all boxes)
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const nextDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = pasted[i] || '';
    }
    setDigits(nextDigits);
    formik.setFieldValue('otp', nextDigits.join(''));

    const nextFocusIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleResend = () => {
    if (secondsLeft > 240 || isResending) return;
    resendOtp(
      { payload: { email: targetEmail } },
      {
        onSuccess: () => {
          setSecondsLeft(300);
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-canvas text-ink flex flex-col justify-between items-center px-4 py-8 sm:py-12 transition-colors duration-200 font-sans selection:bg-sky-light/40 overflow-x-hidden">
      {/* Background Radial Glow */}
      <div className="hero-atmospheric-wash absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] pointer-events-none -z-10" />

      {/* Theme Switcher Header */}
      <div className="w-full max-w-[480px] flex justify-end mb-2">
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
      <div className="w-full max-w-[480px] bg-surface-card border border-hairline-strong rounded-2xl p-6 sm:p-9 shadow-card relative z-10 space-y-6">
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div className="flex items-center gap-2 select-none">
            <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              <span className="tracking-tight">TF</span>
            </div>
            <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-ink">
              TRACKFLOW <span className="text-muted font-normal">OS</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-strong border border-hairline font-mono text-[10px] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>v2.4.0-prod</span>
          </div>
        </div>

        {/* Sub-badge & Title */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-muted font-mono text-[10.5px] uppercase tracking-wider">
            <Shield size={12} className="text-text-link" />
            <span>Hardware Token / TOTP Enforced</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-poppins text-ink">
            Verify your identity
          </h1>

          <p className="text-xs sm:text-sm text-body leading-relaxed">
            Enter the 6-digit one-time passcode sent to your registered work device or generated by your authenticator app.
          </p>
        </div>

        {/* Target Email Box with Change Toggle */}
        <div className="p-3 bg-surface-strong/60 border border-hairline rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-ink truncate">
            <ShieldCheck size={14} className="text-text-link shrink-0" />
            {isChangingEmail ? (
              <input
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="bg-canvas px-2 py-0.5 border border-hairline rounded text-xs text-ink outline-none"
              />
            ) : (
              <span className="truncate">Target: {maskedEmail}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsChangingEmail((prev) => !prev)}
            className="text-text-link hover:underline font-semibold text-[11px] shrink-0 cursor-pointer ml-2"
          >
            {isChangingEmail ? 'Done' : 'Change'}
          </button>
        </div>

        {/* Formik Form with 6-Digit Individual Inputs */}
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  className={`w-full h-14 sm:h-16 text-center font-mono text-xl sm:text-2xl font-bold rounded-xl border bg-canvas text-ink transition-all outline-none ${
                    digit
                      ? 'border-ink ring-1 ring-ink/20'
                      : 'border-hairline-strong hover:border-ink/50 focus:border-ink focus:ring-1 focus:ring-ink'
                  }`}
                />
              ))}
            </div>

            {formik.touched.otp && formik.errors.otp && (
              <p className="text-xs text-error font-medium text-center pt-1 animate-fadeIn">
                {formik.errors.otp}
              </p>
            )}
          </div>

          {/* Countdown & Resend Passcode Row */}
          <div className="flex items-center justify-between text-xs font-mono text-muted select-none">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-amber-500" />
              <span>Expires in <strong className="text-ink">{formattedTimer}</strong></span>
            </div>

            <button
              type="button"
              onClick={handleResend}
              disabled={secondsLeft > 240 || isResending}
              className="inline-flex items-center gap-1 text-body hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <RefreshCw size={12} className={isResending ? 'animate-spin' : ''} />
              <span>Resend passcode</span>
            </button>
          </div>

          {/* Primary Action Button */}
          <Button
            type="submit"
            label="Verify Passcode & Enter →"
            loadingLabel="Verifying token..."
            isLoading={isVerifying}
            className="w-full h-11 text-sm font-semibold"
          />

          {/* Secondary FIDO2 Security Key Button */}
          <button
            type="button"
            onClick={() => alert('FIDO2 WebAuthn handshake initiated on device.')}
            className="w-full h-11 rounded-md border border-hairline-strong bg-surface-card hover:bg-surface-strong text-ink text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Key size={14} className="text-text-link" />
            <span>Verify via Security Key (FIDO2)</span>
          </button>

          {/* Emergency Backup & Back Navigation Links */}
          <div className="space-y-2 text-center pt-1 text-xs">
            <button
              type="button"
              onClick={() => alert('Enter your 24-word emergency recovery seed in console.')}
              className="text-body hover:text-ink block mx-auto transition-colors cursor-pointer"
            >
              Use backup emergency recovery code
            </button>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Back to Sign In</span>
            </Link>
          </div>

          {/* Daemon IPC Challenge Status Card */}
          <div className="p-3.5 rounded-xl bg-surface-strong/50 border border-hairline space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                DAEMON IPC CHALLENGE
              </span>
              <span className="text-emerald-500 font-semibold uppercase">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-muted text-[10.5px]">
              <span>Token validity: {secondsLeft}s</span>
              <span>us-east-1 // 11ms</span>
            </div>
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