import React from 'react';
import { getResolutionClass } from '../data/utils.js';

function DetailPanel({ isOpen, image, onClose, formatDate, formatDateTime }) {
  if (!image) return null;

  return (
    <aside className={`detail-panel fixed left-0 top-0 h-full w-96 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 z-40 overflow-y-auto ${isOpen ? 'open' : ''}`}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Image Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <i className="fas fa-times text-slate-400" />
          </button>
        </div>

        <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800">
          <img src={image.thumbnail} alt={image.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <span className={`resolution-badge ${getResolutionClass(image.resolutionLabel)}`}>{image.resolutionLabel}</span>
            {!image.isColor && (
              <span className="px-2 py-1 bg-slate-700 rounded text-xs text-white"><i className="fas fa-adjust mr-1" />B&W</span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{image.name}</h3>
          <p className="text-sm text-slate-400">{image.description}</p>
        </div>

        <div className="meta-grid">
          <MetaItem label="Dimensions" value={`${image.width} × ${image.height}`} />
          <MetaItem label="File Size" value={image.fileSizeFormatted} />
          <MetaItem label="Created" value={formatDateTime(image.dateCreated)} />
          <MetaItem label="Modified" value={formatDateTime(image.dateModified)} />
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <h4 className="text-sm font-medium text-white mb-3">
            <i className="fas fa-camera mr-2 text-indigo-400" />Camera Info
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Camera" value={image.camera} />
            <Info label="Aperture" value={image.aperture} />
            <Info label="ISO" value={image.iso} />
            <Info label="Exposure" value={image.exposureTime} />
            <Info label="Focal Length" value={image.focalLength} />
            <Info label="Location" value={<span><i className="fas fa-map-marker-alt mr-1 text-red-400" />{image.location}</span>} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-white mb-3">
            <i className="fas fa-tags mr-2 text-indigo-400" />Category & Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-indigo-600 rounded-full text-xs text-white font-medium">{image.category}</span>
            {image.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 bg-slate-700 rounded-full text-xs text-slate-300">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors">
            <i className="fas fa-download mr-2" />Download
          </button>
          <button className="py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
            <i className="fas fa-share-alt" />
          </button>
          <button className="py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
            <i className="fas fa-edit" />
          </button>
          <button className="py-3 px-4 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-xl transition-colors">
            <i className="fas fa-trash" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function MetaItem({ label, value }) {
  return (
    <div className="meta-item">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-slate-200">{value}</p>
    </div>
  );
}

export default DetailPanel;
