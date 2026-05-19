import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Admin' | 'Sales User'>('Sales User');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await register({ name, email, password, role });
      addToast('Registration successful! Welcome.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 w-full border border-white/20 dark:border-slate-800/80 bg-white/75 dark:bg-slate-950/70 backdrop-blur-xl relative overflow-hidden">
      {/* Visual Accent top ribbon */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse" />

      <div className="flex flex-col items-center mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-extrabold font-display shadow-lg shadow-indigo-500/20 mb-3">
          SL
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-7">
          Create Account
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
          Set up a new workspace environment
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<UserIcon size={16} />}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={16} />}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="•••••••• (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
          />
        </div>

        {/* Custom Styled Select Dropdown */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-display">
            Workspace Role
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
              <ShieldAlert size={16} />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'Admin' | 'Sales User')}
              className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm transition-all duration-200 outline-none backdrop-blur-xs font-medium focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
            >
              <option value="Sales User">Sales User (Read + Write, No Delete)</option>
              <option value="Admin">Admin (Full Access + Deletion + CSV Export)</option>
            </select>
            <div className="absolute right-3.5 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
              ▼
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 mt-2 rounded-xl text-sm"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-indigo-500 hover:text-indigo-600 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};
