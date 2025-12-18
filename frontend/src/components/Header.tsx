import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from '../data/utils';
import type { GalleryStats } from '../types/gallery';

interface HeaderProps {
  filterPanelOpen: boolean;
  onToggleFilterPanel: () => void;
  stats: GalleryStats;
  onSearch: (value: string) => void;
  searchValue: string;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onClearFilters: () => void;
}

const Header: React.FC<HeaderProps> = ({
  filterPanelOpen,
  onToggleFilterPanel,
  stats,
  onSearch,
  searchValue,
  hasActiveFilters,
  activeFilterCount,
  onClearFilters
}) => {
  const [query, setQuery] = useState(searchValue);
  const handleSearch = useMemo(() => debounce(onSearch, 300), [onSearch]);

  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue]);

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
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search images, tags, locations..."
            className="input-text pl-10 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilterPanel}
            className={`action-button ${
              filterPanelOpen
                ? 'action-button--primary'
                : hasActiveFilters
                  ? 'action-button--ghost'
                  : 'action-button--subtle'
            }`}
            aria-pressed={filterPanelOpen}
          >
            <i className="fas fa-filter" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-100 border border-indigo-400/50">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={onClearFilters}
            className={`action-button action-button--ghost px-3 ${!hasActiveFilters ? 'action-button--disabled' : ''}`}
            disabled={!hasActiveFilters}
          >
            <span className="flex items-center gap-2">
              <i className="fas fa-rotate-left" />
              <span>Clear</span>
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 min-w-[220px]">
        <StatCard label="Total" value={stats.total} icon="fa-layer-group" accent="text-indigo-300" />
        <StatCard label="Filtered" value={stats.filtered} icon="fa-magic" accent="text-emerald-300" />
      </div>
    </header>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  accent: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent }) => (
  <div className="stat-card">
    <div className={`stat-icon ${accent}`}>
      <i className={`fas ${icon}`} />
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-white stat-number">{value}</p>
    </div>
  </div>
);

export default Header;
