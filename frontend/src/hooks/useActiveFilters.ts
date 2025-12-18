import { useMemo } from 'react';
import { activeResolutionLabels } from '../data/utils';
import type { ActiveFilter, FilterState } from '../types/gallery';

export function useActiveFilters(filters: FilterState) {
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

  const activeFilterCount = activeFilters.length;
  const hasActiveFilters = activeFilterCount > 0;

  return { activeFilters, activeFilterCount, hasActiveFilters };
}
