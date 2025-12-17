import React from 'react';
import { formatDate, getResolutionClass } from '../data/utils.js';

function ImageCard({ image, onOpenDetail }) {
  return (
    <div className="thumbnail-card fade-in" onClick={onOpenDetail}>
      <img src={image.thumbnail} alt={image.name} loading="lazy" />
      <div className="thumbnail-overlay" />

      <div className="thumbnail-label">
        <span className={`resolution-badge ${getResolutionClass(image.resolutionLabel)}`}>{image.resolutionLabel}</span>
        <span className="px-2 py-1 bg-black/60 rounded text-xs text-white">{image.fileSizeFormatted}</span>
      </div>

      {!image.isColor && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-80">
          <span className="px-2 py-1 bg-black/60 rounded text-xs text-white">
            <i className="fas fa-adjust mr-1" />B&W
          </span>
        </div>
      )}

      <div className="thumbnail-info">
        <p className="text-white font-medium truncate text-sm mb-1">{image.name}</p>
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>{image.width} × {image.height}</span>
          <span>{formatDate(image.dateCreated)}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 bg-indigo-500/30 rounded text-xs text-indigo-300">{image.category}</span>
          <span className="text-xs text-slate-400"><i className="fas fa-map-marker-alt mr-1" />{image.location}</span>
        </div>
      </div>
    </div>
  );
}

export default ImageCard;
