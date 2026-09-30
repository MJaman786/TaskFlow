import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { KeyRound, ArrowLeft, Send } from 'lucide-react';
import InputField from '../../../common/Ui/Input';
import Button from '../../../common/Ui/Buttons/modal.button';
import useForgotPassword from '../hooks/useForgotPassword';

const ForgotSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Please enter a valid work email')
    .required('Email address is required'),
});

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { mutate: sendRecoveryCode, isPending } = useForgotPassword();
  const [dispatched, setDispatched] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: ForgotSchema,
    onSubmit: (values) => {
      sendRecoveryCode(
        { payload: { email: values.email.trim().toLowerCase() } },
        {
          onSuccess: () => {
            setDispatched(true);
            setTimeout(() => {
              navigate(`/reset-password?email=${encodeURIComponent(values.email.trim())}`);
            }, 1200);
          },
        }
      );
    },
  });

  return (
    <div className="relative min-h-screen w-full bg-canvas text-ink flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200 font-sans selection:bg-sky-light/40">
      <div className="hero-atmospheric-wash absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-surface-card border border-hairline-strong rounded-2xl p-6 sm:p-8 shadow-card relative z-10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-muted">
            SECURITY // RECOVERY
          </span>
          <span className="font-mono text-[10px] text-muted bg-surface-strong px-2 py-0.5 rounded border border-hairline">
            SHA-256
          </span>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-xs">
            <KeyRound size={22} />
          </div>
          <h1 className="text-2xl font-bold font-poppins text-ink">
            Reset account password
          </h1>
          <p className="text-xs sm:text-sm text-body leading-relaxed max-w-xs mx-auto">
            Enter your verified work email address and we'll dispatch a 6-digit recovery code.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <InputField
            label="Registered work email"
            type="email"
            name="email"
            placeholder="engineer@company.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.email}
            error={formik.errors.email}
          />

          <Button
            type="submit"
            label="Send Recovery Code →"
            loadingLabel="Dispatching OTP..."
            isLoading={isPending}
            className="w-full h-11 text-sm font-semibold"
          />
        </form>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}