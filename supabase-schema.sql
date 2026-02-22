-- Portfolio Projects Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Create projects table with user relation
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Web', 'Mobile', 'Design')),
  tech TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  color_from TEXT DEFAULT 'from-primary/20',
  color_to TEXT DEFAULT 'to-accent/20',
  thumbnail_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);

-- Create index for featured projects
CREATE INDEX IF NOT EXISTS projects_featured_idx ON projects(featured) WHERE featured = true;

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own projects
CREATE POLICY "Users can view their own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own projects
CREATE POLICY "Users can insert their own projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own projects
CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Public can view featured projects (for the public portfolio page)
CREATE POLICY "Public can view featured projects"
  ON projects
  FOR SELECT
  USING (featured = true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for your user (replace with your actual user ID)
-- Your user ID: 13630e9d-2634-417e-9e15-a77632911c15
INSERT INTO projects (user_id, title, description, category, tech, live_url, github_url, color_from, color_to, featured)
VALUES 
  (
    '13630e9d-2634-417e-9e15-a77632911c15',
    'E-Commerce Platform',
    'A modern online store with real-time inventory, Stripe payments, and admin dashboard.',
    'Web',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    '#',
    '#',
    'from-primary/20',
    'to-accent/20',
    true
  ),
  (
    '13630e9d-2634-417e-9e15-a77632911c15',
    'Fitness Tracker App',
    'Cross-platform mobile app for tracking workouts, nutrition, and health metrics.',
    'Mobile',
    ARRAY['React Native', 'Firebase', 'TypeScript'],
    '#',
    '#',
    'from-accent/20',
    'to-primary/20',
    true
  ),
  (
    '13630e9d-2634-417e-9e15-a77632911c15',
    'SaaS Dashboard',
    'Analytics dashboard with real-time data visualization and team collaboration features.',
    'Web',
    ARRAY['Next.js', 'Tailwind', 'D3.js', 'Supabase'],
    '#',
    '#',
    'from-primary/30',
    'to-primary/5',
    true
  );
