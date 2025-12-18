/**
 * Converts a string to a URL-friendly slug
 * Example: "How Cannabis Can Turn Snow Days Into Cozy Winter Rituals" 
 *       -> "how-cannabis-can-turn-snow-days-into-cozy-winter-rituals"
 */
export function slugify(text: string): string {
  return text
    // Decode HTML entities first
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, "-")
    .replace(/&ndash;/g, "-")
    // Convert to lowercase
    .toLowerCase()
    // Remove special characters and replace with spaces
    .replace(/[^\w\s-]/g, ' ')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s_]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit slug length to prevent overly long URLs
    .substring(0, 100)
    // Remove trailing hyphen if we cut mid-word
    .replace(/-+$/, '');
}

/**
 * Generates an article URL with slug
 * Format: /intel/{slug}-{id}
 */
export function generateArticleUrl(title: string, id: string | number, langPrefix: string = ''): string {
  const slug = slugify(title);
  return `${langPrefix}/intel/${slug}-${id}`;
}

/**
 * Extracts the article ID from a slug-based URL parameter
 * Handles formats like: "how-cannabis-can-turn-snow-days-4599552" -> "4599552"
 * Also handles plain IDs: "4599552" -> "4599552"
 */
export function extractIdFromSlug(slugWithId: string): string {
  // If it's just a number, return as-is
  if (/^\d+$/.test(slugWithId)) {
    return slugWithId;
  }
  
  // If it's a UUID, return as-is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugWithId)) {
    return slugWithId;
  }
  
  // Extract the ID from the end of the slug (e.g., "some-title-123456" -> "123456")
  const match = slugWithId.match(/-(\d+)$/);
  if (match) {
    return match[1];
  }
  
  // Fallback: return the original string
  return slugWithId;
}
