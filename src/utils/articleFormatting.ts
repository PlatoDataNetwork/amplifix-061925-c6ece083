/**
 * Sanitizes article text by removing HTML links, URLs, markdown links,
 * and cleaning up formatting artifacts
 */
export const sanitizeText = (text?: string | null): string => {
  if (!text) return "";
  return text
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/<\/?(p|div|span|strong|em|ul|ol|li|h[1-6])[^>]*>/gi, "")
    .replace(/<br\s*\/?>(?!\n)/gi, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+/gm, "")
    .trim();
};

/**
 * Formats article content with minimal spacing and clear section headers
 * Each non-empty line becomes its own paragraph with proper list handling
 */
export const formatExternalArticleContent = (text?: string | null): string => {
  if (!text) return "";

  // First, remove Plato source links and other metadata
  let cleaned = text
    .replace(/<ul class="plato-post-bottom-links">[\s\S]*?<\/ul>/gi, '')
    .replace(/<div class="plato-post-bottom-links">[\s\S]*?<\/div>/gi, '')
    .replace(/Source Link:[\s\S]*?<\/a>/gi, '')
    .trim();
  
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
 * - Double line spacing between paragraphs (mb-4)
 * - Large, bold section headers with extra spacing below (h2: text-4xl, mb-6)
 * - Adequate margins on headers for separation
 * - Tight list spacing (my-1, space-y-1)
 */
export const ARTICLE_CONTENT_CLASSES = "text-foreground leading-relaxed [&>p]:mb-4 [&>p]:leading-relaxed [&>h2]:mt-8 [&>h2]:mb-6 [&>h2]:text-4xl [&>h2]:font-bold [&>h2]:leading-tight [&>h3]:mt-6 [&>h3]:mb-4 [&>h3]:text-2xl [&>h3]:font-bold [&>strong]:mt-2 [&>strong]:mb-0 [&>strong]:block [&>ul]:my-1 [&>ul]:space-y-1 [&>ol]:my-1 [&>ol]:space-y-1";

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
