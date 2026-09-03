import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ user, loading }) {
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-surface-200 border-t-brand-500 rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-surface-500 font-semibold">Verifying secure session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
