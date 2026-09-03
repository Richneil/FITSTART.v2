import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ShieldCheck, KeyRound } from 'lucide-react';
import GoogleOAuthButton from './GoogleOAuthButton.jsx';
import { api } from '../../utils/api.js';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2FA state
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      
      // Check if user requires Two-Factor Authentication
      if (res.require2FA) {
        setTwoFactorData({ userId: res.userId, email: res.email });
        return;
      }

      if (onLoginSuccess) onLoginSuccess(res.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError(null);
    setTwoFactorLoading(true);

    try {
      const res = await api.verify2FALogin({
        userId: twoFactorData.userId,
        code: twoFactorCode
      });
      if (onLoginSuccess) onLoginSuccess(res.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid 2FA verification code.');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  // 2FA Verification Screen
  if (twoFactorData) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center p-4 sm:p-6 max-w-md sm:max-w-lg mx-auto w-full font-sans animate-fade-in pb-20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800 shadow-sm text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1 block">
            Account Security Check
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white tracking-tight">
            Two-Factor Authentication
          </h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 max-w-xs mx-auto">
            A verification code is required for <strong>{twoFactorData.email}</strong>.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify2FA} className="space-y-4">
          <div className="card p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl shadow-sm">
            <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2 text-center">
              Enter 6-Digit Verification Code
            </label>
            <div className="relative mb-3">
              <KeyRound className="w-5 h-5 text-surface-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-12 pr-4 py-3.5 text-center tracking-[0.3em] font-mono text-xl font-bold rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:border-brand-500 text-surface-900 dark:text-white shadow-sm"
              />
            </div>

            {/* Quick Demo Fill Button */}
            <button
              type="button"
              onClick={() => setTwoFactorCode('123456')}
              className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Defense Demo: Quick-Fill Code (123456)
            </button>
          </div>

          <button
            type="submit"
            disabled={twoFactorLoading || twoFactorCode.length !== 6}
            className="btn-primary w-full py-3.5 min-h-[48px] text-xs font-black shadow-md flex items-center justify-center gap-2"
          >
            {twoFactorLoading ? 'Verifying Code...' : 'Confirm & Sign In'} <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setTwoFactorData(null);
              setTwoFactorCode('');
              setError(null);
            }}
            className="btn-secondary w-full py-3 text-xs font-bold"
          >
            Cancel & Back to Email Login
          </button>
        </form>
      </div>
    );
  }

  // Standard Login Screen
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center p-4 sm:p-6 max-w-md sm:max-w-lg mx-auto w-full font-sans pb-24">
      <div className="text-center mb-7">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/60 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-brand-200 dark:border-brand-800 shadow-sm text-brand-600 dark:text-brand-400">
          <Activity className="w-8 h-8" />
        </div>
        <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1 block">KSYN Fitness Alabang</span>
        <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white tracking-tight">Member Portal Login</h1>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Sign in to view your personalized FitMao assessment interpretations.</p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 mb-5">
        <div>
          <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="member@ksynfitness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:border-brand-500 text-surface-900 dark:text-white shadow-sm min-h-[44px]"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:border-brand-500 text-surface-900 dark:text-white shadow-sm min-h-[44px]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 min-h-[48px] text-xs font-black shadow-md flex items-center justify-center gap-2"
        >
          {loading ? 'Signing In...' : 'Sign In to Portal'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Google OAuth Option */}
      <div className="mb-5">
        <GoogleOAuthButton onSuccess={(user) => {
          if (onLoginSuccess) onLoginSuccess(user);
          navigate('/dashboard');
        }} />
      </div>

      {/* Demo Credentials Quick-Fill for Thesis Defense */}
      <div className="p-4 bg-surface-50 dark:bg-surface-800/80 border border-surface-200 dark:border-surface-700 rounded-3xl mb-5">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-surface-700 dark:text-surface-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Thesis Defense Demo Credentials:</span>
        </div>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => handleQuickFill('alex@ksynfitness.com', 'password123')}
            className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-surface-900 hover:bg-brand-50 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 text-xs transition-colors flex justify-between items-center"
          >
            <div>
              <strong className="text-surface-800 dark:text-surface-200 block text-xs">Alex Rivera (Standard Member)</strong>
              <span className="text-[11px] text-surface-500 dark:text-surface-400 font-mono">alex@ksynfitness.com</span>
            </div>
            <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded">Fill</span>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-surface-500 dark:text-surface-400">
        Don't have a FitStart account?{' '}
        <Link to="/signup" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
