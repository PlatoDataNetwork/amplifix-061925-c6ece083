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

  const cleaned = sanitizeText(text);
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
 * - Large, bold section headers (h2: text-4xl, h3: text-2xl)
 * - Minimal margins on headers (mt-1, mb-0)
 * - Tight list spacing (my-1, space-y-1)
 */
export const ARTICLE_CONTENT_CLASSES = "text-foreground leading-relaxed [&>p]:mb-4 [&>p]:leading-relaxed [&>h2]:mt-4 [&>h2]:mb-2 [&>h2]:text-4xl [&>h2]:font-bold [&>h2]:leading-tight [&>h3]:mt-3 [&>h3]:mb-2 [&>h3]:text-2xl [&>h3]:font-bold [&>strong]:mt-2 [&>strong]:mb-0 [&>strong]:block [&>ul]:my-1 [&>ul]:space-y-1 [&>ol]:my-1 [&>ol]:space-y-1";

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
