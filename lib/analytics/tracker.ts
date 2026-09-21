'use client';

import { AnalyticsEvent } from '../types';

const ANON_STORAGE_KEY = 'techtools_anon_id';

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return 'server-rendered';
  let id = localStorage.getItem(ANON_STORAGE_KEY);
  if (!id) {
    id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    try {
      localStorage.setItem(ANON_STORAGE_KEY, id);
    } catch {
      // Storage unavailable or private mode
    }
  }
  return id;
}

export function trackClientEvent(
  event: AnalyticsEvent['event'],
  payload: {
    toolSlug?: string;
    toolName?: string;
    category?: string;
    userId?: string;
    action?: string;
    metadata?: Record<string, any>;
    [key: string]: any;
  } = {}
) {
  if (typeof window === 'undefined') return;

  const anonymousId = getAnonymousId();

  // Async dispatch to server analytics endpoint without blocking UI
  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        anonymousId,
        ...payload,
      }),
      keepalive: true,
    }).catch(() => {
      // Ignore network errors in offline/dev
    });
  } catch {
    // Non-blocking
  }
}
