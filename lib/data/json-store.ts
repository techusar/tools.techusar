import fs from 'fs';
import path from 'path';
import {
  INITIAL_CATEGORIES,
  INITIAL_TOOLS,
  INITIAL_BLOG_POSTS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
} from './initial-data';
import {
  ToolCategory,
  ToolItem,
  BlogPost,
  PlatformSettings,
  UserAccount,
  AnalyticsEvent,
} from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // In restricted environments, fallback
    console.warn('Could not create data directory, using memory fallback', err);
  }
}

// In-memory cache to ensure blazingly fast reads and resilient fallback
const memoryCache: {
  categories: ToolCategory[];
  tools: ToolItem[];
  blog: BlogPost[];
  settings: PlatformSettings;
  users: UserAccount[];
  events: AnalyticsEvent[];
  usage: Record<string, Record<string, number>>;
  favorites: Record<string, string[]>;
} = {
  categories: [...INITIAL_CATEGORIES],
  tools: [...INITIAL_TOOLS],
  blog: [...INITIAL_BLOG_POSTS],
  settings: { ...INITIAL_SETTINGS },
  users: [...INITIAL_USERS],
  events: [
    {
      id: 'init-evt-1',
      event: 'tool_use',
      toolSlug: 'json-formatter',
      toolName: 'JSON Formatter & Validator',
      category: 'developer-tools',
      anonymousId: 'anon-seed-01',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'init-evt-2',
      event: 'ai_generation',
      toolSlug: 'ai-text-summarizer',
      toolName: 'AI Text Summarizer',
      category: 'ai-tools',
      anonymousId: 'anon-seed-02',
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
  ],
  usage: {},
  favorites: {},
};

export function readJsonFile<T>(filename: string, fallback: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as T;
    }
    // Initialize file with fallback if not existing
    writeJsonFile(filename, fallback);
    return fallback;
  } catch (e) {
    return fallback;
  }
}

export function writeJsonFile<T>(filename: string, data: T): boolean {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.warn(`Failed to write to file ${filename}:`, e);
    return false;
  }
}

// Accessors with memory-sync
export const DataStore = {
  getCategories(): ToolCategory[] {
    const data = readJsonFile<ToolCategory[]>('categories.json', memoryCache.categories);
    memoryCache.categories = data;
    return data;
  },
  saveCategories(categories: ToolCategory[]) {
    memoryCache.categories = categories;
    writeJsonFile('categories.json', categories);
  },

  getTools(): ToolItem[] {
    const data = readJsonFile<ToolItem[]>('tools.json', memoryCache.tools);
    memoryCache.tools = data;
    return data;
  },
  saveTools(tools: ToolItem[]) {
    memoryCache.tools = tools;
    writeJsonFile('tools.json', tools);
  },

  getBlog(): BlogPost[] {
    const data = readJsonFile<BlogPost[]>('blog.json', memoryCache.blog);
    memoryCache.blog = data;
    return data;
  },
  saveBlog(blog: BlogPost[]) {
    memoryCache.blog = blog;
    writeJsonFile('blog.json', blog);
  },

  getSettings(): PlatformSettings {
    const data = readJsonFile<PlatformSettings>('settings.json', memoryCache.settings);
    memoryCache.settings = data;
    return data;
  },
  saveSettings(settings: PlatformSettings) {
    memoryCache.settings = settings;
    writeJsonFile('settings.json', settings);
  },

  getUsers(): UserAccount[] {
    const data = readJsonFile<UserAccount[]>('users.json', memoryCache.users);
    memoryCache.users = data;
    return data;
  },
  saveUsers(users: UserAccount[]) {
    memoryCache.users = users;
    writeJsonFile('users.json', users);
  },

  getEvents(): AnalyticsEvent[] {
    const data = readJsonFile<AnalyticsEvent[]>('events.json', memoryCache.events);
    memoryCache.events = data;
    return data;
  },
  appendEvent(event: AnalyticsEvent) {
    const events = this.getEvents();
    // Keep max 2000 events to prevent unbounded growth
    if (events.length > 2000) {
      events.splice(0, events.length - 1999);
    }
    events.push(event);
    memoryCache.events = events;
    writeJsonFile('events.json', events);
  },

  getUsage(): Record<string, Record<string, number>> {
    const data = readJsonFile<Record<string, Record<string, number>>>('usage.json', memoryCache.usage);
    memoryCache.usage = data;
    return data;
  },
  saveUsage(usage: Record<string, Record<string, number>>) {
    memoryCache.usage = usage;
    writeJsonFile('usage.json', usage);
  },

  getFavorites(): Record<string, string[]> {
    const data = readJsonFile<Record<string, string[]>>('favorites.json', memoryCache.favorites);
    memoryCache.favorites = data;
    return data;
  },
  saveFavorites(favorites: Record<string, string[]>) {
    memoryCache.favorites = favorites;
    writeJsonFile('favorites.json', favorites);
  },
};
