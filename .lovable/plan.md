

# Plan: Port PlatoData Management System to AmplifiX

## Overview
Replace the current simple `/management` page with PlatoData's full admin management system, including 14 admin components, 4 settings components, 8 edge functions, missing database tables, and a new hook.

## What Changes

### 1. Upgrade `useAuth` hook (modify `src/hooks/useAuth.ts`)
PlatoData's Management.tsx expects `useAuth()` to return `{ user, isAdmin, isLoading, signOut }` as a React Context. The current hook is a simple non-context hook without `isAdmin`. 

**Approach**: Convert to Context pattern (AuthProvider + useAuth) matching PlatoData's version, with `isAdmin` built in via `has_role` RPC. Update `src/App.tsx` to wrap the app in `<AuthProvider>`. Update `AdminRoute.tsx` to use the new `isAdmin` from `useAuth` instead of the separate `useAdminCheck` hook.

### 2. Create 14 admin component files (new files, no conflicts)
Copy from PlatoData `src/components/admin/`:
- `AdminSidebar.tsx`
- `AnalyticsDashboard.tsx`
- `ArticleEditor.tsx`
- `ArticleManagement.tsx`
- `BatchImageResizer.tsx`
- `DefaultFeaturedImages.tsx`
- `FeedSyncLogs.tsx`
- `FeedsSyndicator.tsx`
- `ImageUpload.tsx`
- `OGImageGenerator.tsx`
- `RichTextEditor.tsx`
- `SocialPreviewDebugger.tsx`
- `TagsManagement.tsx`
- `VerticalsManagement.tsx`

None of these conflict with existing files in `src/components/admin/`.

### 3. Create 4 settings component files (new directory)
Copy from PlatoData `src/components/admin/settings/`:
- `GeneralSettings.tsx`
- `AnalyticsSettings.tsx`
- `SitemapsSettings.tsx`
- `RobotsSettings.tsx`

### 4. Replace `src/pages/Management.tsx`
Replace with PlatoData's version (adapted to use this project's brand name "AmplifiX" instead of "Platodata").

### 5. Add `src/hooks/useSiteSettings.ts`
Copy from PlatoData, update default values from "Platodata" to "AmplifiX".

### 6. Delete old management components
- `src/components/management/ManagementSidebar.tsx`
- `src/components/management/DashboardView.tsx`

### 7. Create 8 edge functions
Copy from PlatoData: `articles-api`, `generate-og-image`, `robots-txt`, `rss-feed`, `json-feed`, `sitemap-xsl`, `ga-realtime`, `migrate-articles`. Add entries to `supabase/config.toml`.

### 8. Database migrations
Create missing tables and functions:

**Tables:**
- `site_settings` (key/value store for site configuration) with admin-only RLS
- `default_featured_images` (pool of fallback images) with admin-only write, public read RLS

**Functions:**
- `get_article_verticals()` — returns distinct vertical slugs from articles
- `get_user_roles()` — returns roles for a given user

The `has_role` function, `app_role` enum, `article_translations`, and `translations` tables already exist. The `article-images` storage bucket already exists and is public.

### 9. Install TipTap dependencies
Add: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`

## Technical Details

### Auth refactor
The current `useAuth` returns `{ user, session, loading, signIn, signUp, signOut }`. The new version wraps this in a React Context and adds `isAdmin` (checked via `supabase.rpc('has_role', ...)`). The property name changes from `loading` to `isLoading`. All existing consumers of `useAuth` will need minor updates.

### Files affected summary
- **New files**: 14 admin components + 4 settings components + 1 hook + 8 edge functions = 27 new files
- **Modified files**: `Management.tsx`, `useAuth.ts`, `AdminRoute.tsx`, `App.tsx`, `config.toml`
- **Deleted files**: `ManagementSidebar.tsx`, `DashboardView.tsx`

### Database changes
```sql
-- site_settings table
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- default_featured_images table
CREATE TABLE public.default_featured_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  filename text,
  created_at timestamptz DEFAULT now()
);

-- get_article_verticals function
CREATE OR REPLACE FUNCTION public.get_article_verticals()
RETURNS TABLE(vertical_slug text, article_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT vertical_slug, COUNT(*) FROM articles GROUP BY vertical_slug ORDER BY article_count DESC; $$;
```

RLS policies: admin-only CRUD on `site_settings`, admin-only write + public read on `default_featured_images`.

### No existing admin routes touched
All `/admin/*` routes and existing admin components remain untouched.

