import React from 'react';
import { formatDate, getResolutionClass } from '../data/utils.js';

function ImageCard({ image, selected, onToggleSelect, onOpenDetail }) {
  return (
    <div
      className={`thumbnail-card fade-in ${selected ? 'selected-card' : ''}`}
      onClick={onToggleSelect}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpenDetail();
      }}
    >
      <img src={image.thumbnail} alt={image.name} loading="lazy" />
      <div className="thumbnail-overlay" />

      <div className="thumbnail-label">
        <span className={`resolution-badge ${getResolutionClass(image.resolutionLabel)}`}>{image.resolutionLabel}</span>
        <span className="px-2 py-1 bg-black/60 rounded text-xs text-white">{image.fileSizeFormatted}</span>
      </div>

      <div className="absolute top-2 right-2">
        <div className={`w-6 h-6 rounded-full ${selected ? 'bg-indigo-500' : 'bg-black/50 border border-white/30'} flex items-center justify-center`}>
          {selected && <i className="fas fa-check text-white text-xs" />}
        </div>
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail();
          }}
          className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white backdrop-blur transition-colors"
        >
          <i className="fas fa-info-circle mr-1" />View Details
        </button>
      </div>
    </div>
  );
}

export default ImageCard;
