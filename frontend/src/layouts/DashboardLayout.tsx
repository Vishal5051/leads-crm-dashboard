import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/Skeleton';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-darkbg flex flex-col p-6">
        <Skeleton variant="text" className="h-16 w-full mb-6" />
        <div className="flex gap-6 flex-1">
          <Skeleton variant="rect" className="w-64 h-full hidden md:block" />
          <Skeleton variant="rect" className="flex-1 h-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const activeClass = 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold';
  const inactiveClass = 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-slate-100';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg transition-colors duration-300 flex overflow-hidden">
      {/* 1. Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-all duration-300 ease-in-out relative z-30 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold font-display shadow-lg shadow-indigo-500/20 flex-shrink-0">
              SL
            </div>
            {isSidebarOpen && (
              <span className="font-extrabold font-display bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent text-base tracking-wide truncate">
                Smart Leads
              </span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Workspace Info Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate leading-4">
                  {user.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={12} className="text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {user.role}
                  </span>
                </div>
              </div>
            )}
            {isSidebarOpen && (
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
          {!isSidebarOpen && (
            <button
              onClick={logout}
              title="Log Out"
              className="mt-4 w-full p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all flex justify-center"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Mobile Sidebar Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-850 p-5 shadow-2xl animate-in slide-in-from-left duration-250 z-10">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold font-display shadow-lg shadow-indigo-500/20">
                  SL
                </div>
                <span className="font-extrabold font-display bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent text-sm">
                  Smart Leads
                </span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 py-6 flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive ? activeClass : inactiveClass
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate w-32 leading-3">
                      {user.name}
                    </p>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Main Content Section */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Decorative ambient glowing grids */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-500/5 dark:bg-indigo-500/3 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-pink-500/5 dark:bg-pink-500/3 blur-3xl pointer-events-none z-0" />

        {/* Top Sticky Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 z-20 relative">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 md:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base md:text-lg font-bold font-display text-slate-900 dark:text-slate-100 hidden sm:block">
              Sales Workspace
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden md:block font-display uppercase tracking-wider">
                CRM Staging
              </span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-500/10">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
