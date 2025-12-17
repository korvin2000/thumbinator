import React from 'react';

function Toolbar({ gridSize, onGridSizeChange, onSortChange, sortBy, view, onViewChange, onSelectAll, onClearSelection, selectedCount }) {
  return (
    <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center gap-4">
      <div className="flex items-center gap-2 bg-slate-800/70 border border-slate-700 rounded-lg p-1">
        <button
          className={`px-4 py-2 rounded-md text-sm transition-colors ${view === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          onClick={() => onViewChange('grid')}
        >
          <i className="fas fa-border-all mr-2" /> Grid
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm transition-colors ${view === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          onClick={() => onViewChange('list')}
        >
          <i className="fas fa-list mr-2" /> List
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-400">Grid</label>
        <input
          type="range"
          min="2"
          max="6"
          value={gridSize}
          onChange={(e) => onGridSizeChange(Number(e.target.value))}
          className="w-32"
        />
        <span className="text-sm text-slate-300">{gridSize} cols</span>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-400">Sort</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="largest">Largest</option>
          <option value="smallest">Smallest</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="resolution">Resolution</option>
        </select>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onSelectAll}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium"
        >
          <i className="fas fa-check-double mr-2" />Select all
        </button>
        <button
          onClick={onClearSelection}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-200"
        >
          Clear ({selectedCount})
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
