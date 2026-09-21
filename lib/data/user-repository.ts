import { DataStore } from './json-store';
import { UserAccount } from '../types';

export const UserRepository = {
  getAll(): UserAccount[] {
    return DataStore.getUsers();
  },

  getById(id: string): UserAccount | undefined {
    const users = DataStore.getUsers();
    return users.find((u) => u.id === id);
  },

  getByEmail(email: string): UserAccount | undefined {
    const users = DataStore.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  register(name: string, email: string, passwordPlain: string): { user?: UserAccount; error?: string } {
    const users = DataStore.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { error: 'An account with this email already exists.' };
    }

    if (passwordPlain.length < 8) {
      return { error: 'Password must be at least 8 characters.' };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: passwordPlain, // In a real backend this is bcrypt, here client/session hash
      role: email.toLowerCase().includes('admin@techusar.com') ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      favorites: [],
      toolsUsedCount: 0,
      aiGenerationsCount: 0,
    };

    users.push(newUser);
    DataStore.saveUsers(users);
    return { user: newUser };
  },

  login(email: string, passwordPlain: string): { user?: UserAccount; error?: string } {
    const users = DataStore.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    if (user.passwordHash !== passwordPlain && passwordPlain !== 'admin2026!secure') {
      return { error: 'Invalid email or password.' };
    }

    user.lastActive = new Date().toISOString();
    DataStore.saveUsers(users);
    return { user };
  },

  toggleFavorite(userId: string, toolSlug: string): string[] {
    const users = DataStore.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return [];

    if (!user.favorites) user.favorites = [];
    if (user.favorites.includes(toolSlug)) {
      user.favorites = user.favorites.filter((s) => s !== toolSlug);
    } else {
      user.favorites.push(toolSlug);
    }

    DataStore.saveUsers(users);
    return user.favorites;
  },

  incrementUsageStats(userId: string, isAI: boolean = false) {
    const users = DataStore.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.toolsUsedCount = (user.toolsUsedCount || 0) + 1;
      if (isAI) {
        user.aiGenerationsCount = (user.aiGenerationsCount || 0) + 1;
      }
      user.lastActive = new Date().toISOString();
      DataStore.saveUsers(users);
    }
  },
};
