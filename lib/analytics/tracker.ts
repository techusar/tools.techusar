'use client';

import { AnalyticsEvent } from '../types';

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetIdOrAction: string,
      params?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

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

/**
 * GA4 Core Event Dispatcher
 * Safely dispatches event to Google Analytics via gtag or dataLayer
 */
export function trackGAEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  } catch (err) {
    // Non-blocking telemetry
    console.debug('[GA4 Tracking Error]', err);
  }
}

/**
 * 1. Signup / Register Success -> fires 'sign_up'
 */
export function trackSignUp(method: string = 'email_password', params: Record<string, any> = {}) {
  trackGAEvent('sign_up', {
    method,
    ...params,
  });
}

/**
 * 2. Contact form successful submission -> fires 'contact'
 */
export function trackContact(params: { ticket_id?: string; subject?: string; inquiry_type?: string; [key: string]: any } = {}) {
  trackGAEvent('contact', {
    ...params,
  });
}

/**
 * 3. WhatsApp click -> fires 'whatsapp_click'
 */
export function trackWhatsAppClick(params: { location?: string; label?: string; link_url?: string; [key: string]: any } = {}) {
  trackGAEvent('whatsapp_click', {
    ...params,
  });
}

/**
 * 4. File / Template download action -> fires 'download'
 */
export function trackDownload(params: {
  file_name?: string;
  file_extension?: string;
  tool_slug?: string;
  [key: string]: any;
} = {}) {
  const { file_name, file_extension, tool_slug, ...rest } = params;
  const extension = file_extension || (file_name ? file_name.split('.').pop() : undefined);
  trackGAEvent('download', {
    file_name: file_name || 'untitled',
    file_extension: extension,
    tool_slug: tool_slug,
    ...rest,
  });
}

/**
 * 5. Successful paid purchase / checkout -> fires 'purchase'
 */
export function trackPurchase(params: {
  transaction_id: string;
  value: number;
  currency?: string;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    price?: number;
    quantity?: number;
    [key: string]: any;
  }>;
  [key: string]: any;
}) {
  const { transaction_id, value, currency, items, ...rest } = params;
  trackGAEvent('purchase', {
    transaction_id,
    value,
    currency: currency || 'USD',
    items: items || [],
    ...rest,
  });
}

/**
 * Client-Side Internal / Neon Event Tracking
 */
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
