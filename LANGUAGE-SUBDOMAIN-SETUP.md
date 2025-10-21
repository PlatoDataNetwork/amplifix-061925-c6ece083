# Language Subdomain Setup Guide

## Overview
Your site now uses **subdomain-based language routing** instead of path-based routing.

**Examples:**
- Arabic: `ar.amplifix.net`
- Spanish: `es.amplifix.net`
- French: `fr.amplifix.net`
- English: `www.amplifix.net` (default)

## DNS Configuration Required

To make this work in production, you need to configure **wildcard DNS** for your domain:

### Step 1: Add Wildcard DNS Record

In your DNS provider (GoDaddy, Cloudflare, etc.), add this record:

```
Type: A
Name: *
Value: [Your hosting IP address]
TTL: Auto or 3600
```

This allows all subdomains (ar, es, fr, de, etc.) to point to your hosting.

### Step 2: Add WWW Record (if not already present)

```
Type: A
Name: www
Value: [Your hosting IP address]
TTL: Auto or 3600
```

### Step 3: Verify DNS Propagation

After adding records, use these tools to verify:
- https://dnschecker.org
- `nslookup ar.amplifix.net`
- `ping es.amplifix.net`

**Note:** DNS propagation can take 24-48 hours.

## How It Works

### 1. Automatic Language Detection
When a user visits a language subdomain (e.g., `ar.amplifix.net`), the app:
- Detects the language from the subdomain
- Automatically translates the page content
- Saves the language preference

### 2. Language Switcher
The language switcher now **redirects** to appropriate subdomains:
- Selecting "Arabic" → redirects to `ar.amplifix.net`
- Selecting "English" → redirects to `www.amplifix.net`

### 3. Development/Testing
During local development:
- Language detection uses URL query parameters
- Example: `localhost:3000?lang=ar`
- No DNS configuration needed for testing

## SEO Benefits

All sitemaps have been updated to reflect subdomain structure:
- `sitemap-index.xml` → Points to language-specific sitemaps
- `sitemap-ar.xml` → Arabic pages at `ar.amplifix.net`
- `sitemap-es.xml` → Spanish pages at `es.amplifix.net`
- etc.

**hreflang tags** are automatically included for proper SEO across languages.

## Files Modified

1. **src/utils/subdomain.ts** - New utility for subdomain detection
2. **src/components/LanguageSwitcher.tsx** - Updated to redirect to subdomains
3. **public/sitemap-*.xml** - All sitemaps updated with subdomain URLs
4. **public/sitemap-index.xml** - Main sitemap index updated

## Hosting Configuration

### Vercel (Already Configured)
Your `vercel.json` is already set up to handle all routes correctly.

### Other Hosting Providers
If using Apache, your `.htaccess` file is already configured.
For Nginx, ensure your server block handles all subdomains:

```nginx
server {
    server_name *.amplifix.net amplifix.net;
    # ... rest of your config
}
```

## Testing Checklist

- [ ] Add wildcard DNS record
- [ ] Add www DNS record  
- [ ] Wait for DNS propagation (24-48h)
- [ ] Test `ar.amplifix.net` - should show Arabic
- [ ] Test `es.amplifix.net` - should show Spanish
- [ ] Test `www.amplifix.net` - should show English
- [ ] Verify language switcher redirects work
- [ ] Check sitemap URLs in Google Search Console

## Troubleshooting

**Problem:** Subdomain not working after DNS update
- **Solution:** Wait 24-48 hours for full DNS propagation
- Check DNS with `nslookup ar.amplifix.net`

**Problem:** SSL certificate error on subdomains
- **Solution:** Most hosts auto-provision SSL for wildcards
- Contact your hosting provider if needed

**Problem:** Local development not detecting language
- **Solution:** Use query parameter: `localhost:3000?lang=ar`

## Support

For questions about this setup, check:
- Your DNS provider documentation
- Your hosting provider support
- Web browser console for any errors
