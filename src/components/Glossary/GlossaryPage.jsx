import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ChevronLeft, BookOpen, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../utils/api.js';
import { GLOSSARY_TERMS } from '../../data/glossary.js';

const CATEGORY_COLORS = {
  'Body Composition': 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  'Muscle & Strength': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'Cardiovascular & Internal Health': 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  'Hydration & Recovery': 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  'Energy & Metabolism': 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
};

export default function GlossaryPage() {
  const [terms, setTerms] = useState(GLOSSARY_TERMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function loadGlossary() {
      try {
        const res = await api.getGlossary();
        if (res.glossary && res.glossary.length > 0) {
          setTerms(res.glossary);
        }
      } catch (err) {
        console.warn('Using local glossary dataset:', err.message);
      }
    }
    loadGlossary();
  }, []);

  const categories = ['all', 'Body Composition', 'Muscle & Strength', 'Cardiovascular & Internal Health', 'Hydration & Recovery', 'Energy & Metabolism'];

  const filteredTerms = terms.filter(item => {
    const termStr = item.term || '';
    const defStr = item.definition || '';
    const whyStr = item.whyItMatters || item.why_it_matters || '';
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = termStr.toLowerCase().includes(searchLower) || 
                          defStr.toLowerCase().includes(searchLower) ||
                          whyStr.toLowerCase().includes(searchLower);
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 p-4 sm:p-6 lg:p-8 animate-slide-up max-w-5xl mx-auto pb-28 relative font-sans transition-colors duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-1.5 text-surface-600 dark:text-surface-400 font-bold text-xs hover:text-surface-900 dark:hover:text-white transition-colors bg-white dark:bg-surface-900 px-3.5 py-2 rounded-xl border border-surface-200 dark:border-surface-800 shadow-subtle"
        >
          <ChevronLeft className="w-4 h-4" /> Home / Dashboard
        </Link>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 text-[11px] font-display font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
          Reference Guide
        </span>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-10 h-10 rounded-2xl bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold shadow-subtle border border-brand-200 dark:border-brand-800">
            <BookOpen className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
            Fitness Glossary
          </h1>
        </div>
        <p className="text-surface-500 dark:text-surface-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Plain-language definitions and healthy benchmarks for every body composition metric recorded by the FitMao 3D scanner at KSYN Fitness.
        </p>
      </div>

      {/* Search Bar with touch padding */}
      <div className="relative mb-5 max-w-2xl">
        <Search className="w-4 h-4 text-surface-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          placeholder="Search metric (e.g. Visceral Fat, BMR, Muscle)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-10 py-3.5 text-xs sm:text-sm rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:border-brand-500 text-surface-900 dark:text-white shadow-subtle transition-all"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')} 
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills with horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-6 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-display font-extrabold px-4 py-2 rounded-xl whitespace-nowrap transition-all border cursor-pointer
              ${activeCategory === cat ? 'bg-brand-500 text-white border-brand-500 shadow-subtle' : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800'}`}
          >
            {cat === 'all' ? 'All Terms' : cat}
          </button>
        ))}
      </div>

      {/* Terms List with colorful badges & benchmarks (Responsive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((term) => {
          const badgeClass = CATEGORY_COLORS[term.category] || 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800';
          return (
            <div 
              key={term.id || term.term} 
              className="card p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-brand-300 dark:hover:border-brand-600 transition-all shadow-card rounded-3xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2.5">
                  <span className={`text-[10px] font-display font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${badgeClass}`}>
                    {term.category}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-surface-900 dark:text-white text-base sm:text-lg mb-1.5 tracking-tight">{term.term}</h3>
                
                <p className="text-xs sm:text-sm text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
                  {term.definition}
                </p>
              </div>

              <div className="bg-surface-50 dark:bg-surface-800/80 p-3.5 rounded-2xl border border-surface-200/80 dark:border-surface-700 text-xs text-surface-600 dark:text-surface-400 space-y-2">
                <div>
                  <strong className="text-surface-900 dark:text-white font-display">Why it matters:</strong> {term.whyItMatters}
                </div>
                <div className="pt-2 border-t border-surface-200/60 dark:border-surface-700 flex items-center justify-between">
                  <span className="text-surface-500 dark:text-surface-400 font-display font-bold text-[11px]">Healthy Benchmark:</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    {term.healthyRange}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTerms.length === 0 && (
          <div className="col-span-full text-center py-16 text-surface-400 text-xs sm:text-sm">
            No terms found matching "{searchTerm}". Try searching for another keyword.
          </div>
        )}
      </div>
    </div>
  );
}
