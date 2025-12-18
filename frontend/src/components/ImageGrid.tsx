import React from 'react';
import ImageCard from './ImageCard';
import type { ImageMetadata } from '../types/gallery';

interface ImageGridProps {
  images: ImageMetadata[];
  gridSize: number;
  onOpenDetail: (image: ImageMetadata) => void;
  view: 'grid' | 'list';
  loading: boolean;
  error: string | null;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, gridSize, onOpenDetail, view, loading, error }) => {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <i className="fas fa-spinner fa-spin text-3xl text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">Loading images</h3>
        <p className="text-slate-500 max-w-md">Fetching results from the backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
        <div className="w-24 h-24 bg-rose-950 rounded-full flex items-center justify-center mb-6">
          <i className="fas fa-triangle-exclamation text-3xl text-rose-300" />
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">Unable to load images</h3>
        <p className="text-slate-500 max-w-md">{error}</p>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <i className="fas fa-search text-4xl text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No images found</h3>
        <p className="text-slate-500 max-w-md">Try adjusting your search or filter criteria to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className={`thumbnail-grid ${view === 'list' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`} style={{ gridTemplateColumns: view === 'grid' ? `repeat(${gridSize}, 1fr)` : undefined }}>
        {images.map((img) => (
          <ImageCard key={img.id} image={img} onOpenDetail={() => onOpenDetail(img)} />
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
