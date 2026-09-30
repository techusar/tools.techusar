import { ToolRepository } from './tool-repository';
import { CategoryRepository } from './category-repository';
import { ToolItem, ToolCategory, ToolCategorySlug } from '../types';

export { ToolRepository, CategoryRepository };

export async function getAllTools(): Promise<ToolItem[]> {
  return ToolRepository.getAll();
}

export async function getToolBySlug(slug: string): Promise<ToolItem | undefined> {
  return ToolRepository.getBySlug(slug);
}

export async function getToolsByCategory(category: ToolCategorySlug | string): Promise<ToolItem[]> {
  return ToolRepository.getByCategory(category as ToolCategorySlug);
}

export async function getFeaturedTools(): Promise<ToolItem[]> {
  return ToolRepository.getFeatured();
}

export async function getPopularTools(): Promise<ToolItem[]> {
  return ToolRepository.getPopular();
}

export async function getAITools(): Promise<ToolItem[]> {
  return ToolRepository.getAITools();
}

export async function getCategories(): Promise<ToolCategory[]> {
  return CategoryRepository.getAll();
}

export async function getCategoryBySlug(slug: string): Promise<ToolCategory | undefined> {
  return CategoryRepository.getBySlug(slug);
}

// Workflow & Intent-Driven Related Tool Clusters (Complementary user workflows & next actions)
const WORKFLOW_CLUSTERS: Record<string, string[]> = {
  // Developer Cluster
  'json-formatter': ['json-validator', 'csv-json-converter', 'base64-encoder-decoder', 'jwt-decoder'],
  'json-validator': ['json-formatter', 'xml-yaml-formatter', 'csv-json-converter', 'dummy-data-generator'],
  'base64-encoder-decoder': ['url-encoder-decoder', 'html-entities-encoder', 'image-to-base64', 'jwt-decoder'],
  'base64-encoder': ['base64-decoder', 'url-encoder-decoder', 'html-entities-encoder', 'image-to-base64'],
  'base64-decoder': ['base64-encoder', 'jwt-decoder', 'url-encoder-decoder', 'json-formatter'],
  'jwt-decoder': ['base64-encoder-decoder', 'hash-generator', 'url-encoder-decoder', 'json-formatter'],
  'uuid-generator': ['dummy-data-generator', 'hash-generator', 'password-generator', 'slug-generator'],
  'regex-tester': ['ai-regex-generator', 'text-diff', 'case-converter', 'word-counter'],
  'hash-generator': ['password-generator', 'uuid-generator', 'jwt-decoder', 'base64-encoder-decoder'],
  'url-encoder-decoder': ['base64-encoder-decoder', 'utm-builder', 'slug-generator', 'html-entities-encoder'],
  'html-entities-encoder': ['url-encoder-decoder', 'base64-encoder-decoder', 'markdown-editor', 'json-formatter'],
  'xml-yaml-formatter': ['json-formatter', 'json-validator', 'csv-json-converter', 'markdown-editor'],

  // Image Cluster
  'image-compressor': ['image-resizer', 'image-to-webp', 'jpg-to-png', 'png-to-jpg'],
  'image-resizer': ['image-compressor', 'image-to-webp', 'favicon-generator', 'aspect-ratio-calculator'],
  'image-to-webp': ['image-compressor', 'image-resizer', 'jpg-to-png', 'png-to-jpg'],
  'jpg-to-png': ['png-to-jpg', 'image-to-webp', 'image-compressor', 'image-resizer'],
  'png-to-jpg': ['jpg-to-png', 'image-to-webp', 'image-compressor', 'image-resizer'],
  'image-to-base64': ['base64-encoder-decoder', 'image-compressor', 'favicon-generator', 'image-resizer'],
  'favicon-generator': ['image-resizer', 'image-compressor', 'og-meta-generator', 'aspect-ratio-calculator'],

  // Business & Finance Cluster
  'gst-calculator': ['invoice-generator', 'profit-margin-calculator', 'percentage-calculator', 'loan-emi-calculator'],
  'invoice-generator': ['gst-calculator', 'profit-margin-calculator', 'percentage-calculator', 'pdf-viewer'],
  'profit-margin-calculator': ['gst-calculator', 'invoice-generator', 'percentage-calculator', 'compound-interest-calculator'],
  'loan-emi-calculator': ['compound-interest-calculator', 'profit-margin-calculator', 'percentage-calculator', 'gst-calculator'],
  'compound-interest-calculator': ['loan-emi-calculator', 'profit-margin-calculator', 'percentage-calculator', 'age-calculator'],
  'percentage-calculator': ['profit-margin-calculator', 'gst-calculator', 'loan-emi-calculator', 'gpa-calculator'],

  // AI Cluster
  'ai-text-summarizer': ['ai-rewriter', 'ai-grammar-fixer', 'word-counter', 'ai-email-writer'],
  'ai-rewriter': ['ai-text-summarizer', 'ai-grammar-fixer', 'word-counter', 'ai-email-writer'],
  'ai-grammar-fixer': ['ai-rewriter', 'ai-text-summarizer', 'word-counter', 'markdown-editor'],
  'ai-code-explainer': ['ai-regex-generator', 'regex-tester', 'json-formatter', 'ai-text-summarizer'],
  'ai-regex-generator': ['regex-tester', 'ai-code-explainer', 'text-diff', 'case-converter'],
  'ai-seo-meta-generator': ['serp-snippet-preview', 'og-meta-generator', 'slug-generator', 'utm-builder'],
  'ai-email-writer': ['ai-grammar-fixer', 'ai-rewriter', 'word-counter', 'invoice-generator'],

  // Text & Content Cluster
  'word-counter': ['character-counter', 'case-converter', 'text-diff', 'markdown-editor'],
  'character-counter': ['word-counter', 'case-converter', 'social-post-preview', 'text-diff'],
  'case-converter': ['word-counter', 'slug-generator', 'text-diff', 'character-counter'],
  'text-diff': ['markdown-editor', 'word-counter', 'case-converter', 'json-formatter'],
  'lorem-ipsum-generator': ['dummy-data-generator', 'word-counter', 'slug-generator', 'markdown-editor'],
  'markdown-editor': ['text-diff', 'word-counter', 'pdf-viewer', 'html-entities-encoder'],

  // SEO & Social Cluster
  'serp-snippet-preview': ['og-meta-generator', 'ai-seo-meta-generator', 'slug-generator', 'word-counter'],
  'og-meta-generator': ['serp-snippet-preview', 'social-post-preview', 'schema-markup-generator', 'favicon-generator'],
  'schema-markup-generator': ['og-meta-generator', 'serp-snippet-preview', 'json-formatter', 'json-validator'],
  'utm-builder': ['url-encoder-decoder', 'slug-generator', 'serp-snippet-preview', 'qr-code-generator'],
  'social-post-preview': ['og-meta-generator', 'character-counter', 'word-counter', 'image-resizer'],

  // Security, Math & Everyday Cluster
  'password-generator': ['hash-generator', 'uuid-generator', 'jwt-decoder', 'base64-encoder-decoder'],
  'qr-code-generator': ['slug-generator', 'url-encoder-decoder', 'utm-builder', 'password-generator'],
  'slug-generator': ['utm-builder', 'qr-code-generator', 'case-converter', 'serp-snippet-preview'],
  'dummy-data-generator': ['json-formatter', 'csv-json-converter', 'uuid-generator', 'lorem-ipsum-generator'],
  'csv-json-converter': ['json-formatter', 'json-validator', 'dummy-data-generator', 'unit-converter'],
  'unit-converter': ['percentage-calculator', 'aspect-ratio-calculator', 'number-base-converter', 'bmi-calorie-calculator'],
  'number-base-converter': ['unit-converter', 'unix-timestamp-converter', 'hash-generator', 'base64-encoder-decoder'],
  'aspect-ratio-calculator': ['image-resizer', 'unit-converter', 'social-post-preview', 'image-compressor'],
  'age-calculator': ['unix-timestamp-converter', 'percentage-calculator', 'bmi-calorie-calculator', 'time-zone-converter'],
  'bmi-calorie-calculator': ['age-calculator', 'unit-converter', 'percentage-calculator', 'pomodoro-timer'],
  'unix-timestamp-converter': ['time-zone-converter', 'age-calculator', 'pomodoro-timer', 'dummy-data-generator'],
  'time-zone-converter': ['unix-timestamp-converter', 'pomodoro-timer', 'age-calculator', 'social-post-preview'],
  'gpa-calculator': ['percentage-calculator', 'pomodoro-timer', 'word-counter', 'age-calculator'],
  'pomodoro-timer': ['time-zone-converter', 'gpa-calculator', 'word-counter', 'unix-timestamp-converter'],
  'pdf-viewer': ['pdf-metadata-viewer', 'invoice-generator', 'markdown-editor', 'image-compressor'],
  'pdf-metadata-viewer': ['pdf-viewer', 'image-resizer', 'markdown-editor', 'invoice-generator'],
  'css-box-shadow-generator': ['glassmorphism-generator', 'css-gradient-generator', 'color-converter', 'wcag-contrast-checker'],
  'css-gradient-generator': ['color-converter', 'glassmorphism-generator', 'css-box-shadow-generator', 'wcag-contrast-checker'],
  'glassmorphism-generator': ['css-box-shadow-generator', 'css-gradient-generator', 'color-converter', 'wcag-contrast-checker'],
  'color-converter': ['wcag-contrast-checker', 'css-gradient-generator', 'css-box-shadow-generator', 'glassmorphism-generator'],
  'wcag-contrast-checker': ['color-converter', 'css-gradient-generator', 'css-box-shadow-generator', 'glassmorphism-generator'],
};

export async function getRelatedTools(
  toolOrId: ToolItem | string,
  categoryOrLimit: ToolCategorySlug | string | number = 4,
  limit: number = 4
): Promise<ToolItem[]> {
  const actualLimit = typeof categoryOrLimit === 'number' ? categoryOrLimit : limit;
  let currentTool: ToolItem | undefined;

  if (typeof toolOrId === 'object' && toolOrId !== null) {
    currentTool = toolOrId;
  } else {
    currentTool = ToolRepository.getBySlug(toolOrId);
  }

  const allTools = ToolRepository.getAll();
  const results: ToolItem[] = [];
  const addedIds = new Set<string>();

  if (currentTool) {
    addedIds.add(currentTool.id);
    addedIds.add(currentTool.slug);
  }

  // 1. Check curated workflow cluster first
  if (currentTool && WORKFLOW_CLUSTERS[currentTool.slug]) {
    for (const targetSlug of WORKFLOW_CLUSTERS[currentTool.slug]) {
      if (results.length >= actualLimit) break;
      const match = allTools.find((t) => t.slug === targetSlug || t.id === targetSlug);
      if (match && !addedIds.has(match.id)) {
        results.push(match);
        addedIds.add(match.id);
        addedIds.add(match.slug);
      }
    }
  }

  // 2. Check explicit tool.relatedTools definition
  if (currentTool?.relatedTools && currentTool.relatedTools.length > 0) {
    for (const rel of currentTool.relatedTools) {
      if (results.length >= actualLimit) break;
      const match = allTools.find((t) => t.id === rel || t.slug === rel);
      if (match && !addedIds.has(match.id)) {
        results.push(match);
        addedIds.add(match.id);
        addedIds.add(match.slug);
      }
    }
  }

  // 3. Fallback to same category tools
  if (currentTool && results.length < actualLimit) {
    const sameCat = allTools.filter(
      (t) => t.category === currentTool.category && !addedIds.has(t.id)
    );
    for (const item of sameCat) {
      if (results.length >= actualLimit) break;
      results.push(item);
      addedIds.add(item.id);
      addedIds.add(item.slug);
    }
  }

  // 4. Fill remaining slots with featured/popular tools if category had only 1 tool
  if (results.length < actualLimit) {
    const popular = allTools.filter((t) => (t.featured || t.popular) && !addedIds.has(t.id));
    for (const item of popular) {
      if (results.length >= actualLimit) break;
      results.push(item);
      addedIds.add(item.id);
      addedIds.add(item.slug);
    }
  }

  return results.slice(0, actualLimit);
}

export async function searchTools(query: string): Promise<ToolItem[]> {
  return ToolRepository.search(query);
}
