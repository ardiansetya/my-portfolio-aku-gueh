-- Migration: Add image_url column to projects table
-- Run this in your Supabase SQL Editor

-- Add image_url column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing projects with null image_url (optional: set a default gradient)
-- UPDATE projects SET image_url = NULL WHERE image_url IS NULL;

-- Storage Bucket Setup
-- Run this in Supabase Dashboard → Storage → New Bucket
-- Bucket name: project-images
-- Public: true (or false if you want RLS control)
-- Note: RLS is already enabled on storage.objects by Supabase

-- Storage RLS Policies (if bucket is private)
-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;

-- Allow authenticated users to upload images to their folder
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their images
CREATE POLICY "Users can update their images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their images
CREATE POLICY "Users can delete their images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public can view all images (for portfolio display)
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Optional: Allow authenticated users to list their own images
DROP POLICY IF EXISTS "Users can list their images" ON storage.objects;
CREATE POLICY "Users can list their images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
