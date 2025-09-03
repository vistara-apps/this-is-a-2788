-- Create users table
CREATE TABLE users (
  userId UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  subscriptionTier TEXT NOT NULL DEFAULT 'free',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create galleries table
CREATE TABLE galleries (
  galleryId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE photos (
  photoId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  galleryId UUID NOT NULL REFERENCES galleries(galleryId) ON DELETE CASCADE,
  imageUrl TEXT NOT NULL,
  filePath TEXT,
  caption TEXT,
  order INTEGER NOT NULL DEFAULT 0,
  uploadedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create website_settings table
CREATE TABLE website_settings (
  userId UUID PRIMARY KEY REFERENCES users(userId) ON DELETE CASCADE,
  theme JSONB NOT NULL DEFAULT '{"layout": "3col", "primaryColor": "#667eea", "accentColor": "#764ba2", "backgroundColor": "#f8fafc"}',
  customDomain TEXT,
  isPublished BOOLEAN NOT NULL DEFAULT FALSE,
  publishedUrl TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_history table
CREATE TABLE subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
  stripeCustomerId TEXT,
  stripeSubscriptionId TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  startDate TIMESTAMP WITH TIME ZONE,
  endDate TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = userId);

-- Galleries table policies
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own galleries"
  ON galleries FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can create their own galleries"
  ON galleries FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own galleries"
  ON galleries FOR UPDATE
  USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own galleries"
  ON galleries FOR DELETE
  USING (auth.uid() = userId);

-- Photos table policies
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view photos in their galleries"
  ON photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.galleryId = photos.galleryId
      AND galleries.userId = auth.uid()
    )
  );

CREATE POLICY "Users can insert photos in their galleries"
  ON photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.galleryId = photos.galleryId
      AND galleries.userId = auth.uid()
    )
  );

CREATE POLICY "Users can update photos in their galleries"
  ON photos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.galleryId = photos.galleryId
      AND galleries.userId = auth.uid()
    )
  );

CREATE POLICY "Users can delete photos in their galleries"
  ON photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.galleryId = photos.galleryId
      AND galleries.userId = auth.uid()
    )
  );

-- Website settings table policies
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own website settings"
  ON website_settings FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can update their own website settings"
  ON website_settings FOR UPDATE
  USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own website settings"
  ON website_settings FOR INSERT
  WITH CHECK (auth.uid() = userId);

-- Subscription history table policies
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription history"
  ON subscription_history FOR SELECT
  USING (auth.uid() = userId);

-- Storage policies
-- Create a bucket for photo uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload photos to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    (bucket_id = 'photos') AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update and delete their own photos
CREATE POLICY "Users can update and delete their own photos"
  ON storage.objects FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    (bucket_id = 'photos') AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    (bucket_id = 'photos') AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public access to photos
CREATE POLICY "Public can view photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

-- Create a trigger to update the updatedAt field
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updatedAt = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_galleries_updated_at
  BEFORE UPDATE ON galleries
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_website_settings_updated_at
  BEFORE UPDATE ON website_settings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_subscription_history_updated_at
  BEFORE UPDATE ON subscription_history
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

