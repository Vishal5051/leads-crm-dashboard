import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
      addToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 w-full border border-white/20 dark:border-slate-800/80 bg-white/75 dark:bg-slate-950/70 backdrop-blur-xl relative overflow-hidden">
      {/* Visual Accent top ribbon */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />

      <div className="flex flex-col items-center mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-extrabold font-display shadow-lg shadow-indigo-500/20 mb-3">
          SL
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-7">
          Workspace Sign In
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
          Enter details below to access CRM staging
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="••••••••"
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

        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 mt-2 rounded-xl text-sm"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account yet?{' '}
        <Link
          to="/register"
          className="font-bold text-indigo-500 hover:text-indigo-600 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          Register Workspace
        </Link>
      </div>
    </div>
  );
};
