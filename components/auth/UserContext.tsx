'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, ToolItem } from '@/lib/types';
import { getAnonymousId, trackClientEvent } from '@/lib/analytics/tracker';

interface UserContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  favorites: string[];
  recentTools: string[];
  isAuthModalOpen: boolean;
  isLimitModalOpen: boolean;
  limitModalTool: ToolItem | null;
  openAuthModal: (mode?: any) => void;
  closeAuthModal: () => void;
  openLimitModal: (tool: ToolItem) => void;
  closeLimitModal: () => void;
  upgradeToPro: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleFavorite: (toolSlug: string) => Promise<void>;
  isFavorited: (toolSlug: string) => boolean;
  isFavorite: (toolSlug: string) => boolean;
  recordRecentTool: (toolSlug: string) => void;
  recordToolUse: (tool: ToolItem) => Promise<{ canUse: boolean; remaining: number }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'techtools_user_session';
const FAVORITES_STORAGE_KEY = 'techtools_local_favorites';
const RECENT_STORAGE_KEY = 'techtools_recent_tools';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [limitModalTool, setLimitModalTool] = useState<ToolItem | null>(null);

  // Load session from storage on mount
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          if (parsed.favorites && Array.isArray(parsed.favorites)) {
            setFavorites(parsed.favorites);
          }
        } else {
          const localFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
          if (localFavs) {
            setFavorites(JSON.parse(localFavs));
          }
        }

        const storedRecent = localStorage.getItem(RECENT_STORAGE_KEY);
        if (storedRecent) {
          setRecentTools(JSON.parse(storedRecent));
        }
      } catch {
        // Ignored
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const anonId = getAnonymousId();
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, anonymousId: anonId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setUser(data.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      if (data.user.favorites) {
        setFavorites(data.user.favorites);
      }
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const anonId = getAnonymousId();
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, anonymousId: anonId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const toggleFavorite = async (toolSlug: string) => {
    let nextFavs: string[] = [];
    if (favorites.includes(toolSlug)) {
      nextFavs = favorites.filter((s) => s !== toolSlug);
    } else {
      nextFavs = [...favorites, toolSlug];
    }
    setFavorites(nextFavs);

    if (user) {
      const updatedUser = { ...user, favorites: nextFavs };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

      try {
        await fetch('/api/auth/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, toolSlug }),
        });
      } catch {
        // Handled
      }
    } else {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavs));
      trackClientEvent('favorite', { toolSlug });
    }
  };

  const isFavorited = (toolSlug: string) => favorites.includes(toolSlug);

  const recordRecentTool = (toolSlug: string) => {
    const updated = [toolSlug, ...recentTools.filter((s) => s !== toolSlug)].slice(0, 12);
    setRecentTools(updated);
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Handled
    }
  };

  const recordToolUse = async (tool: ToolItem): Promise<{ canUse: boolean; remaining: number }> => {
    if (tool.unlimited) {
      return { canUse: true, remaining: Infinity };
    }

    const identifier = user?.id || getAnonymousId();
    try {
      const res = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'increment',
          identifier,
          toolSlug: tool.slug,
          isAuthenticated: Boolean(user),
        }),
      });
      const data = await res.json();
      if (data.exceeded) {
        setLimitModalTool(tool);
        setIsLimitModalOpen(true);
        return { canUse: false, remaining: 0 };
      }
      return { canUse: true, remaining: data.remaining ?? 1 };
    } catch {
      return { canUse: true, remaining: 1 };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        favorites,
        recentTools,
        isAuthModalOpen,
        isLimitModalOpen,
        limitModalTool,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        openLimitModal: (tool) => {
          setLimitModalTool(tool);
          setIsLimitModalOpen(true);
        },
        closeLimitModal: () => {
          setIsLimitModalOpen(false);
          setLimitModalTool(null);
        },
        upgradeToPro: () => {
          if (user) {
            const updated = { ...user, role: user.role === 'admin' ? 'admin' : ('pro' as any) };
            setUser(updated);
            try {
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
            } catch {}
          }
        },
        login,
        register,
        logout,
        toggleFavorite,
        isFavorited,
        isFavorite: isFavorited,
        recordRecentTool,
        recordToolUse,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
