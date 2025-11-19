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

  // Convert markdown-style headings (**Heading**) on their own line to <h2>
  cleaned = cleaned.replace(/^\s*\*\*(.+?)\*\*\s*$/gm, "<h2>$1</h2>");

  // Convert remaining bold markers to <strong>
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Make question headers bold (lines ending with ?)
  cleaned = cleaned.replace(/^\s*([A-Z][^?\n]+\?)\s*$/gm, "<h2>$1</h2>");

  // Make title-case section headers bold (lines with multiple capital letters, likely headers)
  cleaned = cleaned.replace(
    /^\s*([A-Z][A-Za-z\s]+(?:Prototypes|Features|Questions|Air|Dream)[A-Za-z\s]*)\s*$/gm,
    (match) => {
      if (match.includes("<h2>") || match.includes("<strong>")) return match;
      const capitalCount = (match.match(/[A-Z]/g) || []).length;
      if (capitalCount >= 3) {
        return `<h2>${match.trim()}</h2>`;
      }
      return match;
    },
  );

  // Make numbered list headers bold ONLY
  cleaned = cleaned.replace(/^(\d+\.\s+[A-Z][A-Za-z\s\-]+)\s*$/gm, "<strong>$1</strong>");

  // Normalize multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Remove leading indentation
  cleaned = cleaned.replace(/^[ \t]+/gm, "").trim();

  const paragraphs = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const mergedParagraphs: string[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const current = paragraphs[i];
    const isNumberedHeading = /^<strong\b[^>]*>\d+\.\s+[^<]+<\/strong>$/.test(current);
    const isH2Header = /^<h2\b[^>]*>[^<]+<\/h2>$/.test(current);
    const isAnyHeading = isNumberedHeading || isH2Header;

    if (isAnyHeading && i + 1 < paragraphs.length) {
      const body = paragraphs[i + 1];
      // Add consistent spacing above all sections except the first
      const spacing = i > 0 ? " style='margin-top: 3rem !important;'" : "";
      mergedParagraphs.push(`<p${spacing}><strong>${current.replace(/<\/?strong>/g, "").replace(/<\/?h2>/g, "")}</strong><br/>${body}</p>`);
      i++;
    } else {
      mergedParagraphs.push(current);
    }
  }

  return mergedParagraphs
    .map((p) => {
      if (/^<h[1-6]\b|^<ul\b|^<ol\b|^<li\b|^<p\b|^<hr\b/i.test(p)) {
        return p;
      }
      return `<p>${p}</p>`;
    })
    .join("\n");
};
