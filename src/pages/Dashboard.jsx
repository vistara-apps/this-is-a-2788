import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { galleryFunctions, photoFunctions, websiteFunctions } from '../lib/db';
import { 
  Image, 
  Plus, 
  Eye, 
  Settings, 
  CreditCard, 
  AlertCircle,
  Loader
} from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [websiteSettings, setWebsiteSettings] = useState(null);
  const [stats, setStats] = useState({
    totalGalleries: 0,
    totalPhotos: 0,
    isPublished: false,
    subscriptionTier: 'free',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch galleries
        const { data: galleriesData, error: galleriesError } = await galleryFunctions.getUserGalleries(user.id);
        if (galleriesError) throw galleriesError;
        
        setGalleries(galleriesData || []);
        setStats(prev => ({ ...prev, totalGalleries: galleriesData?.length || 0 }));

        // Fetch total photos count
        let photoCount = 0;
        if (galleriesData && galleriesData.length > 0) {
          for (const gallery of galleriesData) {
            const { data: photosData } = await photoFunctions.getGalleryPhotos(gallery.galleryId);
            photoCount += photosData?.length || 0;
          }
        }
        setTotalPhotos(photoCount);
        setStats(prev => ({ ...prev, totalPhotos: photoCount }));

        // Fetch website settings
        const { data: settingsData, error: settingsError } = await websiteFunctions.getWebsiteSettings(user.id);
        if (settingsError) throw settingsError;
        
        setWebsiteSettings(settingsData);
        setStats(prev => ({ 
          ...prev, 
          isPublished: settingsData?.isPublished || false,
        }));

        // Fetch user profile for subscription tier
        const { data: profileData } = await userFunctions.getUserProfile(user.id);
        if (profileData) {
          setStats(prev => ({ 
            ...prev, 
            subscriptionTier: profileData.subscriptionTier || 'free',
          }));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'An error occurred while loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <Link
          to="/galleries"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Gallery</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary bg-opacity-10 p-3 rounded-full">
              <Image className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Galleries</p>
              <p className="text-2xl font-bold text-text-primary">{stats.totalGalleries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary bg-opacity-10 p-3 rounded-full">
              <Image className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Photos</p>
              <p className="text-2xl font-bold text-text-primary">{stats.totalPhotos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary bg-opacity-10 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Subscription</p>
              <p className="text-2xl font-bold text-text-primary capitalize">
                {stats.subscriptionTier}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary bg-opacity-10 p-3 rounded-full">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Website Status</p>
              <p className="text-2xl font-bold text-text-primary">
                {stats.isPublished ? 'Published' : 'Draft'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent galleries */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Recent Galleries</h2>
          <Link
            to="/galleries"
            className="text-primary hover:text-accent transition-colors duration-200 text-sm font-medium"
          >
            View All
          </Link>
        </div>

        {galleries.length === 0 ? (
          <div className="text-center py-8">
            <Image className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-text-secondary mb-4">You haven't created any galleries yet.</p>
            <Link
              to="/galleries"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Gallery</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.slice(0, 3).map((gallery) => (
              <Link
                key={gallery.galleryId}
                to={`/galleries/${gallery.galleryId}`}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <Image className="h-12 w-12 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-text-primary mb-1">{gallery.name}</h3>
                  <p className="text-text-secondary text-sm truncate">
                    {gallery.description || 'No description'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/galleries"
            className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex flex-col items-center text-center"
          >
            <Image className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-medium text-text-primary mb-2">Manage Galleries</h3>
            <p className="text-text-secondary text-sm">
              Upload, organize, and edit your photo galleries
            </p>
          </Link>

          <Link
            to="/preview"
            className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex flex-col items-center text-center"
          >
            <Eye className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-medium text-text-primary mb-2">Preview Website</h3>
            <p className="text-text-secondary text-sm">
              See how your website looks before publishing
            </p>
          </Link>

          <Link
            to="/subscription"
            className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex flex-col items-center text-center"
          >
            <CreditCard className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-medium text-text-primary mb-2">Manage Subscription</h3>
            <p className="text-text-secondary text-sm">
              View or upgrade your current subscription plan
            </p>
          </Link>
        </div>
      </div>

      {/* Upgrade prompt (for free tier users) */}
      {stats.subscriptionTier === 'free' && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-semibold mb-2">Upgrade to Premium</h2>
              <p className="text-white text-opacity-90">
                Get unlimited galleries, custom domain, and advanced customization options.
              </p>
            </div>
            <Link
              to="/subscription"
              className="bg-white text-purple-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

