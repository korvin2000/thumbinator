import type {
  FilterState,
  ImageMetadata,
  ImageStreamCallbacks,
  ImageStreamSummary,
  SortOption,
  FilterOptions
} from '../types/gallery';

const API_BASE = '/api/images';

type ImageResponse = Omit<ImageMetadata, 'dateCreated' | 'dateModified'> & {
  dateCreated: string;
  dateModified: string;
};

class ImageApiClient {
  static async fetchFilterOptions(): Promise<FilterOptions> {
    const response = await fetch(`${API_BASE}/filters`);
    if (!response.ok) {
      throw new Error('Failed to load filter options');
    }
    return response.json();
  }

  static openImageStream(
    filters: FilterState,
    sortBy: SortOption,
    callbacks: ImageStreamCallbacks
  ): () => void {
    const query = this.buildQuery(filters, sortBy);
    const source = new EventSource(`${API_BASE}/stream?${query}`);

    source.addEventListener('image', (event) => {
      const payload = JSON.parse((event as MessageEvent<string>).data) as ImageResponse;
      callbacks.onImage?.(this.normalizeImage(payload));
    });

    source.addEventListener('complete', (event) => {
      const summary = JSON.parse((event as MessageEvent<string>).data) as ImageStreamSummary;
      callbacks.onComplete?.(summary);
      source.close();
    });

    source.onerror = () => {
      callbacks.onError?.();
      source.close();
    };

    return () => source.close();
  }

  private static normalizeImage(image: ImageResponse): ImageMetadata {
    return {
      ...image,
      dateCreated: new Date(image.dateCreated),
      dateModified: new Date(image.dateModified),
      tags: image.tags ?? []
    };
  }

  private static buildQuery(filters: FilterState, sortBy: SortOption): string {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.colorMode) params.set('colorMode', filters.colorMode);
    if (filters.minResolution !== undefined && filters.minResolution !== null) params.set('minResolution', `${filters.minResolution}`);
    if (filters.minSize !== null && filters.minSize !== undefined) params.set('minSize', `${filters.minSize}`);
    if (filters.maxSize !== null && filters.maxSize !== undefined) params.set('maxSize', `${filters.maxSize}`);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.aspectRatio && filters.aspectRatio !== 'all') params.set('aspectRatio', filters.aspectRatio);
    if (filters.categories?.size) params.set('categories', Array.from(filters.categories).join(','));
    if (filters.tags?.size) params.set('tags', Array.from(filters.tags).join(','));
    if (sortBy) params.set('sort', sortBy);
    return params.toString();
  }
}

export { ImageApiClient };
