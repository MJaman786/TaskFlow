import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useChangePassword from '../hooks/useChangePassword';
import InputField from '../../../common/Ui/Input';
import Button from '../../../common/Ui/Buttons/modal.button';
import { KeyRound, ShieldCheck } from 'lucide-react';

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/[a-z]/, 'Must contain lowercase')
    .matches(/[0-9]/, 'Must contain number')
    .matches(/[^A-Za-z0-9]/, 'Must contain special character')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm new password is required'),
});

export default function ChangePassword() {
  const { mutate: changePassword, isPending } = useChangePassword();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: (values, { resetForm }) => {
      changePassword(
        { payload: values },
        { 
          onSuccess: () => {
            resetForm();
          } 
        }
      );
    },
  });

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl shadow-card-soft font-sans w-full overflow-hidden flex flex-col md:flex-row">
      
      {/* Left Decoration / Information Panel */}
      <div className="w-full md:w-1/3 bg-linear-to-b from-canvas-soft to-surface-card border-b md:border-b-0 md:border-r border-hairline p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full -ml-4 -mt-4"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
            <KeyRound size={24} />
          </div>
          <h2 className="text-xl font-bold text-ink font-poppins mb-2">Security & Password</h2>
          <p className="text-sm text-muted">Rotate your account password regularly to maintain maximum security. We enforce strict password complexity rules.</p>
        </div>

        <div className="hidden md:flex items-center gap-2 mt-12 relative z-10 text-xs font-mono text-emerald-600 bg-emerald-500/10 px-3 py-2 rounded-lg w-fit">
          <ShieldCheck size={16} />
          <span className="font-semibold uppercase tracking-wider">End-to-end Encrypted</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-2/3 p-6 sm:p-8">
      <form onSubmit={formik.handleSubmit} className="space-y-5 w-full md:max-w-md">
        <InputField
          label="Current Password"
          type="password"
          name="currentPassword"
          placeholder="••••••••"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          touched={formik.touched.currentPassword}
          error={formik.errors.currentPassword}
        />
        
        <InputField
          label="New Password"
          type="password"
          name="newPassword"
          placeholder="••••••••"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          touched={formik.touched.newPassword}
          error={formik.errors.newPassword}
        />

        <InputField
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          touched={formik.touched.confirmPassword}
          error={formik.errors.confirmPassword}
        />

        <div className="pt-4">
          <Button
            type="submit"
            label="Update Password"
            loadingLabel="Updating..."
            isLoading={isPending}
            disabled={!formik.isValid || !formik.dirty}
            className="bg-primary text-on-primary hover:bg-primary-hover w-full sm:w-auto px-8 py-2.5 rounded-lg shadow-primary-btn"
          />
        </div>
      </form>
      </div>
    </div>
  );
}
