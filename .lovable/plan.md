

# Create `export-articles` Edge Function

## Overview
Create a new Supabase Edge Function that exports articles with their translations and tags as JSON, secured by an API key. This enables data migration between Supabase projects.

## What will be built

### 1. Edge Function: `export-articles`
A GET endpoint that exports articles from the database in paginated JSON format.

**Security**: Validated via `X-API-Key` header against a `PLATOAI_KEY` secret.

**Query Parameters**:
- `vertical` -- which vertical to export (default: `artificial-intelligence`)
- `page` / `page_size` -- pagination (default: 1 / 1000, max page_size: 2000)
- `count_only` -- returns just the count and suggested pages
- `include_tags` -- include tags data (default: true)
- `include_translations` -- include translations data (default: true)

**Response modes**:
- Count only: `{ vertical, total, suggested_pages, page_size }`
- Full export: `{ articles, translations?, tags?, article_tags?, meta: { ... } }` with a `Content-Disposition` header for download

### 2. Configuration
- Add `verify_jwt = false` to `supabase/config.toml` (API key auth is handled in code)
- CORS headers will include `x-api-key`

### 3. Secret Setup
- Will prompt you to add the `PLATOAI_KEY` secret for API key validation

## Technical Details

**Files to create/modify**:
- `supabase/functions/export-articles/index.ts` -- new edge function
- `supabase/config.toml` -- add function config entry

**Implementation approach**:
- Uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS
- Fetches articles filtered by `vertical_slug`, ordered by `published_at` desc
- Uses `.range()` for pagination
- Batches translation/tag lookups in chunks of 500 article IDs
- Returns complete count via a separate count query for accurate pagination

**Testing**: After deployment, test with:
```
curl -H "X-API-Key: YOUR_KEY" \
  "https://rfkdcmvzvxcsoecoeddi.supabase.co/functions/v1/export-articles?vertical=artificial-intelligence&count_only=true"
```

