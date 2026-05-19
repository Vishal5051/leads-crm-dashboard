import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/Skeleton';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-darkbg flex items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col gap-4">
          <Skeleton variant="circle" className="mx-auto" />
          <Skeleton variant="text" className="h-8 w-2/3 mx-auto" />
          <Skeleton variant="rect" className="h-48" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-darkbg flex items-center justify-center p-4">
      {/* Background radial soft glowing colors */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Outlet />
      </div>
    </div>
  );
};
