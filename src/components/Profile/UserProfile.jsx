import React, { useState } from 'react';
import { CheckCircle2, LogOut, User } from 'lucide-react';
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
    height: REFERENCE_MEMBER.height
  });

  const updateField = (field, value) => setProfile((current) => ({ ...current, [field]: value }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await api.updateProfile({ firstName: profile.firstName, lastName: profile.lastName });
      if (onUserUpdated && response?.user) onUserUpdated(response.user);
    } catch {
      // Keep the prototype usable when the API is offline.
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
    ['Member Since', REFERENCE_MEMBER.memberSince, null]
  ];

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 pb-32 pt-7 sm:px-8 sm:pt-10 animate-slide-up">
      <header className="mb-7 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-300 text-surface-950 shadow-subtle">
          <User className="h-6 w-6" />
        </span>
        <div>
          <p className="text-[10px] font-display font-bold uppercase tracking-[0.18em] text-surface-400">Profile</p>
          <h1 className="mt-1 text-2xl font-display font-black tracking-tight text-surface-950 dark:text-white sm:text-3xl">{fullName}</h1>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">Your FitStart account and assessment details</p>
        </div>
      </header>

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-brand-300/60 bg-brand-100 px-4 py-3 text-xs font-semibold text-surface-800 dark:bg-brand-300/10 dark:text-surface-100">
          <CheckCircle2 className="h-4 w-4" /> Profile changes saved.
        </div>
      )}

      <section className="mb-4 grid grid-cols-3 gap-3">
        {[
          ['2', 'Assessments', null],
          ['32.4', 'Muscle Mass', 'kg'],
          ['24.8%', 'Body Fat', null]
        ].map(([value, label, unit]) => (
          <div key={label} className="rounded-3xl border border-surface-200 bg-white p-3 text-center shadow-subtle dark:border-surface-800 dark:bg-surface-900 sm:p-4">
            <strong className="block text-xl font-mono text-surface-950 dark:text-white sm:text-2xl">{value}</strong>
            {unit && <span className="block text-[9px] text-surface-400">{unit}</span>}
            <span className="mt-1 block text-[10px] text-surface-500 dark:text-surface-400 sm:text-xs">{label}</span>
          </div>
        ))}
      </section>

      <section className="card mb-4">
        <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3.5 dark:border-surface-800">
          <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider">
            <User className="h-4 w-4 text-brand-500" /> Personal Info
          </div>
          <button type="button" onClick={() => editing ? saveProfile() : setEditing(true)} disabled={saving} className="text-xs font-display font-black text-surface-950 disabled:opacity-60 dark:text-brand-300">
            {saving ? 'Saving…' : editing ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="px-4">
          {personalRows.map(([label, value, field]) => (
            <div key={label} className="flex min-h-[48px] items-center justify-between gap-4 border-b border-surface-100 py-3 last:border-b-0 dark:border-surface-800">
              <span className="text-xs text-surface-500 dark:text-surface-400">{label}</span>
              {editing && field ? (
                field === 'name' ? (
                  <div className="grid max-w-[260px] grid-cols-2 gap-2">
                    <input value={profile.firstName} onChange={(e) => updateField('firstName', e.target.value)} className="input-field px-3 py-2 text-right" aria-label="First name" />
                    <input value={profile.lastName} onChange={(e) => updateField('lastName', e.target.value)} className="input-field px-3 py-2 text-right" aria-label="Last name" />
                  </div>
                ) : (
                  <input value={profile[field]} onChange={(e) => updateField(field, e.target.value)} className="input-field max-w-[250px] px-3 py-2 text-right" aria-label={label} />
                )
              ) : (
                <strong className="text-right text-xs font-display text-surface-950 dark:text-white">{value}</strong>
              )}
            </div>
          ))}
        </div>
      </section>


      <button type="button" onClick={handleLogout} className="btn-outline mt-4 gap-2 border-red-200 text-red-600 dark:border-red-900 dark:text-red-400">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </main>
  );
}
