'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { UserAccount, ToolItem } from '@/lib/types';
import { getAnonymousId, trackClientEvent, trackSignUp, trackWhatsAppClick } from '@/lib/analytics/tracker';

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
  recordRecentTool: (toolSlug: string, toolName?: string, category?: string) => void;
  clearRecentHistory: () => Promise<void>;
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

  // Global WhatsApp click event listener
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('a, button');
      if (target) {
        const href = (target as HTMLAnchorElement).href?.toLowerCase() || '';
        const dataAction = target.getAttribute('data-action') || '';
        if (
          href.includes('wa.me') ||
          href.includes('whatsapp.com') ||
          href.startsWith('whatsapp:') ||
          dataAction === 'whatsapp'
        ) {
          trackWhatsAppClick({
            link_url: (target as HTMLAnchorElement).href || 'whatsapp_action',
            label: target.textContent?.trim() || target.getAttribute('aria-label') || 'WhatsApp',
          });
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
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
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
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
      trackSignUp('email_password', {
        user_id: data.user.id,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const toggleFavorite = useCallback(async (toolSlug: string) => {
    setFavorites((prevFavs) => {
      const nextFavs = prevFavs.includes(toolSlug)
        ? prevFavs.filter((s) => s !== toolSlug)
        : [...prevFavs, toolSlug];

      setUser((currentUser) => {
        if (currentUser) {
          const updatedUser = { ...currentUser, favorites: nextFavs };
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
          fetch('/api/auth/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id, toolSlug }),
          }).catch(() => {});
          return updatedUser;
        } else {
          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavs));
          trackClientEvent('favorite', { toolSlug });
          return currentUser;
        }
      });

      return nextFavs;
    });
  }, []);

  const isFavorited = useCallback((toolSlug: string) => favorites.includes(toolSlug), [favorites]);

  const userId = user?.id;

  const recordRecentTool = useCallback((toolSlug: string, toolName?: string, category?: string) => {
    if (!toolSlug) return;
    setRecentTools((prev) => {
      if (prev.length > 0 && prev[0] === toolSlug) {
        return prev;
      }
      const updated = [toolSlug, ...prev.filter((s) => s !== toolSlug)].slice(0, 15);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Fire and forget Neon DB sync
    try {
      const anonId = getAnonymousId();
      fetch('/api/auth/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          anonymousId: anonId,
          toolId: toolSlug,
          toolName: toolName || toolSlug,
          category: category || 'general',
        }),
      }).catch(() => {});
    } catch {}
  }, [userId]);

  const clearRecentHistory = useCallback(async () => {
    setRecentTools([]);
    try {
      localStorage.removeItem(RECENT_STORAGE_KEY);
      const anonId = getAnonymousId();
      await fetch('/api/auth/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          anonymousId: anonId,
        }),
      });
    } catch {}
  }, [userId]);

  const recordToolUse = useCallback(async (tool: ToolItem): Promise<{ canUse: boolean; remaining: number }> => {
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
  }, [user]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);
  const openLimitModal = useCallback((tool: ToolItem) => {
    setLimitModalTool(tool);
    setIsLimitModalOpen(true);
  }, []);
  const closeLimitModal = useCallback(() => {
    setIsLimitModalOpen(false);
    setLimitModalTool(null);
  }, []);

  const upgradeToPro = useCallback(() => {
    setUser((curr) => {
      if (!curr) return curr;
      const updated = { ...curr, role: curr.role === 'admin' ? 'admin' : ('pro' as any) };
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      favorites,
      recentTools,
      isAuthModalOpen,
      isLimitModalOpen,
      limitModalTool,
      openAuthModal,
      closeAuthModal,
      openLimitModal,
      closeLimitModal,
      upgradeToPro,
      login,
      register,
      logout,
      toggleFavorite,
      isFavorited,
      isFavorite: isFavorited,
      recordRecentTool,
      clearRecentHistory,
      recordToolUse,
    }),
    [
      user,
      isLoading,
      favorites,
      recentTools,
      isAuthModalOpen,
      isLimitModalOpen,
      limitModalTool,
      openAuthModal,
      closeAuthModal,
      openLimitModal,
      closeLimitModal,
      upgradeToPro,
      login,
      register,
      logout,
      toggleFavorite,
      isFavorited,
      recordRecentTool,
      clearRecentHistory,
      recordToolUse,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
