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
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.whyItMatters.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 p-4 sm:p-6 animate-slide-up max-w-md sm:max-w-lg mx-auto sm:border-x sm:border-surface-200 dark:sm:border-surface-800 sm:shadow-xl pb-24 relative font-sans transition-colors duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-1.5 text-surface-600 dark:text-surface-400 font-bold text-xs hover:text-surface-900 dark:hover:text-white transition-colors bg-white dark:bg-surface-900 px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Home / Dashboard
        </Link>
        <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-wider">Reference Guide</span>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white tracking-tight">Fitness Glossary</h1>
        </div>
        <p className="text-surface-500 dark:text-surface-400 text-xs mt-1 leading-relaxed">
          Plain-language definitions and healthy benchmarks for every body composition metric recorded by the FitMao 3D scanner at KSYN Fitness.
        </p>
      </div>

      {/* Search Bar with touch padding */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          placeholder="Search metric (e.g. Visceral Fat, BMR, Muscle)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:border-brand-500 text-surface-900 dark:text-white shadow-sm"
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
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all border
              ${activeCategory === cat ? 'bg-brand-500 text-white border-brand-500 shadow-sm' : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800'}`}
          >
            {cat === 'all' ? 'All Terms' : cat}
          </button>
        ))}
      </div>

      {/* Terms List with colorful badges & benchmarks */}
      <div className="space-y-3.5">
        {filteredTerms.map((term) => {
          const badgeClass = CATEGORY_COLORS[term.category] || 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800';
          return (
            <div 
              key={term.id || term.term} 
              className="card p-4 sm:p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-brand-300 dark:hover:border-brand-600 transition-all shadow-sm rounded-3xl"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                  {term.category}
                </span>
              </div>

              <h3 className="font-black text-surface-900 dark:text-white text-base mb-1.5 tracking-tight">{term.term}</h3>
              
              <p className="text-xs text-surface-700 dark:text-surface-300 leading-relaxed mb-3">
                {term.definition}
              </p>

              <div className="bg-surface-50 dark:bg-surface-800/80 p-3 rounded-2xl border border-surface-200/80 dark:border-surface-700 text-[11px] text-surface-600 dark:text-surface-400 space-y-1.5">
                <div>
                  <strong className="text-surface-900 dark:text-white">Why it matters:</strong> {term.whyItMatters}
                </div>
                <div className="pt-1 border-t border-surface-200/60 dark:border-surface-700 flex items-center justify-between">
                  <span className="text-surface-500 dark:text-surface-400 font-semibold">Healthy Benchmark:</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-extrabold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    {term.healthyRange}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTerms.length === 0 && (
          <div className="text-center py-12 text-surface-400 text-xs">
            No terms found matching "{searchTerm}". Try searching for another keyword.
          </div>
        )}
      </div>
    </div>
  );
}
