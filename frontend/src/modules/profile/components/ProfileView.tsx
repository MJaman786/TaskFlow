import React from 'react';
import ProfileDetails from './ProfileDetails';
import ChangePassword from './ChangePassword';

export default function ProfileView() {
  return (
    <div className="w-full h-full flex flex-col font-sans p-4 sm:p-6 animate-fadeIn max-w-4xl mx-auto bg-canvas">
      {/* Top Page Header */}
      <div className="mb-6 pb-6 border-b border-hairline">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink font-poppins">Account Settings</h1>
        <p className="text-sm text-muted mt-1">
          Manage your developer profile, identity, and security authentication credentials.
        </p>
      </div>

      {/* Content Stream (Single Column) */}
      <div className="flex flex-col gap-6 w-full">
        <ProfileDetails />
        <ChangePassword />
      </div>
    </div>
  );
}
