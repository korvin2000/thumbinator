import React from 'react';
import { debounce } from '../data/utils.js';

function Header({ filterPanelOpen, onToggleFilterPanel, stats, onSearch, searchValue }) {
  const handleSearch = debounce((value) => onSearch(value), 300);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-900/50">
          <i className="fas fa-images text-white text-xl" />
        </div>
        <div>
          <p className="text-sm text-slate-400">ImageVault Pro</p>
          <h1 className="text-2xl font-semibold text-white">Digital Gallery Manager</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 w-1/2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
            <i className="fas fa-search" />
          </span>
          <input
            defaultValue={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search images, tags, locations..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <button
          onClick={onToggleFilterPanel}
          className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
            filterPanelOpen ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-indigo-500'
          }`}
        >
          <i className="fas fa-filter mr-2" /> Filters
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 min-w-[220px]">
        <StatCard label="Total" value={stats.total} icon="fa-layer-group" accent="text-indigo-300" />
        <StatCard label="Filtered" value={stats.filtered} icon="fa-magic" accent="text-emerald-300" />
      </div>
    </header>
  );
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="px-4 py-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center ${accent}`}>
        <i className={`fas ${icon}`} />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-white stat-number">{value}</p>
      </div>
    </div>
  );
}

export default Header;
