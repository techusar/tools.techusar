import { DataStore } from './json-store';
import { BackupPayload } from '../types';

export const BackupRepository = {
  exportFullBackup(): BackupPayload {
    return {
      version: 1,
      createdAt: new Date().toISOString(),
      app: 'TechTools',
      brand: 'TechUsar',
      data: {
        users: DataStore.getUsers(),
        tools: DataStore.getTools(),
        categories: DataStore.getCategories(),
        events: DataStore.getEvents(),
        usage: DataStore.getUsage(),
        favorites: DataStore.getFavorites(),
        blog: DataStore.getBlog(),
        settings: DataStore.getSettings(),
      },
    };
  },

  restoreBackup(payload: any): { success: boolean; message: string } {
    if (!payload || !payload.data || payload.app !== 'TechTools') {
      return { success: false, message: 'Invalid backup file format or missing TechTools signature.' };
    }

    try {
      const { users, tools, categories, events, usage, favorites, blog, settings } = payload.data;

      if (Array.isArray(tools)) DataStore.saveTools(tools);
      if (Array.isArray(categories)) DataStore.saveCategories(categories);
      if (Array.isArray(users)) DataStore.saveUsers(users);
      if (Array.isArray(blog)) DataStore.saveBlog(blog);
      if (settings && typeof settings === 'object') DataStore.saveSettings(settings);
      if (usage && typeof usage === 'object') DataStore.saveUsage(usage);
      if (favorites && typeof favorites === 'object') DataStore.saveFavorites(favorites);

      return { success: true, message: 'Platform data restored successfully!' };
    } catch (e: any) {
      return { success: false, message: `Restore error: ${e?.message || 'Unknown error'}` };
    }
  },
};
