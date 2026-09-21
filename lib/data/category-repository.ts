import { DataStore } from './json-store';
import { ToolCategory, ToolCategorySlug } from '../types';

export const CategoryRepository = {
  getAll(): ToolCategory[] {
    const categories = DataStore.getCategories();
    const tools = DataStore.getTools();
    // Dynamically calculate actual tool counts
    return categories.map((cat) => {
      const count = tools.filter((t) => t.category === cat.slug).length;
      return {
        ...cat,
        toolCount: count > 0 ? count : cat.toolCount,
      };
    });
  },

  getBySlug(slug: ToolCategorySlug | string): ToolCategory | undefined {
    const categories = this.getAll();
    return categories.find((c) => c.slug === slug || c.id === slug);
  },

  updateCategory(category: ToolCategory): boolean {
    const categories = DataStore.getCategories();
    const idx = categories.findIndex((c) => c.id === category.id || c.slug === category.slug);
    if (idx === -1) {
      categories.push(category);
    } else {
      categories[idx] = category;
    }
    DataStore.saveCategories(categories);
    return true;
  },
};
