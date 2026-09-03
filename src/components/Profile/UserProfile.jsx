import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Mail, 
  ChevronLeft, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Camera, 
  Award, 
  Sparkles, 
  Activity, 
  Check, 
  Calendar,
  Upload,
  Target,
  Smile
} from 'lucide-react';
import { api } from '../../utils/api.js';

const PRESET_AVATARS = [
  { id: 'lifter', emoji: '🏋️', label: 'Strength Lifter', bg: 'from-amber-500 to-orange-600' },
  { id: 'runner', emoji: '🏃', label: 'Endurance Runner', bg: 'from-emerald-500 to-teal-600' },
  { id: 'boxer', emoji: '🥊', label: 'Combat Athlete', bg: 'from-red-500 to-rose-600' },
  { id: 'yogi', emoji: '🧘', label: 'Mobility & Flow', bg: 'from-purple-500 to-indigo-600' },
  { id: 'swimmer', emoji: '🏊', label: 'Cardio Swimmer', bg: 'from-blue-500 to-cyan-600' },
  { id: 'power', emoji: '⚡', label: 'High Intensity', bg: 'from-yellow-400 to-amber-500' }
];

export default function UserProfile({ user, onUserUpdated, onLogout }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [avatar, setAvatar] = useState(user?.avatar || '🏋️');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(Boolean(user?.twoFactorEnabled));
  
  const [showPfpPicker, setShowPfpPicker] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  // Handle Photo File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setAvatar(dataUrl);
      setShowPfpPicker(false);
      saveAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (emoji) => {
    setAvatar(emoji);
    setShowPfpPicker(false);
    saveAvatar(emoji);
  };

  const saveAvatar = async (newAvatar) => {
    try {
      const res = await api.updateProfile({ avatar: newAvatar });
      setSuccessMsg('Profile picture updated successfully.');
      if (onUserUpdated) onUserUpdated(res.user);
    } catch (err) {
      console.warn('Avatar auto-save notice:', err.message);
    }
  };

  // Handle Profile Details Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await api.updateProfile({
        firstName,
        lastName,
        avatar,
        newPassword: newPassword || undefined
      });
      setSuccessMsg('Profile information updated successfully.');
      setNewPassword('');
      if (onUserUpdated) onUserUpdated(res.user);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA Toggle
  const handleToggle2FA = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setTwoFactorLoading(true);

    const targetState = !twoFactorEnabled;

    try {
      const res = await api.toggle2FA(targetState);
      setTwoFactorEnabled(res.twoFactorEnabled);
      setSuccessMsg(
        res.twoFactorEnabled 
          ? 'Two-Factor Authentication (2FA) is now active on your account.' 
          : 'Two-Factor Authentication has been disabled.'
      );
      if (onUserUpdated) {
        onUserUpdated({ ...user, twoFactorEnabled: res.twoFactorEnabled });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update 2FA setting.');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  const isImageAvatar = avatar?.startsWith('data:') || avatar?.startsWith('http');

  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 p-4 sm:p-6 max-w-md sm:max-w-lg mx-auto sm:border-x sm:border-surface-200 dark:sm:border-surface-800 sm:shadow-xl pb-28 font-sans animate-slide-up transition-colors duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-1.5 text-surface-600 dark:text-surface-400 font-bold text-xs hover:text-surface-900 dark:hover:text-white transition-colors bg-white dark:bg-surface-900 px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-wider">Member Hub</span>
      </div>

      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white tracking-tight">Member Profile</h1>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Customize your fitness avatar, track milestones, and manage account security.</p>
      </div>

      {successMsg && (
        <div className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ENGAGING FEATURE: Interactive PFP Avatar & Member Card */}
      <div className="card p-5 bg-gradient-to-br from-brand-900 via-brand-800 to-teal-950 text-white shadow-xl mb-5 rounded-3xl relative overflow-hidden border border-surface-700">
        <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500 rounded-full blur-3xl opacity-20 -translate-y-10 translate-x-10"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-white/15 border-2 border-white/30 flex items-center justify-center text-4xl shadow-lg overflow-hidden backdrop-blur-sm p-1">
              {isImageAvatar ? (
                <img src={avatar} alt="PFP" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="select-none">{avatar}</span>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => setShowPfpPicker(true)}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white shadow-md border-2 border-brand-900 transition-transform"
              title="Change Profile Picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-teal-300 bg-white/10 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3 h-3 text-accent-400" /> KSYN Fitness Member
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-xs text-teal-100 font-mono mt-0.5">
              {user?.email}
            </p>

            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-center sm:justify-start gap-4 text-[11px] text-teal-200">
              <div>
                <span className="text-teal-400 text-[9px] uppercase font-bold block">Club Branch</span>
                <strong className="text-white font-bold">Alabang</strong>
              </div>
              <div className="border-l border-white/20 pl-4">
                <span className="text-teal-400 text-[9px] uppercase font-bold block">Pass Status</span>
                <strong className="text-teal-300 font-bold">All-Access Active</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Change PFP Button Bar */}
        <div className="mt-4 pt-3 border-t border-white/15 relative z-10 flex justify-center sm:justify-end">
          <button
            type="button"
            onClick={() => setShowPfpPicker(true)}
            className="text-xs font-black text-teal-200 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" /> Customize Fitness Avatar / PFP
          </button>
        </div>
      </div>

      {/* PFP Customizer Modal */}
      {showPfpPicker && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-surface-900 rounded-3xl p-5 shadow-2xl relative animate-slide-up border border-surface-200 dark:border-surface-800">
            <h3 className="font-black text-surface-900 dark:text-white text-base mb-1 tracking-tight">Choose Your Fitness Avatar</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 mb-4">Pick an avatar archetype or upload your own profile photo.</p>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {PRESET_AVATARS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.emoji)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all group active:scale-95
                    ${avatar === p.emoji ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 shadow-sm' : 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{p.emoji}</span>
                  <span className="text-[10px] font-bold text-surface-700 dark:text-surface-300 text-center leading-tight">{p.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Photo Upload Option */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 mb-2 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-800 dark:text-surface-200 rounded-2xl text-xs font-black flex items-center justify-center gap-2 border border-surface-200 dark:border-surface-700 transition-colors"
            >
              <Upload className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Upload Custom Photo from Device
            </button>

            <button
              type="button"
              onClick={() => setShowPfpPicker(false)}
              className="w-full py-2.5 text-xs text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Theme Appearance Setting */}
      <div className="card p-4 sm:p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm rounded-3xl mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-surface-900 dark:text-white text-sm">Appearance Theme</h3>
              <p className="text-[11px] text-surface-500 dark:text-surface-400">
                Currently using {isDark ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-800 dark:text-surface-200 border border-surface-200 dark:border-surface-700 flex items-center gap-1.5 transition-colors"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Switch to Light
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" /> Switch to Dark
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fitness Milestone Achievements */}
      <div className="card p-4 sm:p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm rounded-3xl mb-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-1.5 text-xs font-black text-surface-900 dark:text-white">
            <Award className="w-4 h-4 text-amber-500" /> Member Milestones
          </div>
          <span className="text-[10px] font-extrabold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full border border-brand-100 dark:border-brand-800">
            {twoFactorEnabled ? '4 of 4 Completed' : '3 of 4 Completed'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/80 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-[11px] text-surface-900 dark:text-white leading-tight">FitMao Scanned</strong>
              <span className="text-[10px] text-surface-500 dark:text-surface-400">Baseline recorded</span>
            </div>
          </div>

          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/80 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <strong className="block text-[11px] text-surface-900 dark:text-white leading-tight">PAR-Q Cleared</strong>
              <span className="text-[10px] text-surface-500 dark:text-surface-400">Health safety ready</span>
            </div>
          </div>

          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/80 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-[11px] text-surface-900 dark:text-white leading-tight">Recomposition</strong>
              <span className="text-[10px] text-surface-500 dark:text-surface-400">Trajectory active</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-2xl border flex items-center gap-2.5 transition-colors
            ${twoFactorEnabled ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800' : 'bg-surface-50 dark:bg-surface-800/60 border-surface-200 dark:border-surface-700 opacity-60'}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0
              ${twoFactorEnabled ? 'bg-emerald-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-400'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-[11px] text-surface-900 dark:text-white leading-tight">2FA Protected</strong>
              <span className="text-[10px] text-surface-500 dark:text-surface-400">{twoFactorEnabled ? 'Shield Active' : 'Not enabled'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication (2FA) Security Center */}
      <div className="card p-4 sm:p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm rounded-3xl mb-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0
              ${twoFactorEnabled ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-surface-100 dark:bg-surface-800 text-surface-500'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-surface-900 dark:text-white text-sm">Two-Factor Authentication (2FA)</h3>
              <p className="text-[11px] text-surface-500 dark:text-surface-400">
                Requires a 6-digit code upon login for enhanced account security.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-surface-50 dark:bg-surface-800/80 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-surface-600 dark:text-surface-400 block">Security Status:</span>
            <span className={`text-xs font-black inline-flex items-center gap-1 mt-0.5
              ${twoFactorEnabled ? 'text-emerald-700 dark:text-emerald-300' : 'text-surface-500 dark:text-surface-400'}`}>
              <span className={`w-2 h-2 rounded-full ${twoFactorEnabled ? 'bg-emerald-500' : 'bg-surface-400'}`}></span>
              {twoFactorEnabled ? '2FA Enabled & Protected' : '2FA Currently Disabled'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggle2FA}
            disabled={twoFactorLoading}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm min-h-[40px]
              ${twoFactorEnabled 
                ? 'bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900' 
                : 'bg-brand-500 hover:bg-brand-600 text-white'}`}
          >
            {twoFactorLoading ? 'Updating...' : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>
      </div>

      {/* Profile Details Edit Form */}
      <div className="card p-4 sm:p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm rounded-3xl mb-5">
        <h3 className="font-black text-surface-900 dark:text-white text-sm mb-3 pb-2 border-b border-surface-100 dark:border-surface-800">
          Personal Information
        </h3>

        <form onSubmit={handleUpdate} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:border-brand-500 text-surface-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:border-brand-500 text-surface-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1">Change Password (Optional)</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:border-brand-500 text-surface-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 min-h-[48px] text-xs font-black shadow-md"
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Logout button */}
      <div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3.5 px-4 min-h-[48px] bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-2xl text-xs font-black transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out from Account
        </button>
      </div>
    </div>
  );
}
