import React, { useState } from 'react';
import Navbar from './components/Navbar';
import GalleryGrid from './components/GalleryGrid';
import CustomizationPanel from './components/CustomizationPanel';
import ImageUpload from './components/ImageUpload';
import { samplePhotos } from './data/sampleData';

function App() {
  const [photos, setPhotos] = useState(samplePhotos);
  const [selectedGallery, setSelectedGallery] = useState('all');
  const [theme, setTheme] = useState({
    layout: '3col',
    primaryColor: '#667eea',
    accentColor: '#764ba2',
    backgroundColor: '#f8fafc'
  });
  const [showUpload, setShowUpload] = useState(false);
  const [showCustomization, setShowCustomization] = useState(true);

  const handlePhotoUpload = (newPhotos) => {
    const photosWithIds = newPhotos.map((photo, index) => ({
      id: Date.now() + index,
      url: photo,
      caption: `New photo ${photos.length + index + 1}`,
      gallery: selectedGallery === 'all' ? 'dogs' : selectedGallery
    }));
    setPhotos([...photos, ...photosWithIds]);
    setShowUpload(false);
  };

  const filteredPhotos = selectedGallery === 'all' 
    ? photos 
    : photos.filter(photo => photo.gallery === selectedGallery);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onUploadClick={() => setShowUpload(true)}
        onCustomizeClick={() => setShowCustomization(!showCustomization)}
      />
      
      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showCustomization ? 'mr-80' : 'mr-0'}`}>
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Gallery Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-text-primary mb-4">
                My Pet Portfolio
              </h1>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGallery('all')}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    selectedGallery === 'all' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-text-secondary hover:bg-gray-100'
                  }`}
                >
                  All Photos
                </button>
                <button
                  onClick={() => setSelectedGallery('dogs')}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    selectedGallery === 'dogs' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-text-secondary hover:bg-gray-100'
                  }`}
                >
                  Dogs
                </button>
                <button
                  onClick={() => setSelectedGallery('cats')}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    selectedGallery === 'cats' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-text-secondary hover:bg-gray-100'
                  }`}
                >
                  Cats
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <GalleryGrid 
              photos={filteredPhotos} 
              layout={theme.layout}
              theme={theme}
            />
          </div>
        </div>

        {/* Customization Panel */}
        <CustomizationPanel 
          show={showCustomization}
          theme={theme}
          onThemeChange={setTheme}
          onClose={() => setShowCustomization(false)}
        />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <ImageUpload 
          onUpload={handlePhotoUpload}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
}

export default App;