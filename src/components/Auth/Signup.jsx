import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';
import GoogleOAuthButton from './GoogleOAuthButton.jsx';
import { api } from '../../utils/api.js';

export default function Signup({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.register({ email, password, firstName, lastName });
      if (onLoginSuccess) onLoginSuccess(res.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center p-4 sm:p-6 max-w-md sm:max-w-lg mx-auto w-full font-sans">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-200 shadow-sm text-brand-600">
          <Activity className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1 block">New Member Registration</span>
        <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">Create Your Account</h1>
        <p className="text-xs text-surface-500 mt-1">Start your explainable fitness journey at KSYN Fitness Alabang.</p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">First Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-surface-300 bg-white focus:outline-none focus:border-brand-500 text-surface-900 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">Last Name</label>
            <input
              type="text"
              required
              placeholder="Rivera"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 text-xs rounded-2xl border border-surface-300 bg-white focus:outline-none focus:border-brand-500 text-surface-900 shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="alex@ksynfitness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:border-brand-500 text-surface-900 dark:text-white shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1.5">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:border-brand-500 text-surface-900 dark:text-white shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-200 dark:border-surface-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface-50 dark:bg-surface-950 px-3 text-surface-400 font-bold">Or</span>
        </div>
      </div>

      <GoogleOAuthButton
        onSuccess={(user) => {
          if (onLoginSuccess) onLoginSuccess(user);
          navigate('/dashboard');
        }}
        onError={(msg) => setError(msg)}
      />

      <p className="text-xs text-center text-surface-500 dark:text-surface-400 mt-6 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
