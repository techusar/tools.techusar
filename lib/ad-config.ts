/**
 * Central Google AdSense & Display Advertising Configuration
 * 
 * To activate display ads:
 * 1. Set NEXT_PUBLIC_ADSENSE_CLIENT in your environment (e.g. ca-pub-XXXXXXXXXXXXXXXX)
 * 2. Set slot IDs for each placement
 * 3. Set NEXT_PUBLIC_ADSENSE_ENABLED=true
 * 
 * When disabled or unconfigured, ad containers collapse cleanly without visual glitches,
 * intrusive popups, or CLS (Cumulative Layout Shift).
 */
export const AD_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true',
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '',
  testMode: process.env.NODE_ENV === 'development',
  slots: {
    // Below the interactive tool interface (before "What is [Tool]")
    toolBelow: process.env.NEXT_PUBLIC_AD_SLOT_TOOL_BELOW || '',
    // Between FAQ and Related Tools
    toolBottom: process.env.NEXT_PUBLIC_AD_SLOT_TOOL_BOTTOM || '',
    // Bottom of Category tool listing
    categoryBottom: process.env.NEXT_PUBLIC_AD_SLOT_CATEGORY_BOTTOM || '',
    // Middle of Homepage between categories and tools directory
    homeMiddle: process.env.NEXT_PUBLIC_AD_SLOT_HOME_MIDDLE || '',
    // Mid-article inside long blog posts
    blogArticleMid: process.env.NEXT_PUBLIC_AD_SLOT_BLOG_MID || '',
    // Bottom of blog posts before comments/related
    blogArticleBottom: process.env.NEXT_PUBLIC_AD_SLOT_BLOG_BOTTOM || '',
  },
} as const;

export type AdSlotKey = keyof typeof AD_CONFIG.slots;
