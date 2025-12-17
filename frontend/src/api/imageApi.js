const API_BASE = '/api/images';

const normalizeImage = (image) => ({
  ...image,
  dateCreated: new Date(image.dateCreated),
  dateModified: new Date(image.dateModified)
});

const buildQuery = (filters, sortBy) => {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.colorMode) params.set('colorMode', filters.colorMode);
  if (filters.minResolution !== undefined && filters.minResolution !== null) params.set('minResolution', filters.minResolution);
  if (filters.minSize !== null && filters.minSize !== undefined) params.set('minSize', filters.minSize);
  if (filters.maxSize !== null && filters.maxSize !== undefined) params.set('maxSize', filters.maxSize);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);
  if (filters.aspectRatio && filters.aspectRatio !== 'all') params.set('aspectRatio', filters.aspectRatio);
  if (filters.categories && filters.categories.size) params.set('categories', Array.from(filters.categories).join(','));
  if (filters.tags && filters.tags.size) params.set('tags', Array.from(filters.tags).join(','));
  if (sortBy) params.set('sort', sortBy);
  return params.toString();
};

export const fetchFilterOptions = async () => {
  const response = await fetch(`${API_BASE}/filters`);
  if (!response.ok) {
    throw new Error('Failed to load filter options');
  }
  return response.json();
};

export const openImageStream = (filters, sortBy, { onImage, onComplete, onError }) => {
  const query = buildQuery(filters, sortBy);
  const source = new EventSource(`${API_BASE}/stream?${query}`);

  source.addEventListener('image', (event) => {
    const payload = JSON.parse(event.data);
    onImage?.(normalizeImage(payload));
  });

  source.addEventListener('complete', (event) => {
    const summary = JSON.parse(event.data);
    onComplete?.(summary);
    source.close();
  });

  source.onerror = () => {
    onError?.();
    source.close();
  };

  return () => source.close();
};
