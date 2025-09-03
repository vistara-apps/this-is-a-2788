import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { galleryFunctions, photoFunctions } from '../lib/db';
import { 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle,
  Loader,
  ArrowLeft,
  Save,
  X,
  Move,
  Eye,
  Download,
  Heart
} from 'lucide-react';

function GalleryDetail() {
  const { galleryId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGallery, setEditedGallery] = useState({ name: '', description: '' });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      if (!user || !galleryId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch gallery details
        const { data: galleryData, error: galleryError } = await galleryFunctions.getGallery(galleryId);
        if (galleryError) throw galleryError;
        
        if (!galleryData) {
          navigate('/galleries');
          return;
        }

        setGallery(galleryData);
        setEditedGallery({
          name: galleryData.name,
          description: galleryData.description || '',
        });

        // Fetch photos in the gallery
        const { data: photosData, error: photosError } = await photoFunctions.getGalleryPhotos(galleryId);
        if (photosError) throw photosError;
        
        setPhotos(photosData || []);
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError(err.message || 'An error occurred while loading gallery data');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [user, galleryId, navigate]);

  const handleUpdateGallery = async () => {
    if (!editedGallery.name.trim()) {
      setError('Gallery name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await galleryFunctions.updateGallery(galleryId, {
        name: editedGallery.name.trim(),
        description: editedGallery.description.trim(),
      });

      if (error) throw error;

      setGallery(data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating gallery:', err);
      setError(err.message || 'An error occurred while updating the gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select image files only');
      return;
    }

    const newFiles = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeUploadedFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    try {
      setUploading(true);
      setError(null);

      const uploadedPhotos = [];

      for (const fileObj of uploadedFiles) {
        // Upload the file to storage
        const { data: uploadData, error: uploadError } = await photoFunctions.uploadPhoto(
          fileObj.file,
          user.id,
          galleryId
        );

        if (uploadError) throw uploadError;

        // Create a photo record in the database
        const { data: photoData, error: photoError } = await photoFunctions.createPhoto({
          galleryId,
          imageUrl: uploadData.publicUrl,
          filePath: uploadData.filePath,
          caption: fileObj.file.name,
        });

        if (photoError) throw photoError;

        uploadedPhotos.push(photoData);
      }

      // Add the new photos to the list
      setPhotos([...photos, ...uploadedPhotos]);
      
      // Reset the upload state
      setUploadedFiles([]);
      setShowUploadModal(false);
    } catch (err) {
      console.error('Error uploading photos:', err);
      setError(err.message || 'An error occurred while uploading photos');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      const { error } = await photoFunctions.deletePhoto(
        photoToDelete.photoId,
        photoToDelete.filePath
      );

      if (error) throw error;

      // Remove the photo from the list
      setPhotos(photos.filter(p => p.photoId !== photoToDelete.photoId));
      
      // Close the delete confirmation
      setPhotoToDelete(null);
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(err.message || 'An error occurred while deleting the photo');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && !gallery) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">Gallery Not Found</h2>
        <p className="text-text-secondary mb-6">
          The gallery you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link to="/galleries" className="btn-primary">
          Back to Galleries
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Link
            to="/galleries"
            className="p-2 text-text-secondary hover:text-primary hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          {isEditing ? (
            <div className="flex-1">
              <input
                type="text"
                value={editedGallery.name}
                onChange={(e) => setEditedGallery({ ...editedGallery, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xl font-bold focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Gallery Name"
              />
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-text-primary">{gallery.name}</h1>
          )}
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedGallery({
                    name: gallery.name,
                    description: gallery.description || '',
                  });
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleUpdateGallery}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Photos</span>
              </button>
            </>
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

      {/* Description */}
      <div className="bg-white rounded-lg shadow-card p-6">
        {isEditing ? (
          <textarea
            value={editedGallery.description}
            onChange={(e) => setEditedGallery({ ...editedGallery, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Gallery description (optional)"
          />
        ) : (
          <p className="text-text-secondary">
            {gallery.description || 'No description provided.'}
          </p>
        )}
      </div>

      {/* Photos grid */}
      {photos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-text-secondary mb-4">This gallery doesn't have any photos yet.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Photos</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.photoId}
              className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className="relative">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex space-x-3">
                    <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200">
                      <Eye className="h-5 w-5 text-white" />
                    </button>
                    <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200">
                      <Heart className="h-5 w-5 text-white" />
                    </button>
                    <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200">
                      <Download className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-text-primary mb-1 line-clamp-1">{photo.caption}</p>
                    <p className="text-text-secondary text-sm">
                      {new Date(photo.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setPhotoToDelete(photo)}
                    className="p-2 text-text-secondary hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-text-primary">Upload Photos</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedFiles([]);
                }}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                  isDragging 
                    ? 'border-primary bg-primary bg-opacity-10' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-text-primary mb-2">
                  Drop your photos here, or{' '}
                  <span className="text-primary hover:underline cursor-pointer">
                    browse
                  </span>
                </p>
                <p className="text-text-secondary">
                  Support for JPG, PNG, and WebP files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Preview grid */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-text-primary mb-4">
                    Selected Photos ({uploadedFiles.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="relative group">
                        <img
                          src={file.preview}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeUploadedFile(file.id);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <p className="text-sm text-text-secondary">
                {uploadedFiles.length} photo{uploadedFiles.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadedFiles([]);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploadedFiles.length === 0 || uploading}
                  className={`btn-primary flex items-center space-x-2 ${
                    uploadedFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Upload {uploadedFiles.length} Photo{uploadedFiles.length !== 1 ? 's' : ''}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete photo confirmation modal */}
      {photoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Delete Photo</h2>
              <p className="text-text-secondary mb-6">
                Are you sure you want to delete this photo? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setPhotoToDelete(null)}
                  className="btn-secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePhoto}
                  disabled={isDeleting}
                  className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Photo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryDetail;

