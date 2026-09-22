import { DataStore } from './json-store';
import { ToolCategory, ToolCategorySlug } from '../types';

export const CategoryRepository = {
  getAll(): ToolCategory[] {
    const categories = DataStore.getCategories();
    const tools = DataStore.getTools();
    // Dynamically calculate actual tool counts from the real tool collection
    return categories.map((cat) => {
      const catSlug = (cat.slug || '').toLowerCase().trim();
      const catId = (cat.id || '').toLowerCase().trim();
      const count = tools.filter((t) => {
        const toolCat = (t.category || '').toLowerCase().trim();
        return (
          toolCat === catSlug ||
          toolCat === catId ||
          toolCat === catSlug.replace(/-tools$/, '') ||
          catSlug === toolCat.replace(/-tools$/, '') ||
          (catId === 'pdf' && (toolCat.includes('pdf') || t.slug.includes('pdf')))
        );
      }).length;
      return {
        ...cat,
        toolCount: count,
      };
    });
  },

  getBySlug(slug: ToolCategorySlug | string): ToolCategory | undefined {
    const categories = this.getAll();
    const target = (slug || '').toLowerCase().trim();
    return categories.find(
      (c) =>
        c.slug.toLowerCase() === target ||
        c.id.toLowerCase() === target ||
        c.slug.replace(/-tools$/, '') === target.replace(/-tools$/, '')
    );
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
