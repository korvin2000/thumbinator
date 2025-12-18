const resolutionThresholds = [0, 1280 * 720, 1920 * 1080, 3840 * 2160, 7680 * 4320] as const;
const resolutionLabels = [
  'Any resolution',
  'HD (720p) or higher',
  'Full HD (1080p) or higher',
  '4K (2160p) or higher',
  '8K (4320p) or higher'
] as const;
const activeResolutionLabels = ['Any', 'HD+', 'FHD+', '4K+', '8K+'] as const;

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);

const formatDateTime = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);

const debounce = <Args extends unknown[]>(fn: (...args: Args) => void, delay = 200): ((...args: Args) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const getResolutionClass = (label: string): 'res-8k' | 'res-4k' | 'res-hd' => {
  if (label === '8K' || label === '6K') return 'res-8k';
  if (label === '4K') return 'res-4k';
  return 'res-hd';
};

export {
  activeResolutionLabels,
  debounce,
  formatDate,
  formatDateTime,
  getResolutionClass,
  resolutionLabels,
  resolutionThresholds
};
