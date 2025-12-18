export type ColorMode = 'all' | 'color' | 'bw';
export type AspectRatio = 'all' | '16:9' | '4:3' | '1:1' | '3:2' | '21:9';
export type SortOption = 'newest' | 'oldest' | 'largest' | 'smallest' | 'name-asc' | 'name-desc' | 'resolution';
export type ActiveFilterType = 'search' | 'color' | 'resolution' | 'categories' | 'tags' | 'date' | 'aspect';

export interface GalleryStats {
  total: number;
  filtered: number;
}

export interface ActiveFilter {
  type: ActiveFilterType;
  label: string;
}

export interface FilterState {
  search: string;
  colorMode: ColorMode;
  minResolution: number;
  minSize: number | null;
  maxSize: number | null;
  dateFrom: string | null;
  dateTo: string | null;
  aspectRatio: AspectRatio;
  categories: Set<string>;
  tags: Set<string>;
}

export interface FilterOptions {
  categories: string[];
  tags: string[];
  totalImages?: number;
}

export interface ImageMetadata {
  id: string | number;
  name: string;
  description: string;
  width: number;
  height: number;
  fileSizeFormatted: string;
  thumbnail: string;
  resolutionLabel: string;
  isColor: boolean;
  dateCreated: Date;
  dateModified: Date;
  category: string;
  location: string;
  tags: string[];
  camera?: string;
  aperture?: string;
  iso?: string | number;
  exposureTime?: string;
  focalLength?: string;
}

export interface ImageStreamSummary {
  total: number;
  filtered: number;
}

export interface ImageStreamCallbacks {
  onImage?: (image: ImageMetadata) => void;
  onComplete?: (summary: ImageStreamSummary) => void;
  onError?: () => void;
}
