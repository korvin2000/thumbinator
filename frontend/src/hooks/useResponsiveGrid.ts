import { useEffect, useState } from 'react';

const MOBILE_GRID = 2;
const TABLET_GRID = 3;

export function useResponsiveGrid(defaultGrid = 4) {
  const [gridSize, setGridSize] = useState<number>(defaultGrid);

  useEffect(() => {
    const updateGrid = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setGridSize(MOBILE_GRID);
      } else if (width < 1024) {
        setGridSize(TABLET_GRID);
      } else {
        setGridSize(defaultGrid);
      }
    };

    updateGrid();
    const handler = () => updateGrid();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [defaultGrid]);

  return { gridSize, setGridSize } as const;
}
