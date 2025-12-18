import React from 'react';

interface FooterBarProps {
  total: number;
  filtered: number;
}

const FooterBar: React.FC<FooterBarProps> = ({ total, filtered }) => (
  <footer className="flex-shrink-0 px-6 py-3 bg-slate-900/80 border-t border-slate-700/50 flex items-center justify-between">
    <p className="text-sm text-slate-400">Showing {filtered} of {total} images</p>
    <span className="text-sm text-slate-500">ImageVault Pro v1.0</span>
  </footer>
);

export default FooterBar;
