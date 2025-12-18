import { type FilterState } from '../types/gallery';

const baseFilters: Omit<FilterState, 'categories' | 'tags'> = {
  search: '',
  colorMode: 'all',
  minResolution: 0,
  minSize: null,
  maxSize: null,
  dateFrom: null,
  dateTo: null,
  aspectRatio: 'all'
};

export class FilterStateFactory {
  static create(): FilterState {
    return {
      ...baseFilters,
      categories: new Set<string>(),
      tags: new Set<string>()
    };
  }

  static clone(source: FilterState): FilterState {
    return {
      ...source,
      categories: new Set(source.categories),
      tags: new Set(source.tags)
    };
  }
}
