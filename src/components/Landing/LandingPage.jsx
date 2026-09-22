import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Droplets,
  Dumbbell,
  LogIn,
  MessageCircleQuestion,
  QrCode,
  ShieldCheck,
  Target,
  UserRound
} from 'lucide-react';
import FitStartLogo from '../FitStartLogo.jsx';


const benefits = [
  {
    icon: Target,
    title: 'Personalized',
    description: 'Built around your FitMao assessment and fitness goals.'
  },
  {
    icon: BarChart3,
    title: 'Explainable',
    description: 'See what was prioritized and why it matters.'
  },
  {
    icon: UserRound,
    title: 'Guest-friendly',
    description: 'Complete the assessment before creating an account.'
  }
];

const steps = [
  {
    icon: QrCode,
    title: 'Scan the QR Code',
    description: 'FitStart reads the FitMao assessment. For this prototype, the sample scan is already prepared.'
  },
  {
    icon: MessageCircleQuestion,
    title: 'Complete Your Assessment',
    description: 'Complete the guided assessment and add your goals and fitness context.'
  },
  {
    icon: Target,
    title: 'Get Clear Priorities & Interpreted Results',
    description: 'See your Main Focus, Top Priorities, and why they were selected.'
  }
];

const metrics = [
  { icon: Droplets, label: 'Body Fat', value: '24.8%', width: '58%' },
  { icon: Dumbbell, label: 'Muscle Mass', value: '56.3 kg', width: '62%' },
  { icon: ShieldCheck, label: 'Lifestyle', value: 'Moderate', width: '60%' }
];

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#contact') {
      requestAnimationFrame(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090b] text-white transition-colors duration-200">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[720px] overflow-hidden">
        <div className="absolute left-[14%] top-16 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/10" />
        <div className="absolute right-[12%] top-20 h-80 w-80 rounded-full bg-brand-300/10 blur-3xl dark:bg-brand-300/10" />
      </div>

      <section className="relative mx-auto grid max-w-5xl gap-10 px-4 pb-10 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:gap-14 lg:pb-14 lg:pt-20">
        <div className="animate-slide-up">
          <FitStartLogo className="mb-8" />
          <p className="mb-4 text-[11px] font-display font-bold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
            Personalized fitness guidance
          </p>
          <h1 className="max-w-2xl text-4xl font-display font-extrabold leading-[1.04] tracking-tight text-surface-950 dark:text-white sm:text-5xl">
            Understand your body.
            <span className="mt-2 block text-brand-300">
              Know where to start.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-surface-600 dark:text-surface-300 sm:text-base">
            FitStart turns your FitMao assessment into a clear starting point so you can understand which measurements deserve attention first.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/assessment"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-brand-300 px-6 text-sm font-display font-bold text-surface-950 shadow-lg shadow-brand-900/10 transition-all hover:bg-brand-200 hover:shadow-xl active:scale-[0.98]"
            >
              Start Your Assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-surface-300 bg-white/70 px-6 text-sm font-display font-bold text-surface-800 shadow-subtle backdrop-blur transition-all hover:bg-white active:scale-[0.98] dark:border-surface-700 dark:bg-surface-900/70 dark:text-white dark:hover:bg-surface-900"
            >
              <LogIn className="h-4 w-4 text-brand-600 dark:text-brand-400" /> Login
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-surface-500 dark:text-surface-400">
            <Clock3 className="h-4 w-4" />
            <span>3–5 minutes</span>
            <span aria-hidden="true">•</span>
            <span>No account required</span>
          </div>
        </div>

        <div className="relative animate-slide-up lg:pl-2">
          <div className="absolute -inset-8 rounded-full bg-brand-500/10 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[28px] border border-brand-200 bg-white/90 p-5 shadow-card backdrop-blur-xl dark:border-brand-700/70 dark:bg-surface-900/90 dark:shadow-card-dark sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[9px] font-display font-bold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950/70 dark:text-brand-300">
                  Sample result
                </span>
                <h2 className="mt-4 text-lg font-display font-extrabold text-surface-950 dark:text-white">Your Starting Focus</h2>
              </div>
              <span className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-right text-[10px] font-display font-bold leading-tight text-brand-700 dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
                Stronger<br />You Ahead
              </span>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <strong className="block text-lg font-display font-extrabold text-brand-600 dark:text-brand-400">
                  Improve body composition
                </strong>
                <p className="mt-1 text-xs leading-relaxed text-surface-500 dark:text-surface-400">
                  Based on your measurements, goals, and daily habits
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2 text-xs font-display font-bold text-surface-800 transition-colors hover:bg-brand-50 dark:border-brand-800 dark:text-surface-100 dark:hover:bg-brand-950/40"
            >
              Why this focus? <ArrowRight className="h-3.5 w-3.5 text-brand-500" />
            </button>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {metrics.map(({ icon: Icon, label, value, width }) => (
                <div key={label} className="rounded-2xl border border-surface-200 bg-surface-50/80 p-3 dark:border-surface-700/80 dark:bg-surface-850/80">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate text-[10px] text-surface-500 dark:text-surface-400">{label}</span>
                      <strong className="block truncate text-xs font-display text-surface-900 dark:text-white">{value}</strong>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
                    <span className="block h-full rounded-full bg-brand-300" style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl px-4 py-4 sm:px-8">
        <div className="grid gap-3 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article key={title} className="flex items-center gap-4 rounded-3xl border border-surface-200 bg-white/80 p-5 shadow-subtle backdrop-blur dark:border-surface-800 dark:bg-surface-900/80">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-sm font-display font-extrabold text-surface-900 dark:text-white">{title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-surface-500 dark:text-surface-400">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="relative mx-auto max-w-5xl px-4 py-16 sm:px-8">
        <div className="mb-8">
          <span className="mb-4 block h-1 w-10 rounded-full bg-brand-500" />
          <h2 className="text-2xl font-display font-extrabold text-surface-950 dark:text-white sm:text-3xl">How FitStart works</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <article key={title} className="relative rounded-3xl border border-surface-200 bg-white p-5 shadow-subtle dark:border-surface-800 dark:bg-surface-900">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-500 text-xs font-display font-extrabold text-brand-700 dark:text-brand-300">
                  {index + 1}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-5 text-sm font-display font-extrabold text-surface-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-surface-500 dark:text-surface-400">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-2xl border border-brand-100 bg-brand-50/70 px-4 py-3 text-xs leading-relaxed text-surface-600 dark:border-brand-900 dark:bg-brand-950/30 dark:text-surface-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
          <p>The scan and upload actions are prototype placeholders. Either option reads the prepared assessment before continuing through the assessment flow.</p>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 border-y border-surface-200 bg-white/60 dark:border-surface-800 dark:bg-surface-900/40">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-display font-bold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Contact us</p>
            <h2 className="mt-2 text-xl font-display font-extrabold text-surface-950 dark:text-white">Need help before you begin?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-500 dark:text-surface-400">
              Ask your fitness professional for assistance with your FitMao assessment or report.
            </p>
          </div>
          <Link to="/assessment" className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-300 px-5 text-sm font-display font-bold text-surface-950 transition-colors hover:bg-brand-200">
            Start Assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-4 py-8 text-center text-[11px] leading-relaxed text-surface-500 dark:text-surface-400 sm:px-8">
        FitStart is an educational, non-clinical decision-support tool. Consult a qualified professional for exercise, nutrition, or medical guidance.
      </footer>
    </main>
  );
}
