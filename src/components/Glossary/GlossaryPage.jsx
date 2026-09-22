import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Search, X } from 'lucide-react';
import { GLOSSARY_TERMS } from '../../data/glossary.js';

export default function GlossaryPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [openTerm, setOpenTerm] = useState(() => {
    const requestedTerm = searchParams.get('term');
    return GLOSSARY_TERMS.some((item) => item.id === requestedTerm) ? requestedTerm : null;
  });

  const filteredTerms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter((item) =>
      [item.term, item.shortLabel, item.definition, item.whyItMatters]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [searchTerm]);

  return (
    <main className="min-h-screen bg-surface-50 dark:bg-surface-950 px-4 sm:px-8 py-6 max-w-3xl mx-auto pb-28 animate-slide-up">
      <header className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-surface-900 dark:text-white">FitMao Glossary</h1>
        <p className="mt-1 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
          Plain-language explanations of every metric in your FitMao report.
        </p>
      </header>

      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search metrics..."
          className="input-field pl-11 pr-11 py-3.5"
        />
        {searchTerm && (
          <button type="button" onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-surface-400 hover:text-surface-700" aria-label="Clear search">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <section className="space-y-2">
        {filteredTerms.map((term) => {
          const isOpen = openTerm === term.id;
          return (
            <article key={term.id} className="card bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-subtle">
              <button
                type="button"
                onClick={() => setOpenTerm(isOpen ? null : term.id)}
                className="w-full px-4 py-4 flex items-center justify-between gap-3 text-left"
                aria-expanded={isOpen}
              >
                <strong className="text-sm font-display text-surface-900 dark:text-white">{term.term}</strong>
                <ChevronDown className={`w-4 h-4 shrink-0 text-surface-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-surface-100 dark:border-surface-800 animate-fade-in">
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-surface-700 dark:text-surface-300">{term.definition}</p>
                  <div className="mt-3 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 p-3 text-xs leading-relaxed text-surface-600 dark:text-surface-300">
                    <strong className="font-display text-surface-900 dark:text-white">Why it matters:</strong> {term.whyItMatters}
                  </div>
                  <p className="mt-3 text-[11px] text-surface-500 dark:text-surface-400">
                    <strong className="font-display text-brand-700 dark:text-brand-300">Reference:</strong> {term.healthyRange}
                  </p>
                </div>
              )}
            </article>
          );
        })}

        {filteredTerms.length === 0 && (
          <div className="py-12 text-center text-sm text-surface-500 dark:text-surface-400">
            No FitMao metrics match “{searchTerm}”.
          </div>
        )}
      </section>

      <p className="mt-6 text-center text-[10px] text-surface-400">
        Definitions are based on standard FitMao report terminology and are for education only.
      </p>
    </main>
  );
}
