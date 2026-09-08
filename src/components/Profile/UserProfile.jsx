import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, LogOut, Settings, Target, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api.js';
import { REFERENCE_MEMBER } from '../../data/memberExperience.js';

export default function UserProfile({ user, onUserUpdated, onLogout }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user?.firstName || REFERENCE_MEMBER.firstName,
    lastName: user?.lastName || REFERENCE_MEMBER.lastName,
    age: REFERENCE_MEMBER.age,
    biologicalSex: REFERENCE_MEMBER.biologicalSex,
    height: REFERENCE_MEMBER.height,
    gym: REFERENCE_MEMBER.gym
  });

  const updateField = (field, value) => setProfile((current) => ({ ...current, [field]: value }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await api.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName
      });
      if (onUserUpdated && response?.user) onUserUpdated(response.user);
    } catch {
      // The editable prototype remains usable while the API is offline.
    } finally {
      setSaving(false);
      setEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    }
  };

  const handleLogout = () => {
    api.logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const personalRows = [
    ['Full Name', fullName, 'name'],
    ['Age', profile.age, 'age'],
    ['Biological Sex', profile.biologicalSex, 'biologicalSex'],
    ['Height', profile.height, 'height'],
    ['Gym', profile.gym, 'gym'],
    ['Member Since', REFERENCE_MEMBER.memberSince, null]
  ];

  return (
    <main className="min-h-screen bg-surface-50 dark:bg-surface-950 px-4 sm:px-8 py-6 max-w-3xl mx-auto pb-28 animate-slide-up">
      <header className="flex items-center gap-4 mb-6">
        <span className="w-14 h-14 rounded-3xl bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center">
          <User className="w-6 h-6" />
        </span>
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold">{fullName}</h1>
          <p className="text-xs text-surface-500 dark:text-surface-400">{profile.gym}</p>
        </div>
      </header>

      {saved && (
        <div className="mb-4 rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/40 px-4 py-3 flex items-center gap-2 text-xs text-brand-800 dark:text-brand-200">
          <CheckCircle2 className="w-4 h-4" /> Profile changes saved.
        </div>
      )}

      <section className="grid grid-cols-3 gap-3 mb-5">
        {[
          ['2', 'Assessments', null],
          ['32.4', 'Muscle Mass', 'kg'],
          ['24.8%', 'Body Fat', null]
        ].map(([value, label, unit]) => (
          <div key={label} className="rounded-3xl border border-brand-100 dark:border-brand-900 bg-brand-50/70 dark:bg-brand-950/30 p-3 sm:p-4 text-center">
            <strong className="block text-xl sm:text-2xl font-mono text-brand-700 dark:text-brand-300">{value}</strong>
            {unit && <span className="block text-[9px] text-surface-500 dark:text-surface-400">{unit}</span>}
            <span className="mt-1 block text-[10px] sm:text-xs text-surface-500 dark:text-surface-400">{label}</span>
          </div>
        ))}
      </section>

      <section className="card bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl shadow-card mb-4">
        <div className="px-4 py-3.5 flex items-center justify-between border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider">
            <User className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Personal Info
          </div>
          <button
            type="button"
            onClick={() => editing ? saveProfile() : setEditing(true)}
            disabled={saving}
            className="text-xs font-display font-bold text-brand-700 dark:text-brand-300 disabled:opacity-60"
          >
            {saving ? 'Saving…' : editing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="px-4">
          {personalRows.map(([label, value, field]) => (
            <div key={label} className="min-h-[46px] py-3 flex items-center justify-between gap-4 border-b border-surface-100 dark:border-surface-800 last:border-b-0">
              <span className="text-xs text-surface-500 dark:text-surface-400">{label}</span>
              {editing && field ? (
                field === 'name' ? (
                  <div className="grid grid-cols-2 gap-2 max-w-[250px]">
                    <input value={profile.firstName} onChange={(event) => updateField('firstName', event.target.value)} className="input-field px-3 py-2 text-right" aria-label="First name" />
                    <input value={profile.lastName} onChange={(event) => updateField('lastName', event.target.value)} className="input-field px-3 py-2 text-right" aria-label="Last name" />
                  </div>
                ) : (
                  <input value={profile[field]} onChange={(event) => updateField(field, event.target.value)} className="input-field max-w-[250px] px-3 py-2 text-right" aria-label={label} />
                )
              ) : (
                <strong className="text-xs font-display text-right text-surface-900 dark:text-white">{value}</strong>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl shadow-card mb-4">
        <div className="px-4 py-3.5 flex items-center gap-2 border-b border-surface-200 dark:border-surface-800 text-xs font-display font-bold uppercase tracking-wider">
          <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Last Assessment Goals
        </div>
        <div className="px-4">
          {[
            ['Primary goal', REFERENCE_MEMBER.primaryGoal],
            ['Activity style', REFERENCE_MEMBER.activityStyle],
            ['Date', REFERENCE_MEMBER.lastAssessmentDate]
          ].map(([label, value]) => (
            <div key={label} className="py-3.5 flex items-center justify-between gap-4 border-b border-surface-100 dark:border-surface-800 last:border-b-0">
              <span className="text-xs text-surface-500 dark:text-surface-400">{label}</span>
              <strong className="text-xs font-display text-right">{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="card w-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl p-4 flex items-center gap-3 text-left"
      >
        <span className="w-10 h-10 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
          <Settings className="w-5 h-5 text-surface-600 dark:text-surface-300" />
        </span>
        <span className="flex-1">
          <strong className="block text-sm font-display">App Settings</strong>
          <span className="block text-xs text-surface-500 dark:text-surface-400">Theme, privacy, and account preferences</span>
        </span>
        <ChevronRight className="w-4 h-4 text-surface-400" />
      </button>

      <button type="button" onClick={handleLogout} className="mt-4 btn-outline text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 gap-2">
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </main>
  );
}
