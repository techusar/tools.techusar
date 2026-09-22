import { DataStore } from './json-store';
import { ToolItem, ToolCategorySlug } from '../types';

export const ToolRepository = {
  getAll(): ToolItem[] {
    return DataStore.getTools();
  },

  getBySlug(slug: string): ToolItem | undefined {
    const tools = DataStore.getTools();
    const cleanSlug = (slug || '').toLowerCase().trim();
    const direct = tools.find((t) => t.slug === cleanSlug || t.id === cleanSlug);
    if (direct) return direct;
    return tools.find((t) => t.aliases && t.aliases.some((a) => a.toLowerCase() === cleanSlug));
  },

  getByCategory(categorySlug: ToolCategorySlug | string): ToolItem[] {
    const tools = DataStore.getTools();
    const target = (categorySlug || '').toLowerCase().trim();
    return tools.filter((t) => {
      const toolCat = (t.category || '').toLowerCase().trim();
      return (
        toolCat === target ||
        toolCat === target.replace(/-tools$/, '') ||
        target === toolCat.replace(/-tools$/, '') ||
        (target.includes('pdf') && (toolCat.includes('pdf') || t.slug.includes('pdf')))
      );
    });
  },

  getFeatured(): ToolItem[] {
    const tools = DataStore.getTools();
    return tools.filter((t) => t.featured);
  },

  getPopular(): ToolItem[] {
    const tools = DataStore.getTools();
    return tools.filter((t) => t.popular);
  },

  getAITools(): ToolItem[] {
    const tools = DataStore.getTools();
    return tools.filter((t) => t.type === 'ai' || t.category === 'ai-tools');
  },

  search(query: string): ToolItem[] {
    if (!query || query.trim() === '') return [];
    const q = query.toLowerCase().trim();
    const tools = DataStore.getTools();

    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.categoryName.toLowerCase().includes(q)
    );
  },

  updateTool(updatedTool: ToolItem): boolean {
    const tools = DataStore.getTools();
    const idx = tools.findIndex((t) => t.id === updatedTool.id || t.slug === updatedTool.slug);
    if (idx === -1) {
      tools.push(updatedTool);
    } else {
      tools[idx] = { ...tools[idx], ...updatedTool, lastUpdated: new Date().toISOString() };
    }
    DataStore.saveTools(tools);
    return true;
  },

  deleteTool(idOrSlug: string): boolean {
    const tools = DataStore.getTools();
    const filtered = tools.filter((t) => t.id !== idOrSlug && t.slug !== idOrSlug);
    DataStore.saveTools(filtered);
    return true;
  },
};
