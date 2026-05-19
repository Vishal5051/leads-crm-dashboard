import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-display">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-white/50 dark:bg-slate-900/50 border rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none backdrop-blur-xs font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-950 ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-rose-400 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 focus:ring-1 focus:ring-rose-500 focus:border-rose-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-500/50 focus:shadow-glow-primary'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 dark:text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
