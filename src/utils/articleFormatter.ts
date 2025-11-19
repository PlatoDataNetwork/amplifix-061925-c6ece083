// Utility functions for formatting external articles
// Shared between pages to keep formatting logic consistent

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

  // Remove specific unwanted introductory text
  cleaned = cleaned.replace(
    /While Pimax has not yet released the full technical specifications of the Dream Air, the prototypes showcased during the unveiling event highlight several innovative features:\s*/gi,
    "",
  );

  // Convert markdown-style headings (**Heading**) on their own line to headers
  cleaned = cleaned.replace(/^\s*\*\*(.+?)\*\*\s*$/gm, "###HEADER###$1###ENDHEADER###");

  // Convert remaining bold markers to <strong>
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Make question headers (lines ending with ?)
  cleaned = cleaned.replace(/^\s*([A-Z][^?\n]+\?)\s*$/gm, "###HEADER###$1###ENDHEADER###");

  // Make title-case section headers
  cleaned = cleaned.replace(
    /^\s*([A-Z][A-Za-z\s]+(?:Prototypes|Features|Questions|Air|Dream)[A-Za-z\s]*)\s*$/gm,
    (match) => {
      if (match.includes("###HEADER###")) return match;
      const capitalCount = (match.match(/[A-Z]/g) || []).length;
      if (capitalCount >= 3) {
        return `###HEADER###${match.trim()}###ENDHEADER###`;
      }
      return match;
    },
  );

  // Mark numbered list headers
  cleaned = cleaned.replace(/^(\d+\.\s+[A-Z][A-Za-z\s\-]+)\s*$/gm, "###NUMHEADER###$1###ENDNUMHEADER###");

  // Normalize multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Remove leading indentation
  cleaned = cleaned.replace(/^[ \t]+/gm, "").trim();

  const paragraphs = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const result: string[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const current = paragraphs[i];
    const isHeader = current.includes("###HEADER###");
    const isNumHeader = current.includes("###NUMHEADER###");

    if ((isHeader || isNumHeader) && i + 1 < paragraphs.length) {
      const headerText = current.replace(/###(NUM)?HEADER###/g, "").replace(/###END(NUM)?HEADER###/g, "");
      const body = paragraphs[i + 1];
      const spacing = i > 0 ? " class='mt-12'" : "";
      result.push(`<div${spacing}><div class='text-xl font-bold mb-0'>${headerText}</div><p class='mt-2'>${body}</p></div>`);
      i++; // Skip next paragraph as it's merged
    } else if (isHeader || isNumHeader) {
      const headerText = current.replace(/###(NUM)?HEADER###/g, "").replace(/###END(NUM)?HEADER###/g, "");
      const spacing = i > 0 ? " class='mt-12'" : "";
      result.push(`<div${spacing}><div class='text-xl font-bold'>${headerText}</div></div>`);
    } else {
      result.push(`<p>${current}</p>`);
    }
  }

  return result.join("\n");
};
