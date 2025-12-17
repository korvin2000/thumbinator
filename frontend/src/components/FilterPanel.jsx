import React from 'react';
import { resolutionLabels } from '../data/utils.js';

function FilterPanel({ isOpen, onClose, filters, onFiltersChange, onApplyFilters, onClearAll, categories, tags }) {
  const updateFilter = (key, value) => onFiltersChange((prev) => ({ ...prev, [key]: value }));

  const toggleCategory = (category) => {
    onFiltersChange((prev) => {
      const next = new Set(prev.categories);
      next.has(category) ? next.delete(category) : next.add(category);
      return { ...prev, categories: next };
    });
  };

  const toggleTag = (tag) => {
    onFiltersChange((prev) => {
      const next = new Set(prev.tags);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return { ...prev, tags: next };
    });
  };

  return (
    <aside className={`slide-panel fixed right-0 top-0 h-full w-80 lg:w-96 bg-slate-900/90 backdrop-blur-md border-l border-slate-700/50 z-40 overflow-y-auto ${isOpen ? 'open' : ''}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            <i className="fas fa-filter mr-2 text-indigo-400" />Filters & Search
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <i className="fas fa-times text-slate-400" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <i className="fas fa-search mr-2 text-slate-400" />Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search by name, description..."
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            <i className="fas fa-palette mr-2 text-slate-400" />Color Mode
          </label>
          <div className="flex gap-2">
            {['all', 'color', 'bw'].map((mode) => (
              <button
                key={mode}
                data-color={mode}
                onClick={() => updateFilter('colorMode', mode)}
                className={`color-filter-btn flex-1 px-4 py-2.5 rounded-xl transition-all ${
                  filters.colorMode === mode ? 'bg-indigo-600 border border-indigo-500 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300'
                }`}
              >
                {mode === 'all' && 'All'}
                {mode === 'color' && <><i className="fas fa-circle text-xs mr-1" />Color</>}
                {mode === 'bw' && <><i className="fas fa-adjust mr-1" />B&W</>}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            <i className="fas fa-expand mr-2 text-slate-400" />Minimum Resolution
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="4"
              value={filters.minResolution}
              onChange={(e) => updateFilter('minResolution', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Any</span>
              <span>HD</span>
              <span>FHD</span>
              <span>4K</span>
              <span>8K</span>
            </div>
            <p className="text-sm text-indigo-400">{resolutionLabels[filters.minResolution]}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            <i className="fas fa-weight-hanging mr-2 text-slate-400" />File Size Range
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={filters.minSize ?? ''}
              onChange={(e) => updateFilter('minSize', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Min MB"
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
            />
            <span className="text-slate-500">to</span>
            <input
              type="number"
              value={filters.maxSize ?? ''}
              onChange={(e) => updateFilter('maxSize', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Max MB"
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            <i className="fas fa-shapes mr-2 text-slate-400" />Categories
          </label>
          <div className="space-y-2" id="categoryFilters">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={filters.categories.has(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            <i className="fas fa-hashtag mr-2 text-slate-400" />Tags
          </label>
          <div className="flex flex-wrap gap-2" id="tagFilters">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`tag-pill ${filters.tags.has(tag) ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            <i className="fas fa-calendar-alt mr-2 text-slate-400" />Date Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value || null)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
            />
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value || null)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            <i className="fas fa-vector-square mr-2 text-slate-400" />Aspect Ratio
          </label>
          <select
            value={filters.aspectRatio}
            onChange={(e) => updateFilter('aspectRatio', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200"
          >
            <option value="all">Any</option>
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
            <option value="1:1">1:1</option>
            <option value="3:2">3:2</option>
            <option value="21:9">21:9</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <button onClick={onApplyFilters} className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors">
            <i className="fas fa-check mr-2" />Apply Filters
          </button>
          <button onClick={onClearAll} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
            <i className="fas fa-undo" />
          </button>
        </div>

      </div>
    </aside>
  );
}

export default FilterPanel;
