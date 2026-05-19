import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/20 focus:ring-indigo-500 dark:focus:ring-offset-darkbg',
    secondary: 'bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white shadow-lg shadow-fuchsia-500/20 border border-fuchsia-500/20 focus:ring-fuchsia-500 dark:focus:ring-offset-darkbg',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/10 focus:ring-rose-500 dark:focus:ring-offset-darkbg',
    outline: 'border border-slate-300 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 focus:ring-slate-500 dark:focus:ring-offset-darkbg',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 focus:ring-slate-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-1.5">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-1.5">{rightIcon}</span>}
    </button>
  );
};
