export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Convert a heading string into a URL-friendly slug ID
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // remove markdown syntax like links, formatting, code ticks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#]/g, '')
    // replace non-alphanumeric chars with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract H2 and H3 headings from blog post content (string or array of strings)
 */
export function extractHeadings(content: string | string[]): TocItem[] {
  const lines: string[] = [];

  if (Array.isArray(content)) {
    for (const item of content) {
      if (typeof item === 'string') {
        lines.push(...item.split('\n'));
      }
    }
  } else if (typeof content === 'string') {
    lines.push(...content.split('\n'));
  }

  const headings: TocItem[] = [];
  const existingIds = new Map<string, number>();

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Check markdown H2 (## ) and H3 (### )
    const h3Match = line.match(/^###\s+(.+)$/);
    const h2Match = !h3Match ? line.match(/^##\s+(.+)$/) : null;

    // Check HTML <h2...> and <h3...> tags if any
    const htmlH2Match = !h2Match && !h3Match ? line.match(/<h2[^>]*>(.*?)<\/h2>/i) : null;
    const htmlH3Match = !h2Match && !h3Match && !htmlH2Match ? line.match(/<h3[^>]*>(.*?)<\/h3>/i) : null;

    let text = '';
    let level: 2 | 3 | null = null;

    if (h3Match) {
      text = h3Match[1].trim();
      level = 3;
    } else if (h2Match) {
      text = h2Match[1].trim();
      level = 2;
    } else if (htmlH3Match) {
      text = htmlH3Match[1].replace(/<[^>]+>/g, '').trim();
      level = 3;
    } else if (htmlH2Match) {
      text = htmlH2Match[1].replace(/<[^>]+>/g, '').trim();
      level = 2;
    }

    if (level && text) {
      // Clean markdown bold or code markup from text label
      const cleanText = text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_`]/g, '')
        .trim();

      let baseId = slugifyHeading(cleanText);
      if (!baseId) {
        baseId = `heading-${headings.length + 1}`;
      }

      // Handle duplicate IDs
      const count = existingIds.get(baseId) || 0;
      existingIds.set(baseId, count + 1);
      const uniqueId = count === 0 ? baseId : `${baseId}-${count}`;

      headings.push({
        id: uniqueId,
        text: cleanText,
        level,
      });
    }
  }

  return headings;
}
