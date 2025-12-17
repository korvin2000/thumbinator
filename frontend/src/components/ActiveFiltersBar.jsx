import React from 'react';

function ActiveFiltersBar({ activeFilters, onClear, onRemove }) {
  if (!activeFilters.length) return null;

  return (
    <div className="px-6 py-2 bg-indigo-900/20 border-b border-indigo-500/20 flex items-center gap-2 flex-wrap">
      <span className="text-sm text-indigo-300"><i className="fas fa-filter mr-1" />Active filters:</span>
      <div className="flex items-center gap-2 flex-wrap">
        {activeFilters.map((filter) => (
          <span key={filter.type} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 rounded-full text-xs text-indigo-200">
            {filter.label}
            <button onClick={() => onRemove(filter.type)} className="ml-1 hover:text-white">
              <i className="fas fa-times" />
            </button>
          </span>
        ))}
      </div>
      <button onClick={onClear} className="ml-auto text-sm text-indigo-400 hover:text-indigo-300">Clear all filters</button>
    </div>
  );
}

export default ActiveFiltersBar;
