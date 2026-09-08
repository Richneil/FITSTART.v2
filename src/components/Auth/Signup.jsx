import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import GoogleOAuthButton from './GoogleOAuthButton.jsx';
import { api, getPendingGuestAssessment } from '../../utils/api.js';

export default function Signup({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const pendingGuest = getPendingGuestAssessment();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.register({ email, password, firstName, lastName });
      if (onLoginSuccess) onLoginSuccess(res.user);
      if (res.linkedProfileId) {
        navigate(`/results/${res.linkedProfileId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center p-4 sm:p-6 max-w-md mx-auto w-full font-sans pb-24">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-brand-500/10 dark:bg-brand-400/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-brand-500/20 text-brand-600 dark:text-brand-400 shadow-sm">
          <Activity className="w-7 h-7" />
        </div>
        <span className="text-xs font-display font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider mb-1 block">
          Save Your Assessment
        </span>
        <h1 className="text-2xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
          Create an Account
        </h1>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
          Save your FitMao results and access your history at KSYN Fitness Alabang.
        </p>
      </div>

      {pendingGuest && (
        <div className="mb-4 p-3.5 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 rounded-2xl text-brand-900 dark:text-brand-200 text-xs flex items-start gap-2.5 animate-fade-in shadow-subtle">
          <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <div className="leading-snug font-sans">
            <strong className="block font-display font-semibold">Active Assessment Detected</strong>
            <span>Your current assessment results will be automatically saved to your new account upon registration!</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-display font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1.5">
              First Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-surface-900 dark:text-white shadow-subtle"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              required
              placeholder="Rivera"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-surface-900 dark:text-white shadow-subtle"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-display font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="alex@ksynfitness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-surface-900 dark:text-white shadow-subtle"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-display font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-surface-900 dark:text-white shadow-subtle"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Creating Account...' : 'Create Free Account'} <ArrowRight className="w-4 h-4 ml-1.5" />
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-200 dark:border-surface-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface-50 dark:bg-surface-950 px-3 text-surface-400 font-bold">Or</span>
        </div>
      </div>

      <GoogleOAuthButton
        onSuccess={(user, res) => {
          if (onLoginSuccess) onLoginSuccess(user);
          if (res?.linkedProfileId) {
            navigate(`/results/${res.linkedProfileId}`);
          } else {
            navigate('/dashboard');
          }
        }}
        onError={(msg) => setError(msg)}
      />

      <p className="text-xs text-center text-surface-500 dark:text-surface-400 mt-5 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 font-display font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
