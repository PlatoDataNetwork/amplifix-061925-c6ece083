
# Plan: Create Management Dashboard Page

## Overview
Create a new `/management` page that provides a consolidated admin dashboard with collapsible sidebar navigation. This page will serve as an alternative entry point to the existing admin tools, accessible via a link in the user dropdown menu (visible only to admin users).

---

## What Will Be Built

### 1. New Management Page (`/management`)
A self-contained admin hub with:
- Collapsible sidebar navigation (using existing shadcn sidebar components)
- View-based navigation (switching content without URL changes)
- Quick stats cards (Total Articles, Verticals, Users, RSS Feeds)
- Access to all existing admin tools through the sidebar

### 2. Sidebar Menu Structure
```text
+---------------------------+
| AmplifiX Management       |
|  [Collapse Toggle]        |
+---------------------------+
| Dashboard                 |
+---------------------------+
| Content                   |
|   > All Articles          |
|   > Article Editor        |
|   > Article Formatter     |
|   > Article Backups       |
|   > Article Comparison    |
+---------------------------+
| Import                    |
|   > Import Dashboard      |
|   > Bulk Import           |
|   > Plato Import          |
+---------------------------+
| Settings                  |
|   > User Management       |
|   > Showcase Manager      |
|   > Sitemap Generator     |
|   > Translations          |
+---------------------------+
| Analytics                 |
|   > Intel Stats           |
|   > Google Analytics      |
|   > CRM                   |
|   > Security Dashboard    |
+---------------------------+
| [User Email]              |
| [Sign Out]                |
+---------------------------+
```

### 3. User Dropdown Menu Update
Add "Management" link to the existing user dropdown in `MainHeader.tsx` (visible only for admin users)

---

## Technical Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Management.tsx` | Main management dashboard page with sidebar and content area |
| `src/components/management/ManagementSidebar.tsx` | Collapsible sidebar navigation component |
| `src/components/management/DashboardView.tsx` | Dashboard home view with quick stats |

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add `/management` route wrapped in `AdminRoute` |
| `src/components/MainHeader.tsx` | Add "Management" link to user dropdown (admin-only) |

### Component Architecture

```text
Management.tsx
├── SidebarProvider
│   ├── ManagementSidebar.tsx
│   │   ├── SidebarHeader (logo + collapse trigger)
│   │   ├── SidebarContent
│   │   │   ├── SidebarGroup (Dashboard)
│   │   │   ├── SidebarGroup (Content) with Collapsible sub-items
│   │   │   ├── SidebarGroup (Import) with Collapsible sub-items
│   │   │   ├── SidebarGroup (Settings) with Collapsible sub-items
│   │   │   └── SidebarGroup (Analytics) with Collapsible sub-items
│   │   └── SidebarFooter (user info + sign out)
│   └── SidebarInset (main content area)
│       └── [Dynamic View based on currentView state]
```

### View State Management
The Management page uses internal state (`currentView`) to switch between different admin sections. Each view either:
- Embeds an existing component inline (for simpler tools)
- Uses an iframe or redirect for complex pages

### Views Mapping

| View Key | Component/Action |
|----------|-----------------|
| `dashboard` | `<DashboardView />` (new component with stats) |
| `articles` | Navigate to `/admin/articles` |
| `article-editor` | Navigate to `/admin/articles` |
| `article-formatter` | Navigate to `/admin/articles/format` |
| `article-backups` | Navigate to `/admin/articles/backups` |
| `article-comparison` | Navigate to `/admin/articles/comparison` |
| `import-dashboard` | Navigate to `/admin/import` |
| `bulk-import` | Navigate to `/admin/bulk-import` |
| `plato-import` | Navigate to `/admin/plato-import` |
| `users` | Navigate to `/admin/users` |
| `showcase` | Navigate to `/admin/showcase` |
| `sitemaps` | Navigate to `/admin/sitemaps` |
| `translations` | Navigate to `/admin/translations/manager` |
| `intel-stats` | Navigate to `/admin/intel-stats` |
| `analytics` | Navigate to `/admin/analytics` |
| `crm` | Navigate to `/admin/crm` |
| `security` | Navigate to `/admin/security` |

---

## Implementation Approach

### Phase 1: Create Core Components
1. Create `ManagementSidebar.tsx` with collapsible groups
2. Create `DashboardView.tsx` with quick stats
3. Create `Management.tsx` page with sidebar layout

### Phase 2: Wire Up Navigation
1. Sidebar menu items navigate to existing admin pages using `useNavigate`
2. Dashboard view shows aggregated stats from database

### Phase 3: Update Header Dropdown
1. Import `useAdminCheck` hook in `MainHeader.tsx`
2. Add conditional "Management" menu item before "Sign Out"

### Phase 4: Add Route
1. Register `/management` route in `App.tsx` wrapped with `AdminRoute`

---

## Key Features

### Sidebar Behavior
- **Collapsible**: Click trigger to collapse to icon-only mode
- **Keyboard shortcut**: Ctrl/Cmd + B to toggle
- **Mobile**: Slides in as a sheet
- **Persistent state**: Remembers collapsed/expanded via cookie

### Admin-Only Access
- Route protected by `AdminRoute` component
- Dropdown link only visible if `useAdminCheck` returns `isAdmin: true`

### Styling
- Uses existing shadcn sidebar components
- Matches current dark/light theme
- Consistent with existing admin pages styling

---

## No Database Changes Required
This feature uses existing tables and RLS policies. No migrations needed.
