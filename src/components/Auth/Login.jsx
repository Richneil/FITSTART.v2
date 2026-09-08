import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  KeyRound, 
  Target, 
  BookOpen
} from 'lucide-react';
import GoogleOAuthButton from './GoogleOAuthButton.jsx';
import { api, getPendingGuestAssessment } from '../../utils/api.js';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const pendingGuest = getPendingGuestAssessment();

  // 2FA state
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  // 3-Slide Welcome Carousel
  const [carouselIdx, setCarouselIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx(prev => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

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
      if (res.linkedProfileId) {
        navigate(`/results/${res.linkedProfileId}`);
      } else {
        navigate('/dashboard');
      }
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
      if (res.linkedProfileId) {
        navigate(`/results/${res.linkedProfileId}`);
      } else {
        navigate('/dashboard');
      }
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
      <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center p-4 sm:p-6 max-w-md mx-auto w-full font-sans animate-fade-in pb-20">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-xs font-display font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1 block">
            Account Security
          </span>
          <h1 className="text-2xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
            Two-Factor Authentication
          </h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 max-w-xs mx-auto">
            Enter the 6-digit authentication code for <strong className="text-surface-800 dark:text-surface-200">{twoFactorData.email}</strong>.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify2FA} className="space-y-4">
          <div className="card p-6 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl shadow-card">
            <label className="block text-xs font-display font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2 text-center">
              Enter 6-Digit Code
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
                className="w-full pl-12 pr-4 py-3.5 text-center tracking-[0.3em] font-mono text-xl font-bold rounded-2xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-surface-900 dark:text-white"
              />
            </div>

            {/* Quick Demo Fill Button */}
            <button
              type="button"
              onClick={() => setTwoFactorCode('123456')}
              className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-[11px] font-display font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Demo: Quick-Fill Code (123456)
            </button>
          </div>

          <button
            type="submit"
            disabled={twoFactorLoading || twoFactorCode.length !== 6}
            className="btn-primary"
          >
            {twoFactorLoading ? 'Verifying Code...' : 'Confirm & Sign In'} <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setTwoFactorData(null);
              setTwoFactorCode('');
              setError(null);
            }}
            className="btn-secondary"
          >
            Cancel & Back to Email Login
          </button>
        </form>
      </div>
    );
  }

  // 3-Slide Welcome Carousel
  const SLIDES = [
    {
      icon: Activity,
      tag: 'Assessment Insights',
      title: 'Demystify 3D Scan Slips',
      desc: 'Transform raw FitMao numbers into clear, plain-language body composition metrics.'
    },
    {
      icon: Target,
      tag: 'Decision Support',
      title: 'Your #1 Main Starting Point',
      desc: 'Our deterministic rule-based engine pinpoints exactly which metric to focus on first.'
    },
    {
      icon: BookOpen,
      tag: 'Educational Guidance',
      title: 'Understand Your Measurements',
      desc: 'Learn what each muscle, fat, and metabolic measurement means in plain language.'
    }
  ];

  const SlideIcon = SLIDES[carouselIdx].icon;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center p-4 sm:p-6 max-w-md mx-auto w-full font-sans pb-24">
      
      {/* 3-Slide Landing Carousel */}
      <div className="card p-5 sm:p-6 mb-6 bg-gradient-to-br from-brand-50/60 via-white to-surface-50 dark:from-surface-900 dark:via-surface-900 dark:to-surface-850 border border-brand-200/60 dark:border-surface-800 shadow-card text-center relative overflow-hidden transition-all duration-300">
        <div className="w-12 h-12 bg-brand-500/10 dark:bg-brand-400/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-brand-600 dark:text-brand-400 border border-brand-500/20">
          <SlideIcon className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-display font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider block mb-1">
          {SLIDES[carouselIdx].tag}
        </span>
        <h2 className="text-base sm:text-lg font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
          {SLIDES[carouselIdx].title}
        </h2>
        <p className="text-xs text-surface-600 dark:text-surface-400 mt-1 max-w-xs mx-auto leading-relaxed">
          {SLIDES[carouselIdx].desc}
        </p>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCarouselIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === carouselIdx ? 'w-6 bg-brand-600 dark:bg-brand-400' : 'w-2 bg-surface-200 dark:bg-surface-700'}`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="text-center mb-5">
        <h1 className="text-2xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
          Sign In to FitStart
        </h1>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
          Access your saved assessments and member history at KSYN Fitness Alabang.
        </p>
      </div>

      {pendingGuest && (
        <div className="mb-4 p-3.5 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 rounded-2xl text-brand-900 dark:text-brand-200 text-xs flex items-start gap-2.5 animate-fade-in shadow-subtle">
          <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <div className="leading-snug font-sans">
            <strong className="block font-display font-semibold">Active Assessment Detected</strong>
            <span>Signing in will link your current assessment to your permanent history.</span>
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
        <div>
          <label className="block text-xs font-display font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="member@ksynfitness.com"
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
              placeholder="••••••••"
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
          {loading ? 'Signing In...' : 'Sign In to Portal'} <ArrowRight className="w-4 h-4 ml-1.5" />
        </button>
      </form>

      {/* Google OAuth Option */}
      <div className="mb-5">
        <GoogleOAuthButton onSuccess={(user, res) => {
          if (onLoginSuccess) onLoginSuccess(user);
          if (res?.linkedProfileId) {
            navigate(`/results/${res.linkedProfileId}`);
          } else {
            navigate('/dashboard');
          }
        }} />
      </div>

      {/* Demo Credentials Quick-Fill for Thesis Defense */}
      <div className="p-4 bg-surface-50 dark:bg-surface-800/80 border border-surface-200 dark:border-surface-700 rounded-3xl mb-5">
        <div className="flex items-center gap-1.5 text-xs font-display font-bold text-surface-700 dark:text-surface-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Demo Account (Quick-Fill):</span>
        </div>
        <button
          type="button"
          onClick={() => handleQuickFill('alex@ksynfitness.com', 'password123')}
          className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-surface-900 hover:bg-brand-50 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 text-xs transition-colors flex justify-between items-center cursor-pointer shadow-subtle"
        >
          <div>
            <strong className="text-surface-800 dark:text-surface-200 block text-xs font-display">Alex Rivera (Standard Member)</strong>
            <span className="text-[11px] text-surface-500 dark:text-surface-400 font-mono">alex@ksynfitness.com</span>
          </div>
          <span className="text-[11px] font-display font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded">Fill</span>
        </button>
      </div>

      <div className="text-center text-xs text-surface-500 dark:text-surface-400">
        Don't have a FitStart account?{' '}
        <Link to="/signup" className="text-brand-600 dark:text-brand-400 font-display font-semibold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
