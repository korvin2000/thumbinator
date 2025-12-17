import React, { useEffect, useMemo, useState } from 'react';
import ActiveFiltersBar from './components/ActiveFiltersBar.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import FooterBar from './components/FooterBar.jsx';
import Header from './components/Header.jsx';
import ImageGrid from './components/ImageGrid.jsx';
import Toolbar from './components/Toolbar.jsx';
import { allTags, categories, generateMockImages } from './data/mockData.js';
import { activeResolutionLabels, formatDate, formatDateTime, resolutionThresholds } from './data/utils.js';

const initialFilters = {
  search: '',
  colorMode: 'all',
  minResolution: 0,
  minSize: null,
  maxSize: null,
  categories: new Set(),
  tags: new Set(),
  dateFrom: null,
  dateTo: null,
  aspectRatio: 'all'
};

function App() {
  const [images] = useState(() => generateMockImages(60));
  const [filters, setFilters] = useState(() => ({ ...initialFilters, categories: new Set(), tags: new Set() }));
  const [pendingFilters, setPendingFilters] = useState(() => ({ ...initialFilters, categories: new Set(), tags: new Set() }));
  const [sortBy, setSortBy] = useState('newest');
  const [gridSize, setGridSize] = useState(4);
  const [view, setView] = useState('grid');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = useMemo(() => {
    let list = [...images];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      list = list.filter((img) =>
        img.name.toLowerCase().includes(searchLower) ||
        img.description.toLowerCase().includes(searchLower) ||
        img.category.toLowerCase().includes(searchLower) ||
        img.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        img.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters.colorMode === 'color') {
      list = list.filter((img) => img.isColor);
    } else if (filters.colorMode === 'bw') {
      list = list.filter((img) => !img.isColor);
    }

    if (filters.minResolution > 0) {
      const minPixels = resolutionThresholds[filters.minResolution];
      list = list.filter((img) => img.width * img.height >= minPixels);
    }

    if (filters.minSize !== null) list = list.filter((img) => img.fileSize >= filters.minSize);
    if (filters.maxSize !== null) list = list.filter((img) => img.fileSize <= filters.maxSize);

    if (filters.categories.size > 0) {
      list = list.filter((img) => filters.categories.has(img.category));
    }

    if (filters.tags.size > 0) {
      list = list.filter((img) => [...filters.tags].some((tag) => img.tags.includes(tag)));
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      list = list.filter((img) => img.dateCreated >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59);
      list = list.filter((img) => img.dateCreated <= toDate);
    }

    if (filters.aspectRatio !== 'all') {
      const ratios = { '16:9': 16 / 9, '4:3': 4 / 3, '1:1': 1, '3:2': 3 / 2, '21:9': 21 / 9 };
      const targetRatio = ratios[filters.aspectRatio];
      list = list.filter((img) => {
        const imgRatio = img.width / img.height;
        return Math.abs(imgRatio - targetRatio) < 0.1;
      });
    }

    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => b.dateCreated - a.dateCreated);
        break;
      case 'oldest':
        list.sort((a, b) => a.dateCreated - b.dateCreated);
        break;
      case 'largest':
        list.sort((a, b) => b.fileSize - a.fileSize);
        break;
      case 'smallest':
        list.sort((a, b) => a.fileSize - b.fileSize);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'resolution':
        list.sort((a, b) => b.width * b.height - a.width * a.height);
        break;
      default:
        break;
    }

    return list;
  }, [filters, images, sortBy]);

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
    setSelectedImage(null);
  };

  const openDetailPanel = (image) => {
    setSelectedImage(image);
    setDetailPanelOpen(true);
  };

  const applyFilters = () => {
    setFilters({
      ...pendingFilters,
      categories: new Set(pendingFilters.categories),
      tags: new Set(pendingFilters.tags)
    });
    setFilterPanelOpen(false);
  };

  const resetFilters = () => {
    const next = { ...initialFilters, categories: new Set(), tags: new Set() };
    setFilters(next);
    setPendingFilters(next);
  };

  const removeFilter = (type) => {
    const updates = {
      search: { search: '' },
      color: { colorMode: 'all' },
      resolution: { minResolution: 0 },
      categories: { categories: new Set() },
      tags: { tags: new Set() },
      date: { dateFrom: null, dateTo: null },
      aspect: { aspectRatio: 'all' }
    };

    if (updates[type]) {
      setFilters((prev) => ({ ...prev, ...updates[type] }));
      setPendingFilters((prev) => ({ ...prev, ...updates[type] }));
    }
  };

  useEffect(() => {
    if (filterPanelOpen) {
      setPendingFilters({
        ...filters,
        categories: new Set(filters.categories),
        tags: new Set(filters.tags)
      });
    }
  }, [filterPanelOpen, filters]);

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

  return (
    <div className="min-h-screen text-slate-200">
      <Header
        filterPanelOpen={filterPanelOpen}
        onToggleFilterPanel={toggleFilterPanel}
        stats={{ total: images.length, filtered: filteredImages.length }}
        onSearch={(value) => {
          setFilters((prev) => ({ ...prev, search: value }));
          setPendingFilters((prev) => ({ ...prev, search: value }));
        }}
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
            images={filteredImages}
            gridSize={gridSize}
            onOpenDetail={openDetailPanel}
            view={view}
          />

          <FooterBar total={images.length} filtered={filteredImages.length} />
        </section>

        <FilterPanel
          isOpen={filterPanelOpen}
          onClose={toggleFilterPanel}
          filters={pendingFilters}
          onFiltersChange={setPendingFilters}
          onApplyFilters={applyFilters}
          onClearAll={resetFilters}
          categories={categories}
          tags={allTags}
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
        className={`fixed inset-0 bg-black/50 transition-opacity ${
          overlayVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          if (filterPanelOpen) setFilterPanelOpen(false);
          if (detailPanelOpen) closeDetailPanel();
        }}
      />
    </div>
  );
}

export default App;
