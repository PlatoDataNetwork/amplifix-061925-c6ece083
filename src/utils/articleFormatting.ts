import DOMPurify from 'dompurify';

/**
 * List of allowed semantic HTML tags for article content
 */
export const ALLOWED_HTML_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'div', 'span',
  'strong', 'b', 'em', 'i', 'u', 's', 'mark',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'figure', 'figcaption', 'img',
  'hr', 'sup', 'sub'
];

/**
 * Sanitizes HTML content using DOMPurify to prevent XSS attacks.
 * This should be used for any user-provided or externally-sourced HTML
 * that will be rendered with dangerouslySetInnerHTML.
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  // Extract YouTube/Vimeo iframes before sanitization (DOMPurify strips iframes by default)
  const iframePlaceholders: string[] = [];
  const SAFE_IFRAME_ORIGINS = ['https://www.youtube.com', 'https://youtube.com', 'https://player.vimeo.com', 'https://www.youtube-nocookie.com'];
  
  const htmlWithPlaceholders = html.replace(
    /<iframe\s[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/iframe>/gi,
    (match, src) => {
      const isSafe = SAFE_IFRAME_ORIGINS.some(origin => src.startsWith(origin));
      if (isSafe) {
        const index = iframePlaceholders.length;
        // Sanitize the src URL by encoding dangerous characters
        const safeSrc = src.replace(/["<>]/g, '');
        iframePlaceholders.push(
          `<iframe src="${safeSrc}" width="100%" height="400" frameborder="0" allowfullscreen loading="lazy" style="aspect-ratio:16/9;width:100%;border-radius:12px;"></iframe>`
        );
        return `<div data-iframe-placeholder="${index}"></div>`;
      }
      return ''; // Strip unsafe iframes
    }
  );

  const sanitized = DOMPurify.sanitize(htmlWithPlaceholders, {
    ALLOWED_TAGS: ALLOWED_HTML_TAGS,
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style', 'width', 'height', 'data-iframe-placeholder'],
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });
  
  // Re-insert safe iframes
  return sanitized.replace(/<div data-iframe-placeholder="(\d+)"><\/div>/g, (_, index) => {
    return iframePlaceholders[parseInt(index)] || '';
  });
};

/**
 * Sanitizes article text by removing unwanted content while preserving semantic HTML tags
 */
export const sanitizeText = (text?: string | null): string => {
  if (!text) return "";
  return text
    // Remove inline styles and scripts
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    // Remove standalone URLs (not in anchor tags)
    .replace(/(?<![">])https?:\/\/\S+(?![^<]*<\/a>)/gi, "")
    // Remove markdown links
    .replace(/\[.*?\]\(.*?\)/g, "")
    // Clean up source/link labels
    // Preserve "Source:" labels in article content
    .replace(/(?<![a-zA-Z])Link:?:?\s*/gi, "")
    // Remove horizontal rules made of dashes
    .replace(/---/g, "")
    // Convert markdown bold to strong
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Convert markdown italic to em
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Remove div tags (keep content) but preserve span tags
    .replace(/<\/?(div)[^>]*>/gi, "")
    // Convert br tags to newlines for processing
    .replace(/<br\s*\/?>/gi, "\n")
    // Normalize line endings
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+/gm, "")
    .trim();
};

/**
 * Strips all HTML tags for plain text extraction
 */
export const stripHtmlTags = (text?: string | null): string => {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Formats article content with minimal spacing and clear section headers
 * Each non-empty line becomes its own paragraph with proper list handling
 */
export const formatExternalArticleContent = (text?: string | null): string => {
  if (!text) return "";

  let cleaned = text.trim();
  
  // Then apply standard sanitization
  cleaned = sanitizeText(cleaned);
  const lines = cleaned.split("\n");
  const htmlParts: string[] = [];
  let inUnorderedList = false;
  let inOrderedList = false;

  const closeLists = () => {
    if (inUnorderedList) {
      htmlParts.push("</ul>");
      inUnorderedList = false;
    }
    if (inOrderedList) {
      htmlParts.push("</ol>");
      inOrderedList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      // Blank line: end any open lists but don't create empty paragraphs
      closeLists();
      continue;
    }

    const bulletMatch = line.match(/^[-•]\s+(.*)/);
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)/);

    if (bulletMatch) {
      if (!inUnorderedList) {
        closeLists();
        htmlParts.push("<ul>");
        inUnorderedList = true;
      }
      htmlParts.push(`<li>${bulletMatch[1].trim()}</li>`);
      continue;
    }

    if (orderedMatch) {
      if (!inOrderedList) {
        closeLists();
        htmlParts.push("<ol>");
        inOrderedList = true;
      }
      htmlParts.push(`<li>${orderedMatch[2].trim()}</li>`);
      continue;
    }

    // Regular line: close any lists and start a new paragraph
    closeLists();
    htmlParts.push(`<p>${line}</p>`);
  }

  closeLists();

  return htmlParts.join("\n");
};

/**
 * Standard article content CSS classes for consistent formatting
 * Handles all semantic HTML tags with proper spacing and styling
 */
export const ARTICLE_CONTENT_CLASSES = `
  text-foreground leading-relaxed
  [&>p]:mb-4 [&>p]:leading-relaxed
  [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:leading-tight
  [&>h2]:mt-8 [&>h2]:mb-6 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:leading-tight
  [&>h3]:mt-6 [&>h3]:mb-4 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:leading-tight
  [&>h4]:mt-5 [&>h4]:mb-3 [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:leading-tight
  [&>h5]:mt-4 [&>h5]:mb-2 [&>h5]:text-lg [&>h5]:font-semibold [&>h5]:leading-tight
  [&>h6]:mt-4 [&>h6]:mb-2 [&>h6]:text-base [&>h6]:font-semibold [&>h6]:leading-tight
  [&>strong]:font-bold [&>b]:font-bold
  [&>em]:italic [&>i]:italic
  [&>u]:underline
  [&>s]:line-through
  [&>mark]:bg-primary/20 [&>mark]:px-1 [&>mark]:rounded
  [&>ul]:my-4 [&>ul]:pl-6 [&>ul]:list-disc [&>ul]:space-y-2
  [&>ol]:my-4 [&>ol]:pl-6 [&>ol]:list-decimal [&>ol]:space-y-2
  [&>li]:leading-relaxed
  [&>blockquote]:my-4 [&>blockquote]:pl-4 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/50 [&>blockquote]:italic [&>blockquote]:text-muted-foreground
  [&>pre]:my-4 [&>pre]:p-4 [&>pre]:bg-muted [&>pre]:rounded-lg [&>pre]:overflow-x-auto
  [&>code]:px-1 [&>code]:py-0.5 [&>code]:bg-muted [&>code]:rounded [&>code]:text-sm [&>code]:font-mono
  [&>a]:text-primary [&>a]:underline [&>a]:hover:text-primary/80
  [&>table]:my-4 [&>table]:w-full [&>table]:border-collapse
  [&>table_th]:border [&>table_th]:border-border [&>table_th]:p-2 [&>table_th]:bg-muted [&>table_th]:font-semibold
  [&>table_td]:border [&>table_td]:border-border [&>table_td]:p-2
  [&>figure]:my-4
  [&>figcaption]:text-sm [&>figcaption]:text-muted-foreground [&>figcaption]:mt-2 [&>figcaption]:text-center
  [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg
  [&>hr]:my-8 [&>hr]:border-border
  [&>sup]:text-xs [&>sup]:align-super
  [&>sub]:text-xs [&>sub]:align-sub
`.replace(/\s+/g, ' ').trim();

/**
 * Processes tags to show only first word and removes duplicates
 * Adds the vertical as the first tag if provided
 */
export const formatArticleTags = (
  tags: string[], 
  verticalSlug?: string | null,
  verticalDisplayName?: string
) => {
  const maxTags = 8;
  const normalizedTags = Array.isArray(tags) ? [...tags] : [];
  const result: { key: string; label: string; isVertical: boolean }[] = [];

  // Optionally add vertical as the first related topic
  if (verticalSlug && verticalDisplayName) {
    result.push({
      key: "vertical-tag",
      label: `#${verticalDisplayName}`,
      isVertical: true,
    });
  }

  const seen = new Set<string>();

  for (const rawTag of normalizedTags) {
    const tag = (rawTag || "").trim();
    if (!tag) continue;

    const lower = tag.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);

    result.push({
      key: tag,
      label: `#${tag}`,
      isVertical: false,
    });

    if (result.length >= maxTags) break;
  }

  // Ensure we never exceed the visual tag limit
  return result.slice(0, maxTags);
};
