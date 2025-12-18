import React from 'react';

interface OverlayMaskProps {
  isVisible: boolean;
  isInteractive?: boolean;
  onClick?: () => void;
}

const OverlayMask: React.FC<OverlayMaskProps> = ({ isVisible, isInteractive = false, onClick }) => {
  const stateClass = isVisible ? 'overlay-mask visible' : 'overlay-mask hidden';
  const pointerClass = isInteractive ? 'pointer-events-auto' : 'pointer-events-none';

  return <div className={`${stateClass} ${pointerClass}`} onClick={onClick} />;
};

export default OverlayMask;
