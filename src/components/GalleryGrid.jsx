import React from 'react';
import PhotoCard from './PhotoCard';

function GalleryGrid({ photos, layout, theme }) {
  const getGridClass = () => {
    switch (layout) {
      case '2col':
        return 'grid-cols-1 md:grid-cols-2';
      case '3col':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (layout === 'masonry') {
    return (
      <div className={`${getGridClass()} gap-6 space-y-6`}>
        {photos.map((photo) => (
          <div key={photo.id} className="break-inside-avoid mb-6">
            <PhotoCard photo={photo} theme={theme} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${getGridClass()} gap-6`}>
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} theme={theme} />
      ))}
    </div>
  );
}

export default GalleryGrid;