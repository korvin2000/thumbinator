import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ActiveFiltersBar from './components/ActiveFiltersBar.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import FooterBar from './components/FooterBar.jsx';
import Header from './components/Header.jsx';
import ImageGrid from './components/ImageGrid.jsx';
import Toolbar from './components/Toolbar.jsx';
import { fetchFilterOptions, openImageStream } from './api/imageApi.js';
import { activeResolutionLabels, formatDate, formatDateTime } from './data/utils.js';

const baseFilters = {
  search: '',
  colorMode: 'all',
  minResolution: 0,
  minSize: null,
  maxSize: null,
  dateFrom: null,
  dateTo: null,
  aspectRatio: 'all'
};

const createFilterState = () => ({
  ...baseFilters,
  categories: new Set(),
  tags: new Set()
});

function App() {
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(createFilterState);
  const [pendingFilters, setPendingFilters] = useState(createFilterState);
  const [sortBy, setSortBy] = useState('newest');
  const [gridSize, setGridSize] = useState(4);
  const [view, setView] = useState('grid');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [stats, setStats] = useState({ total: 0, filtered: 0 });
  const [catalog, setCatalog] = useState({ categories: [], tags: [] });
  const [loading, setLoading] = useState(true);
  const [streamError, setStreamError] = useState(null);
  const streamCleanupRef = useRef(null);
  const closeTimerRef = useRef(null);

  const activeFilters = useMemo(() => {
    const entries = [];
    if (filters.search) entries.push({ type: 'search', label: `Search: "${filters.search}"` });
    if (filters.colorMode !== 'all') entries.push({ type: 'color', label: filters.colorMode === 'color' ? 'Color Only' : 'B&W Only' });
    if (filters.minResolution > 0) entries.push({ type: 'resolution', label: `Min: ${activeResolutionLabels[filters.minResolution]}` });
    if (filters.categories.size > 0) entries.push({ type: 'categories', label: `Categories: ${[...filters.categories].join(', ')}` });
    if (filters.tags.size > 0) entries.push({ type: 'tags', label: `Tags: ${[...filters.tags].join(', ')}` });
    if (filters.dateFrom || filters.dateTo) entries.push({ type: 'date', label: 'Date range active' });
    if (filters.aspectRatio !== 'all') entries.push({ type: 'aspect', label: `Ratio: ${filters.aspectRatio}` });
    return entries;
  }, [filters]);

  const toggleFilterPanel = () => setFilterPanelOpen((prev) => !prev);
  const closeDetailPanel = () => {
    setDetailPanelOpen(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setSelectedImage(null);
      closeTimerRef.current = null;
    }, 300);
  };

  const openDetailPanel = (image) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    const isSameImage = selectedImage?.id === image.id;

    if (isSameImage) {
      if (detailPanelOpen) {
        closeDetailPanel();
        return;
      }

      setDetailPanelOpen(true);
      return;
    }

    setSelectedImage(image);
    setDetailPanelOpen(true);
  };

  const resetFilters = () => {
    const cleared = createFilterState();
    setFilters(cleared);
    setPendingFilters(cleared);
  };

  const removeFilter = (type) => {
    switch (type) {
      case 'search':
        setFilters((prev) => ({ ...prev, search: '' }));
        setPendingFilters((prev) => ({ ...prev, search: '' }));
        break;
      case 'color':
        setFilters((prev) => ({ ...prev, colorMode: 'all' }));
        setPendingFilters((prev) => ({ ...prev, colorMode: 'all' }));
        break;
      case 'resolution':
        setFilters((prev) => ({ ...prev, minResolution: 0 }));
        setPendingFilters((prev) => ({ ...prev, minResolution: 0 }));
        break;
      case 'categories':
        setFilters((prev) => ({ ...prev, categories: new Set() }));
        setPendingFilters((prev) => ({ ...prev, categories: new Set() }));
        break;
      case 'tags':
        setFilters((prev) => ({ ...prev, tags: new Set() }));
        setPendingFilters((prev) => ({ ...prev, tags: new Set() }));
        break;
      case 'date':
        setFilters((prev) => ({ ...prev, dateFrom: null, dateTo: null }));
        setPendingFilters((prev) => ({ ...prev, dateFrom: null, dateTo: null }));
        break;
      case 'aspect':
        setFilters((prev) => ({ ...prev, aspectRatio: 'all' }));
        setPendingFilters((prev) => ({ ...prev, aspectRatio: 'all' }));
        break;
      default:
        break;
    }
  };

  const applyPendingFilters = () => {
    setFilters({
      ...pendingFilters,
      categories: new Set(pendingFilters.categories),
      tags: new Set(pendingFilters.tags)
    });
    setFilterPanelOpen(false);
  };

  const startStream = useCallback(() => {
    if (streamCleanupRef.current) streamCleanupRef.current();

    setImages([]);
    setStreamError(null);
    setLoading(true);
    setStats((prev) => ({ ...prev, filtered: 0 }));

    streamCleanupRef.current = openImageStream(filters, sortBy, {
      onImage: (image) => {
        setImages((prev) => {
          const next = [...prev, image];
          setStats((current) => ({ ...current, filtered: next.length }));
          return next;
        });
      },
      onComplete: (summary) => {
        setStats({ total: summary.total, filtered: summary.filtered });
        setLoading(false);
        streamCleanupRef.current = null;
      },
      onError: () => {
        setStreamError('Failed to stream images. Please try again.');
        setLoading(false);
        streamCleanupRef.current = null;
      }
    });
  }, [filters, sortBy]);

  useEffect(() => {
    if (filterPanelOpen) {
      setPendingFilters({ ...filters, categories: new Set(filters.categories), tags: new Set(filters.tags) });
    }
  }, [filterPanelOpen, filters]);

  useEffect(() => {
    fetchFilterOptions()
      .then((options) => {
        setCatalog({ categories: Array.from(options.categories || []), tags: Array.from(options.tags || []) });
        setStats((prev) => ({ ...prev, total: options.totalImages || 0 }));
      })
      .catch(() => setStreamError('Unable to load filter options'));
  }, []);

  useEffect(() => {
    startStream();
    return () => {
      if (streamCleanupRef.current) streamCleanupRef.current();
    };
  }, [startStream]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    []
  );

  useEffect(() => {
    const updateGrid = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setGridSize(2);
      } else if (width < 1024) {
        setGridSize(3);
      } else {
        setGridSize(4);
      }
    };

    updateGrid();
    const handler = () => updateGrid();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const overlayVisible = filterPanelOpen || detailPanelOpen;
  const overlayInteractive = filterPanelOpen;
  const activeFilterCount = activeFilters.length;
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="min-h-screen text-slate-200">
      <Header
        filterPanelOpen={filterPanelOpen}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
        onToggleFilterPanel={toggleFilterPanel}
        onClearFilters={resetFilters}
        stats={stats}
        onSearch={(value) => setFilters((prev) => ({ ...prev, search: value }))}
        searchValue={filters.search}
      />

      <main className="flex h-[calc(100vh-96px)]">
        <section className="flex-1 flex flex-col">
          <Toolbar
            gridSize={gridSize}
            onGridSizeChange={setGridSize}
            onSortChange={setSortBy}
            sortBy={sortBy}
            view={view}
            onViewChange={setView}
          />

          <ActiveFiltersBar activeFilters={activeFilters} onClear={resetFilters} onRemove={removeFilter} />

          <ImageGrid
            images={images}
            gridSize={gridSize}
            onOpenDetail={openDetailPanel}
            loading={loading}
            error={streamError}
            view={view}
          />

          <FooterBar total={stats.total} filtered={stats.filtered} />
        </section>

        <FilterPanel
          isOpen={filterPanelOpen}
          onClose={toggleFilterPanel}
          filters={pendingFilters}
          onFiltersChange={setPendingFilters}
          onApply={applyPendingFilters}
          onReset={resetFilters}
          categories={catalog.categories}
          tags={catalog.tags}
        />

        <DetailPanel
          isOpen={detailPanelOpen}
          image={selectedImage}
          onClose={closeDetailPanel}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
        />
      </main>

      <div
        className={`fixed inset-0 bg-black/35 transition-opacity ${
          overlayVisible ? 'opacity-100' : 'opacity-0'
        } ${overlayInteractive ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={() => {
          if (filterPanelOpen) setFilterPanelOpen(false);
        }}
      />
    </div>
  );
}

export default App;
