import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import InputField from '../../../common/Ui/Input';
import Button from '../../../common/Ui/Buttons/modal.button';
import useResetPassword from '../hooks/useResetPassword';

const ResetSchema = Yup.object().shape({
  email: Yup.string().trim().email('Invalid email').required('Email is required'),
  otp: Yup.string()
    .trim()
    .length(6, 'Recovery code must be exactly 6 digits')
    .required('Recovery code is required'),
  password: Yup.string()
    .min(6, 'New password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your new password'),
});

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailParam = searchParams.get('email') || '';

  const { mutate: resetPassword, isPending } = useResetPassword();

  const formik = useFormik({
    initialValues: {
      email: emailParam,
      otp: '',
      password: '',
      confirmPassword: '',
    },
    enableReinitialize: true,
    validationSchema: ResetSchema,
    onSubmit: (values) => {
      resetPassword(
        {
          payload: {
            email: values.email.trim().toLowerCase(),
            otp: values.otp.trim(),
            password: values.password,
            confirmPassword: values.confirmPassword,
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

  return (
    <div className="relative min-h-screen w-full bg-canvas text-ink flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200 font-sans selection:bg-sky-light/40">
      <div className="hero-atmospheric-wash absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-surface-card border border-hairline-strong rounded-2xl p-6 sm:p-8 shadow-card relative z-10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-muted">
            SECURITY // CREDENTIAL UPDATE
          </span>
          <span className="font-mono text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Active
          </span>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl font-bold font-poppins text-ink">
            Set new password
          </h1>
          <p className="text-xs sm:text-sm text-body leading-relaxed max-w-xs mx-auto">
            Provide the 6-digit recovery code from your email and your new password.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {!emailParam && (
            <InputField
              label="Work email address"
              type="email"
              name="email"
              placeholder="engineer@company.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.email}
              error={formik.errors.email}
            />
          )}

          <div className="space-y-1">
            <label className="block text-xs font-medium text-body uppercase tracking-wider">
              6-Digit Recovery Code
            </label>
            <input
              type="text"
              name="otp"
              maxLength={6}
              placeholder="000000"
              value={formik.values.otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                formik.setFieldValue('otp', val);
              }}
              onBlur={formik.handleBlur}
              className="w-full h-11 text-center font-mono text-xl tracking-[0.3em] bg-surface-card border border-hairline-strong rounded-md text-ink focus:border-ink outline-none transition-all"
            />
            {formik.touched.otp && formik.errors.otp && (
              <p className="text-xs text-error font-medium">{formik.errors.otp}</p>
            )}
          </div>

          <InputField
            label="New password (min 6 characters)"
            type="password"
            name="password"
            placeholder="••••••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.password}
            error={formik.errors.password}
          />

          <InputField
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••••••"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.confirmPassword}
            error={formik.errors.confirmPassword}
          />

          <Button
            type="submit"
            label="Update Password & Sign In"
            loadingLabel="Committing security update..."
            isLoading={isPending}
            className="w-full h-11 text-sm font-semibold mt-2"
          />
        </form>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Cancel and return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}