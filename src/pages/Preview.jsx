import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { galleryFunctions, photoFunctions, websiteFunctions } from '../lib/db';
import { 
  Eye, 
  Globe, 
  AlertCircle,
  Loader,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Check
} from 'lucide-react';

function Preview() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [photos, setPhotos] = useState({});
  const [websiteSettings, setWebsiteSettings] = useState(null);
  const [viewMode, setViewMode] = useState('desktop');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch galleries
        const { data: galleriesData, error: galleriesError } = await galleryFunctions.getUserGalleries(user.id);
        if (galleriesError) throw galleriesError;
        
        setGalleries(galleriesData || []);

        // Fetch photos for each gallery
        const photosObj = {};
        for (const gallery of galleriesData || []) {
          const { data: photosData } = await photoFunctions.getGalleryPhotos(gallery.galleryId);
          photosObj[gallery.galleryId] = photosData || [];
        }
        setPhotos(photosObj);

        // Fetch website settings
        const { data: settingsData, error: settingsError } = await websiteFunctions.getWebsiteSettings(user.id);
        if (settingsError) throw settingsError;
        
        setWebsiteSettings(settingsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred while loading preview data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setError(null);

      const { data, error } = await websiteFunctions.publishWebsite(user.id);
      if (error) throw error;
      
      setWebsiteSettings(data);
    } catch (err) {
      console.error('Error publishing website:', err);
      setError(err.message || 'An error occurred while publishing your website');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      setIsPublishing(true);
      setError(null);

      const { data, error } = await websiteFunctions.unpublishWebsite(user.id);
      if (error) throw error;
      
      setWebsiteSettings(data);
    } catch (err) {
      console.error('Error unpublishing website:', err);
      setError(err.message || 'An error occurred while unpublishing your website');
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Preview Website</h1>
        <div className="flex space-x-3">
          {websiteSettings?.isPublished ? (
            <>
              <a
                href={websiteSettings.publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Live Site</span>
              </a>
              <button
                onClick={handleUnpublish}
                disabled={isPublishing}
                className="btn-secondary flex items-center space-x-2"
              >
                {isPublishing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4" />
                    <span>Unpublish</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="btn-primary flex items-center space-x-2"
            >
              {isPublishing ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  <span>Publish Website</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* View mode selector */}
      <div className="bg-white rounded-lg shadow-card p-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-md flex flex-col items-center transition-colors duration-200 ${
              viewMode === 'desktop' 
                ? 'bg-primary bg-opacity-10 text-primary' 
                : 'text-text-secondary hover:bg-gray-100'
            }`}
          >
            <Monitor className="h-6 w-6 mb-1" />
            <span className="text-xs">Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`p-2 rounded-md flex flex-col items-center transition-colors duration-200 ${
              viewMode === 'tablet' 
                ? 'bg-primary bg-opacity-10 text-primary' 
                : 'text-text-secondary hover:bg-gray-100'
            }`}
          >
            <Tablet className="h-6 w-6 mb-1" />
            <span className="text-xs">Tablet</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-md flex flex-col items-center transition-colors duration-200 ${
              viewMode === 'mobile' 
                ? 'bg-primary bg-opacity-10 text-primary' 
                : 'text-text-secondary hover:bg-gray-100'
            }`}
          >
            <Smartphone className="h-6 w-6 mb-1" />
            <span className="text-xs">Mobile</span>
          </button>
        </div>
      </div>

      {/* Preview iframe */}
      <div className="bg-white rounded-lg shadow-card p-4 flex justify-center">
        <div 
          className={`border border-gray-300 rounded-md overflow-hidden transition-all duration-300 ${
            viewMode === 'desktop' ? 'w-full max-w-5xl h-[600px]' :
            viewMode === 'tablet' ? 'w-[768px] h-[1024px]' :
            'w-[375px] h-[667px]'
          }`}
        >
          <div className="w-full h-full bg-gray-100 overflow-auto">
            {/* Preview content */}
            <div className="min-h-full">
              {/* Header */}
              <header 
                className="text-white p-6"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)` 
                }}
              >
                <div className="max-w-6xl mx-auto">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">My Pet Portfolio</h1>
                    <nav className="hidden md:block">
                      <ul className="flex space-x-6">
                        <li>
                          <a href="#" className="hover:text-gray-200 transition-colors duration-200">
                            Home
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-gray-200 transition-colors duration-200">
                            Galleries
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-gray-200 transition-colors duration-200">
                            About
                          </a>
                        </li>
                        <li>
                          <a href="#" className="hover:text-gray-200 transition-colors duration-200">
                            Contact
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </header>

              {/* Main content */}
              <main className="p-6">
                <div className="max-w-6xl mx-auto">
                  {/* Hero section */}
                  <section className="mb-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome to My Pet Photography</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mb-8">
                      Capturing the beauty and personality of your beloved animal companions.
                    </p>
                  </section>

                  {/* Galleries */}
                  <section className="mb-12">
                    <h3 className="text-2xl font-bold mb-6">Galleries</h3>
                    
                    {galleries.length === 0 ? (
                      <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <p className="text-text-secondary">
                          No galleries to display. Add galleries to see them in the preview.
                        </p>
                      </div>
                    ) : (
                      <div className={`grid gap-6 ${
                        theme.layout === '2col' ? 'grid-cols-1 md:grid-cols-2' :
                        theme.layout === '3col' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                        'columns-1 md:columns-2 lg:columns-3'
                      }`}>
                        {galleries.map((gallery) => (
                          <div 
                            key={gallery.galleryId}
                            className="bg-white rounded-lg overflow-hidden shadow-card"
                          >
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                              {photos[gallery.galleryId]?.length > 0 ? (
                                <img 
                                  src={photos[gallery.galleryId][0].imageUrl} 
                                  alt={gallery.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Eye className="h-12 w-12 text-gray-400" />
                              )}
                            </div>
                            <div className="p-4">
                              <h4 className="font-medium text-lg mb-2">{gallery.name}</h4>
                              <p className="text-text-secondary text-sm">
                                {gallery.description || 'No description'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Featured photos */}
                  <section className="mb-12">
                    <h3 className="text-2xl font-bold mb-6">Featured Photos</h3>
                    
                    {Object.values(photos).flat().length === 0 ? (
                      <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <p className="text-text-secondary">
                          No photos to display. Add photos to see them in the preview.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.values(photos).flat().slice(0, 4).map((photo) => (
                          <div 
                            key={photo.photoId}
                            className="bg-white rounded-lg overflow-hidden shadow-card"
                          >
                            <img 
                              src={photo.imageUrl} 
                              alt={photo.caption}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* About section */}
                  <section className="mb-12">
                    <h3 className="text-2xl font-bold mb-6">About Me</h3>
                    <div className="bg-white rounded-lg shadow-card p-6">
                      <p className="text-text-secondary mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                      </p>
                      <p className="text-text-secondary">
                        Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                      </p>
                    </div>
                  </section>

                  {/* Contact section */}
                  <section>
                    <h3 className="text-2xl font-bold mb-6">Contact</h3>
                    <div className="bg-white rounded-lg shadow-card p-6">
                      <p className="text-text-secondary mb-4">
                        Get in touch to book a session or inquire about my services.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Your name"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Your email"
                            disabled
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-text-secondary mb-1">
                            Message
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={4}
                            placeholder="Your message"
                            disabled
                          />
                        </div>
                        <div className="md:col-span-2">
                          <button
                            className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed"
                            disabled
                          >
                            Send Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </main>

              {/* Footer */}
              <footer 
                className="text-white p-6 mt-12"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)` 
                }}
              >
                <div className="max-w-6xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-xl font-bold">My Pet Portfolio</h2>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">
                        &copy; {new Date().getFullYear()} All rights reserved.
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>

      {/* Publication status */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Publication Status</h2>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${websiteSettings?.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <p className="text-text-primary">
            {websiteSettings?.isPublished ? 'Published' : 'Draft'}
          </p>
        </div>
        
        {websiteSettings?.isPublished && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-text-secondary mb-2">Your website is live at:</p>
            <a
              href={websiteSettings.publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              {websiteSettings.publishedUrl}
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        )}

        {websiteSettings?.subscriptionTier === 'premium' && (
          <div className="mt-6">
            <h3 className="font-medium text-text-primary mb-2">Custom Domain</h3>
            {websiteSettings.customDomain ? (
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-text-primary">{websiteSettings.customDomain}</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-text-secondary mb-4">
                  You can set up a custom domain for your website. This feature is available on your Premium plan.
                </p>
                <button className="btn-primary">
                  Set Up Custom Domain
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Preview;

