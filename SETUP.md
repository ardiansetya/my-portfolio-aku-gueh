# Supabase Configuration

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Getting Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Database Setup

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL to create:
   - `projects` table with user relation
   - Row Level Security policies
   - Indexes for performance
   - Sample data for your user (ID: `13630e9d-2634-417e-9e15-a77632911c15`)

## User Authentication

The application is configured for your user with ID: `13630e9d-2634-417e-9e15-a77632911c15`

To login:
1. Navigate to `/login`
2. Use the credentials for your Supabase user

## Features

### Public Portfolio (`/`)
- Displays featured projects from Supabase
- Filter by category (Web, Mobile, Design)
- Links to live demo and GitHub

### Dashboard (`/dashboard`)
Protected area for managing your portfolio:

- **Overview** - Stats and recent projects
- **Projects** - CRUD operations for projects
  - Create new projects
  - Edit existing projects
  - Delete projects
  - Toggle featured status

## Project Data Structure

```typescript
interface Project {
  id: string;              // Auto-generated UUID
  user_id: string;         // Your user ID (foreign key)
  title: string;           // Project title
  description: string;     // Project description
  category: "Web" | "Mobile" | "Design";
  tech: string[];          // Array of technologies
  live_url: string | null; // Live demo URL
  github_url: string | null; // GitHub repository URL
  color_from: string;      // Gradient start color
  color_to: string;        // Gradient end color
  featured: boolean;       // Show on public portfolio
  created_at: timestamp;
  updated_at: timestamp;
}
```

## Row Level Security (RLS)

The database has the following security policies:

- **Users can view their own projects** - Authenticated users can only see their projects
- **Users can insert their own projects** - Users can create new projects
- **Users can update their own projects** - Users can edit their projects
- **Users can delete their own projects** - Users can remove their projects
- **Public can view featured projects** - Anyone can see featured projects on the public portfolio
