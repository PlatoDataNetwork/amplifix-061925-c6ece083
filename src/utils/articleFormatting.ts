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
    .replace(/\*/g, "")
    // Normalize newlines and remove extra blank space/indentation
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+/gm, "")
    .trim();
};

/**
 * Formats article content with proper HTML structure, converting markdown-style
 * headings and bold text to HTML elements
 */
export const formatArticleContent = (text?: string | null): string => {
  if (!text) return "";
  let cleaned = text
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/\r\n/g, "\n");

  // Convert markdown-style headings (**Heading**) on their own line to <h2>
  cleaned = cleaned.replace(/^\s*\*\*(.+?)\*\*\s*$/gm, "<h2>$1</h2>");

  // Convert remaining bold markers to <strong>
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  
  // Make question headers bold (lines ending with ?)
  cleaned = cleaned.replace(/^\s*([A-Z][^?\n]+\?)\s*$/gm, "<h2>$1</h2>");
  
  // Make title-case section headers bold (lines with multiple capital letters, likely headers)
  cleaned = cleaned.replace(/^\s*([A-Z][A-Za-z\s]+(?:Prototypes|Features|Questions|Air|Dream)[A-Za-z\s]*)\s*$/gm, (match) => {
    // Don't double-wrap if already wrapped
    if (match.includes('<h2>') || match.includes('<strong>')) return match;
    // Check if it has multiple capital letters (likely a title)
    const capitalCount = (match.match(/[A-Z]/g) || []).length;
    if (capitalCount >= 3) {
      return `<h2>${match.trim()}</h2>`;
    }
    return match;
  });
  
  // Make numbered list headers bold ONLY (e.g., "1. Lightweight Design", "2. High-Resolution Displays")
  cleaned = cleaned.replace(/^(\d+\.\s+[A-Z][A-Za-z\s\-]+)\s*$/gm, "<strong>$1</strong>");

  // Normalize multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Remove leading indentation
  cleaned = cleaned.replace(/^[ \t]+/gm, "").trim();

  const paragraphs = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs
    .map((p) => {
      if (/^<h[1-6]\b|^<ul\b|^<ol\b|^<li\b|^<p\b|^<hr\b/i.test(p)) {
        return p;
      }
      return `<p>${p}</p>`;
    })
    .join("\n");
};

/**
 * Processes tags to show only first word and removes duplicates
 * Adds the vertical as the first tag if provided
 */
export const formatArticleTags = (
  tags: string[], 
  verticalSlug?: string | null,
  verticalDisplayName?: string
) => {
  const uniqueTags = new Set<string>();
  const allTags = [...tags];
  
  // Add vertical as first tag if it exists
  if (verticalSlug && verticalDisplayName) {
    allTags.unshift(verticalDisplayName);
  }
  
  return allTags
    .map((tag: string, index: number) => {
      const singleWord = tag.split(/[\s-]+/)[0];
      const lowerWord = singleWord.toLowerCase();
      
      // For the first tag (vertical), skip uniqueness check
      if (index === 0 && verticalSlug) {
        return {
          key: "vertical-tag",
          label: `#${verticalDisplayName}`,
          isVertical: true
        };
      }
      
      // Skip if we've already seen this word
      if (uniqueTags.has(lowerWord)) {
        return null;
      }
      
      uniqueTags.add(lowerWord);
      
      return {
        key: tag,
        label: `#${singleWord}`,
        isVertical: false
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};
