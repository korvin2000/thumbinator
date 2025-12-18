import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ActiveFiltersBar from './components/ActiveFiltersBar';
import DetailPanel from './components/DetailPanel';
import FilterPanel from './components/FilterPanel';
import FooterBar from './components/FooterBar';
import Header from './components/Header';
import ImageGrid from './components/ImageGrid';
import Toolbar from './components/Toolbar';
import { ImageApiClient } from './api/imageApi';
import { FilterStateFactory } from './data/filterState';
import { activeResolutionLabels, formatDateTime } from './data/utils';
import type {
  ActiveFilter,
  ActiveFilterType,
  FilterOptions,
  FilterState,
  GalleryStats,
  ImageMetadata,
  SortOption
} from './types/gallery';

function App() {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [filters, setFilters] = useState<FilterState>(FilterStateFactory.create);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(FilterStateFactory.create);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [gridSize, setGridSize] = useState<number>(4);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
  const [detailPanelOpen, setDetailPanelOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [stats, setStats] = useState<GalleryStats>({ total: 0, filtered: 0 });
  const [catalog, setCatalog] = useState<FilterOptions>({ categories: [], tags: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const streamCleanupRef = useRef<(() => void) | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const entries: ActiveFilter[] = [];
    if (filters.search) entries.push({ type: 'search', label: `Search: "${filters.search}"` });
    if (filters.colorMode !== 'all') entries.push({ type: 'color', label: filters.colorMode === 'color' ? 'Color Only' : 'B&W Only' });
    if (filters.minResolution > 0) entries.push({ type: 'resolution', label: `Min: ${activeResolutionLabels[filters.minResolution]}` });
    if (filters.categories.size > 0) entries.push({ type: 'categories', label: `Categories: ${Array.from(filters.categories).join(', ')}` });
    if (filters.tags.size > 0) entries.push({ type: 'tags', label: `Tags: ${Array.from(filters.tags).join(', ')}` });
    if (filters.dateFrom || filters.dateTo) entries.push({ type: 'date', label: 'Date range active' });
    if (filters.aspectRatio !== 'all') entries.push({ type: 'aspect', label: `Ratio: ${filters.aspectRatio}` });
    return entries;
  }, [filters]);

  const toggleFilterPanel = useCallback(() => setFilterPanelOpen((previous) => !previous), []);

  const closeDetailPanel = useCallback(() => {
    setDetailPanelOpen(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setSelectedImage(null);
      closeTimerRef.current = null;
    }, 300);
  }, []);

  const openDetailPanel = useCallback(
    (image: ImageMetadata) => {
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
    },
    [closeDetailPanel, detailPanelOpen, selectedImage]
  );

  const resetFilters = useCallback(() => {
    const cleared = FilterStateFactory.create();
    setFilters(cleared);
    setPendingFilters(cleared);
  }, []);

  const removeFilter = useCallback((type: ActiveFilterType) => {
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
        setFilters((prev) => ({ ...prev, categories: new Set<string>() }));
        setPendingFilters((prev) => ({ ...prev, categories: new Set<string>() }));
        break;
      case 'tags':
        setFilters((prev) => ({ ...prev, tags: new Set<string>() }));
        setPendingFilters((prev) => ({ ...prev, tags: new Set<string>() }));
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
  }, []);

  const applyPendingFilters = useCallback(() => {
    setFilters(FilterStateFactory.clone(pendingFilters));
    setFilterPanelOpen(false);
  }, [pendingFilters]);

  const startStream = useCallback(() => {
    if (streamCleanupRef.current) streamCleanupRef.current();

    setImages([]);
    setStreamError(null);
    setLoading(true);
    setStats((prev) => ({ ...prev, filtered: 0 }));

    streamCleanupRef.current = ImageApiClient.openImageStream(filters, sortBy, {
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
      setPendingFilters(FilterStateFactory.clone(filters));
    }
  }, [filterPanelOpen, filters]);

  useEffect(() => {
    ImageApiClient.fetchFilterOptions()
      .then((options) => {
        setCatalog({ categories: options.categories ?? [], tags: options.tags ?? [] });
        setStats((prev) => ({ ...prev, total: options.totalImages ?? 0 }));
      })
      .catch(() => setStreamError('Unable to load filter options'));
  }, []);

  useEffect(() => {
    startStream();
    return () => {
      if (streamCleanupRef.current) streamCleanupRef.current();
    };
  }, [startStream]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

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
          formatDateTime={formatDateTime}
        />
      </main>

      <div
        className={`fixed inset-0 bg-black/35 transition-opacity ${overlayVisible ? 'opacity-100' : 'opacity-0'} ${overlayInteractive ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={() => {
          if (filterPanelOpen) setFilterPanelOpen(false);
        }}
      />
    </div>
  );
}

export default App;
