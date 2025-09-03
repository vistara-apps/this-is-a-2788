import { supabase, handleSupabaseError } from './supabase';

// User related functions
export const userFunctions = {
  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return { user };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('userId', userId)
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('userId', userId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update subscription tier
  updateSubscriptionTier: async (userId, subscriptionTier) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ subscriptionTier })
        .eq('userId', userId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};

// Gallery related functions
export const galleryFunctions = {
  // Get all galleries for a user
  getUserGalleries: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get a single gallery
  getGallery: async (galleryId) => {
    try {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .eq('galleryId', galleryId)
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Create a new gallery
  createGallery: async (gallery) => {
    try {
      const { data, error } = await supabase
        .from('galleries')
        .insert([gallery])
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update a gallery
  updateGallery: async (galleryId, updates) => {
    try {
      const { data, error } = await supabase
        .from('galleries')
        .update(updates)
        .eq('galleryId', galleryId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Delete a gallery
  deleteGallery: async (galleryId) => {
    try {
      // First delete all photos in the gallery
      await photoFunctions.deleteGalleryPhotos(galleryId);
      
      // Then delete the gallery
      const { error } = await supabase
        .from('galleries')
        .delete()
        .eq('galleryId', galleryId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};

// Photo related functions
export const photoFunctions = {
  // Get all photos for a gallery
  getGalleryPhotos: async (galleryId) => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('galleryId', galleryId)
        .order('order', { ascending: true });

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get a single photo
  getPhoto: async (photoId) => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('photoId', photoId)
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Upload a photo to storage
  uploadPhoto: async (file, userId, galleryId) => {
    try {
      // Create a unique file path
      const filePath = `${userId}/${galleryId}/${Date.now()}-${file.name}`;
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      return { data: { filePath, publicUrl } };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Create a new photo record
  createPhoto: async (photo) => {
    try {
      // Get the current highest order value for the gallery
      const { data: existingPhotos } = await photoFunctions.getGalleryPhotos(photo.galleryId);
      const maxOrder = existingPhotos.length > 0 
        ? Math.max(...existingPhotos.map(p => p.order || 0)) 
        : 0;
      
      // Set the order to be one higher than the current max
      const photoWithOrder = {
        ...photo,
        order: maxOrder + 1,
        uploadedAt: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('photos')
        .insert([photoWithOrder])
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update a photo
  updatePhoto: async (photoId, updates) => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .update(updates)
        .eq('photoId', photoId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Delete a photo
  deletePhoto: async (photoId, filePath) => {
    try {
      // Delete the file from storage if filePath is provided
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('photos')
          .remove([filePath]);
        
        if (storageError) throw storageError;
      }
      
      // Delete the photo record
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('photoId', photoId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Delete all photos in a gallery
  deleteGalleryPhotos: async (galleryId) => {
    try {
      // Get all photos in the gallery
      const { data: photos } = await photoFunctions.getGalleryPhotos(galleryId);
      
      // Delete each photo and its file
      for (const photo of photos) {
        await photoFunctions.deletePhoto(photo.photoId, photo.filePath);
      }
      
      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Reorder photos in a gallery
  reorderPhotos: async (galleryId, photoOrders) => {
    try {
      // photoOrders should be an array of { photoId, order } objects
      const updates = photoOrders.map(({ photoId, order }) => ({
        photoId,
        order,
      }));
      
      // Update each photo's order
      for (const update of updates) {
        await photoFunctions.updatePhoto(update.photoId, { order: update.order });
      }
      
      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};

// Website settings related functions
export const websiteFunctions = {
  // Get website settings for a user
  getWebsiteSettings: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .eq('userId', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      
      // If no settings exist, return default settings
      if (!data) {
        return { 
          data: {
            userId,
            theme: {
              layout: '3col',
              primaryColor: '#667eea',
              accentColor: '#764ba2',
              backgroundColor: '#f8fafc'
            },
            customDomain: null,
            isPublished: false,
            publishedUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } 
        };
      }
      
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Update website settings
  updateWebsiteSettings: async (userId, updates) => {
    try {
      // Check if settings exist
      const { data: existingSettings } = await websiteFunctions.getWebsiteSettings(userId);
      
      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('website_settings')
          .update({
            ...updates,
            updatedAt: new Date().toISOString()
          })
          .eq('userId', userId)
          .select()
          .single();

        if (error) throw error;
        return { data };
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('website_settings')
          .insert([{
            userId,
            ...updates,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;
        return { data };
      }
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Publish website
  publishWebsite: async (userId) => {
    try {
      // Generate a published URL (in a real app, this would involve more complex logic)
      const publishedUrl = `https://petfolio.app/${userId}`;
      
      // Update the website settings
      const { data, error } = await supabase
        .from('website_settings')
        .update({
          isPublished: true,
          publishedUrl,
          updatedAt: new Date().toISOString()
        })
        .eq('userId', userId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Unpublish website
  unpublishWebsite: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .update({
          isPublished: false,
          updatedAt: new Date().toISOString()
        })
        .eq('userId', userId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};

