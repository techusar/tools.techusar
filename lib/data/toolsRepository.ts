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

export async function getRelatedTools(
  toolOrId: ToolItem | string,
  categoryOrLimit: ToolCategorySlug | string | number = 4,
  limit: number = 4
): Promise<ToolItem[]> {
  if (typeof toolOrId === 'object' && toolOrId !== null) {
    const actualLimit = typeof categoryOrLimit === 'number' ? categoryOrLimit : 4;
    const allInCat = ToolRepository.getByCategory(toolOrId.category as ToolCategorySlug);
    return allInCat.filter((t) => t.id !== toolOrId.id && t.slug !== toolOrId.slug).slice(0, actualLimit);
  }

  const category = categoryOrLimit as ToolCategorySlug;
  const allInCat = ToolRepository.getByCategory(category);
  return allInCat.filter((t) => t.id !== toolOrId && t.slug !== toolOrId).slice(0, limit);
}

export async function searchTools(query: string): Promise<ToolItem[]> {
  return ToolRepository.search(query);
}
