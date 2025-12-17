const categories = ['Landscape', 'Portrait', 'Architecture', 'Nature', 'Travel', 'Urban', 'Macro'];
const allTags = ['sunset', 'travel', 'city', 'mountain', 'beach', 'night', 'portrait', 'forest', 'sky', 'minimal', 'architecture', 'macro'];
const cameras = ['Canon EOS R5', 'Nikon Z7 II', 'Sony A7 IV', 'Fujifilm X-T5', 'Leica Q3'];
const locations = ['Paris, France', 'New York, USA', 'Tokyo, Japan', 'Reykjavik, Iceland', 'Banff, Canada', 'Sydney, Australia'];
const resolutions = [
  { label: 'HD', width: 1280, height: 720 },
  { label: 'FHD', width: 1920, height: 1080 },
  { label: '2K', width: 2560, height: 1440 },
  { label: '4K', width: 3840, height: 2160 },
  { label: '6K', width: 6016, height: 3384 },
  { label: '8K', width: 7680, height: 4320 }
];

function generateMockImages(count = 60) {
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const i = index + 1;
    const res = resolutions[Math.floor(Math.random() * resolutions.length)];
    const isColor = Math.random() > 0.2;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const imageTags = allTags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 2);
    const daysAgo = Math.floor(Math.random() * 365);
    const fileSize = Math.random() * 50 + 1;

    return {
      id: i,
      name: `IMG_${String(i).padStart(4, '0')}_${category.toLowerCase()}.jpg`,
      thumbnail: `https://picsum.photos/seed/${i}/640/360`,
      fullImage: `https://picsum.photos/seed/${i}/${res.width}/${res.height}`,
      width: res.width,
      height: res.height,
      resolutionLabel: res.label,
      fileSize,
      fileSizeFormatted: `${fileSize.toFixed(1)} MB`,
      dateCreated: new Date(now - daysAgo * 24 * 60 * 60 * 1000),
      dateModified: new Date(now - (daysAgo - Math.floor(Math.random() * 30)) * 24 * 60 * 60 * 1000),
      category,
      tags: imageTags,
      isColor,
      camera: cameras[Math.floor(Math.random() * cameras.length)],
      aperture: `f/${(Math.random() * 14 + 1.4).toFixed(1)}`,
      iso: [100, 200, 400, 800, 1600, 3200][Math.floor(Math.random() * 6)],
      exposureTime: ['1/30', '1/60', '1/125', '1/250', '1/500', '1/1000'][Math.floor(Math.random() * 6)] + 's',
      focalLength: `${Math.floor(Math.random() * 180 + 20)}mm`,
      location: locations[Math.floor(Math.random() * locations.length)],
      description: `Beautiful ${category.toLowerCase()} photograph captured with ${cameras[Math.floor(Math.random() * cameras.length)]} in ${locations[Math.floor(Math.random() * locations.length)]}.`
    };
  });
}

export { allTags, categories, generateMockImages, resolutions };
