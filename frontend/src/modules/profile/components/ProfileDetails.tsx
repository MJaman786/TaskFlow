import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../../../store/Auth/useAuthStore';
import useUpdateProfile from '../hooks/useUpdateProfile';
import InputField from '../../../common/Ui/Input';
import Button from '../../../common/Ui/Buttons/modal.button';
import { Shield, Mail, Calendar, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

const ProfileValidationSchema = Yup.object().shape({
  name: Yup.string().trim().min(2, 'Name must be at least 2 characters').max(100).required('Name is required'),
});

export default function ProfileDetails() {
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || '',
    },
    validationSchema: ProfileValidationSchema,
    onSubmit: (values) => {
      updateProfile({ payload: { name: values.name.trim() } });
    },
  });

  if (!user) return null;

  // Extract initials for avatar
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl shadow-card-soft font-sans w-full overflow-hidden">
      {/* Cover Banner */}
      <div className="h-32 sm:h-40 w-full bg-linear-to-r from-violet-600 via-indigo-600 to-blue-500 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Abstract pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100L100 0V100H0Z" fill="url(#grad)" />
          <defs>
            <linearGradient id="grad" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="px-6 sm:px-8 pb-8">
        {/* Avatar Section (Overlapping) */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-10 sm:-mt-12 mb-8 relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold font-poppins shadow-xl border-4 border-surface-card">
          {initials}
        </div>
          <div className="flex flex-col items-center sm:items-start gap-1 pt-2 sm:pt-0 sm:pb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-ink leading-none">{user.name}</h3>
            <p className="text-xs sm:text-sm text-muted font-mono bg-surface-strong px-2 py-0.5 rounded-md border border-hairline">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full mt-4">
        {/* Left Form */}
        <div className="flex-1">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="border-b border-hairline pb-3 mb-4">
              <h4 className="text-sm font-bold text-ink uppercase tracking-wider">Personal Information</h4>
              <p className="text-xs text-muted mt-0.5">Update your display name and preferences.</p>
            </div>
            
            <InputField
              label="Display Name"
              name="name"
              placeholder="e.g., Alex Chen"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.name}
              error={formik.errors.name}
            />
            <InputField
              label="Email Address"
              name="email"
              value={user.email}
              disabled
              onChange={() => {}}
            />
            <div className="pt-2">
              <Button
                type="submit"
                label="Save Changes"
                loadingLabel="Saving..."
                isLoading={isPending}
                disabled={!formik.dirty}
                className="bg-primary text-on-primary hover:bg-primary-hover w-full sm:w-auto px-8 py-2.5 rounded-lg shadow-primary-btn"
              />
            </div>
          </form>
        </div>

        {/* Right Metadata Block (now tight and responsive) */}
        <div className="w-full md:w-72 bg-gradient-to-b from-canvas-soft to-surface-card border border-hairline rounded-xl p-5 h-fit shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
          
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-5 flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Account Metadata
          </h4>
          
          <div className="space-y-5 text-sm relative z-10">
            <div className="flex items-center gap-3.5 group">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                <Shield size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted uppercase tracking-tight">Platform Role</span>
                <span className="font-bold text-ink capitalize text-sm">{user.role.toLowerCase()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                <UserIcon size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted uppercase tracking-tight">Account Status</span>
                <span className="font-bold text-ink capitalize text-sm flex items-center gap-1.5">
                  {user.status?.toLowerCase() || 'active'}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${user.isEmailVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                <Mail size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted uppercase tracking-tight">Email Verified</span>
                <span className="font-bold text-ink text-sm">{user.isEmailVerified ? 'Verified' : 'Pending'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group">
              <div className="w-9 h-9 rounded-lg bg-surface-strong text-muted-strong flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted uppercase tracking-tight">Registered</span>
                <span className="font-semibold text-ink text-xs">{user.created_at ? format(new Date(user.created_at), 'MMMM dd, yyyy') : 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
