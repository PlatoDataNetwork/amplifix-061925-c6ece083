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
 * Formats article content with clean, simple paragraph structure
 * matching Kedalion-style formatting
 */
export const formatArticleContent = (text?: string | null): string => {
  if (!text) return "";
  
  // Clean up links, URLs, and unwanted markers
  let cleaned = text
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove all markdown bold
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n") // Normalize blank lines
    .replace(/^[ \t]+/gm, "") // Remove indentation
    .trim();

  // Split into paragraphs and wrap each in <p> tags
  const paragraphs = cleaned
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("\n\n");
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
