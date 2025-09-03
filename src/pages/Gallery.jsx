import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { galleryFunctions, photoFunctions } from '../lib/db';
import { 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle,
  Loader,
  Search,
  X
} from 'lucide-react';

function Gallery() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [galleryCounts, setGalleryCounts] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGallery, setNewGallery] = useState({ name: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch galleries
        const { data, error } = await galleryFunctions.getUserGalleries(user.id);
        if (error) throw error;
        
        setGalleries(data || []);

        // Fetch photo counts for each gallery
        const counts = {};
        for (const gallery of data || []) {
          const { data: photos } = await photoFunctions.getGalleryPhotos(gallery.galleryId);
          counts[gallery.galleryId] = photos?.length || 0;
        }
        setGalleryCounts(counts);
      } catch (err) {
        console.error('Error fetching galleries:', err);
        setError(err.message || 'An error occurred while loading galleries');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, [user]);

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    
    if (!newGallery.name.trim()) {
      setError('Gallery name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await galleryFunctions.createGallery({
        userId: user.id,
        name: newGallery.name.trim(),
        description: newGallery.description.trim(),
      });

      if (error) throw error;

      // Add the new gallery to the list
      setGalleries([data, ...galleries]);
      setGalleryCounts({ ...galleryCounts, [data.galleryId]: 0 });
      
      // Reset form and close modal
      setNewGallery({ name: '', description: '' });
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating gallery:', err);
      setError(err.message || 'An error occurred while creating the gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGallery = async () => {
    if (!galleryToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      const { error } = await galleryFunctions.deleteGallery(galleryToDelete.galleryId);
      if (error) throw error;

      // Remove the gallery from the list
      setGalleries(galleries.filter(g => g.galleryId !== galleryToDelete.galleryId));
      
      // Close the delete confirmation
      setGalleryToDelete(null);
    } catch (err) {
      console.error('Error deleting gallery:', err);
      setError(err.message || 'An error occurred while deleting the gallery');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter galleries based on search query
  const filteredGalleries = galleries.filter(gallery => 
    gallery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (gallery.description && gallery.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading && galleries.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Galleries</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Gallery</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-card p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search galleries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-primary focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Gallery grid */}
      {filteredGalleries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          {searchQuery ? (
            <p className="text-text-secondary mb-4">No galleries found matching "{searchQuery}".</p>
          ) : (
            <>
              <p className="text-text-secondary mb-4">You haven't created any galleries yet.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Your First Gallery</span>
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => (
            <div
              key={gallery.galleryId}
              className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-200"
            >
              <Link to={`/galleries/${gallery.galleryId}`}>
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <Image className="h-16 w-16 text-gray-300" />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/galleries/${gallery.galleryId}`}>
                  <h3 className="font-medium text-text-primary text-lg mb-1 hover:text-primary transition-colors duration-200">
                    {gallery.name}
                  </h3>
                </Link>
                <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                  {gallery.description || 'No description'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">
                    {galleryCounts[gallery.galleryId] || 0} photos
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      to={`/galleries/${gallery.galleryId}`}
                      className="p-2 text-text-secondary hover:text-primary hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setGalleryToDelete(gallery)}
                      className="p-2 text-text-secondary hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create gallery modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-text-primary">Create New Gallery</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGallery}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="gallery-name" className="block text-sm font-medium text-text-secondary mb-1">
                    Gallery Name *
                  </label>
                  <input
                    id="gallery-name"
                    type="text"
                    value={newGallery.name}
                    onChange={(e) => setNewGallery({ ...newGallery, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., Dogs, Cats, Wildlife"
                  />
                </div>
                <div>
                  <label htmlFor="gallery-description" className="block text-sm font-medium text-text-secondary mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    id="gallery-description"
                    value={newGallery.description}
                    onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Describe your gallery..."
                  />
                </div>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-gray-200 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Creating...' : 'Create Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {galleryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Delete Gallery</h2>
              <p className="text-text-secondary mb-6">
                Are you sure you want to delete the gallery "{galleryToDelete.name}"? This action cannot be undone and all photos in this gallery will be permanently deleted.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setGalleryToDelete(null)}
                  className="btn-secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteGallery}
                  disabled={isDeleting}
                  className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Gallery'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;

