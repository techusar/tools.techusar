export type ToolCategorySlug =
  | 'developer-tools'
  | 'ai-tools'
  | 'image-tools'
  | 'pdf-tools'
  | 'text-tools'
  | 'seo-tools'
  | 'business-tools'
  | 'finance-tools'
  | 'calculators'
  | 'converters'
  | 'generators'
  | 'encoders'
  | 'validators'
  | 'design-tools'
  | 'color-tools'
  | 'security-tools'
  | 'date-time-tools'
  | 'education-tools'
  | 'productivity-tools'
  | 'social-media-tools';

export interface ToolCategory {
  id: string;
  name: string;
  slug: ToolCategorySlug;
  icon: string;
  description: string;
  toolCount: number;
  featured?: boolean;
}

export type ToolType = 'client' | 'ai' | 'server';
export type ToolStatus = 'free' | 'limited' | 'premium' | 'coming_soon';

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface AIConfig {
  provider: 'gemini';
  model: string;
  systemPrompt: string;
  placeholderPrompt?: string;
  outputFormat?: 'text' | 'json' | 'markdown' | 'code';
  temperature?: number;
}

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  category: ToolCategorySlug;
  categoryName: string;
  description: string;
  type: ToolType;
  status: ToolStatus;
  icon: string;
  tags: string[];
  featured?: boolean;
  popular?: boolean;
  trending?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  unlimited?: boolean;
  anonymousLimit: number;
  authenticatedLimit: number;
  seoTitle: string;
  seoDescription: string;
  metaTitle?: string;
  metaDescription?: string;
  aiPowered?: boolean;
  shortIntro?: string;
  whatIsThis?: string;
  examples?: Array<{ title: string; description: string; code?: string }>;
  howToUse: string[];
  features: string[];
  featuresBenefits?: Array<{ title: string; desc: string }>;
  useCases?: Array<{ title: string; scenario: string; desc?: string }>;
  faqs: ToolFAQ[];
  relatedTools?: string[];
  aiConfig?: AIConfig;
  aliases?: string[];
  lastUpdated?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'user' | 'admin';
  tier?: 'free' | 'pro';
  createdAt: string;
  lastActive: string;
  favorites: string[];
  toolsUsedCount: number;
  aiGenerationsCount: number;
}

export interface AnalyticsEvent {
  id: string;
  event:
    | 'page_view'
    | 'tool_open'
    | 'tool_use'
    | 'tool_success'
    | 'tool_error'
    | 'search'
    | 'search_result_click'
    | 'signup'
    | 'login'
    | 'favorite'
    | 'download'
    | 'copy'
    | 'ai_generation'
    | 'limit_reached';
  toolSlug?: string;
  toolName?: string;
  category?: string;
  userId?: string;
  anonymousId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | string[];
  category: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt?: string;
  publishDate?: string;
  readTime?: string;
  readingTime?: string;
  tags: string[];
  relatedTools?: string[];
  featured?: boolean;
}

export interface PlatformSettings {
  siteName: string;
  tagline: string;
  anonymousDefaultLimit: number;
  authenticatedDefaultLimit: number;
  analyticsEnabled: boolean;
  retentionDays: number;
  maintenanceMode: boolean;
  aiProvider: string;
  aiModel: string;
  contactEmail: string;
  updatedAt: string;
}

export interface BackupPayload {
  version: number;
  createdAt: string;
  app: 'TechTools';
  brand: 'TechUsar';
  data: {
    users: UserAccount[];
    tools: ToolItem[];
    categories: ToolCategory[];
    events: AnalyticsEvent[];
    usage: Record<string, Record<string, number>>; // key: userId/anonId -> toolSlug -> count
    favorites: Record<string, string[]>;
    blog: BlogPost[];
    settings: PlatformSettings;
  };
}

export interface ToolComment {
  id: string;
  toolSlug: string;
  authorName: string;
  text: string;
  rating?: number; // 1 to 5 stars
  createdAt: string;
  likesCount?: number;
  badge?: string;
  verified?: boolean;
}

export interface ToolFeedbackData {
  toolSlug: string;
  likes: number;
  userLiked: boolean;
  comments: ToolComment[];
  averageRating: number;
  totalComments: number;
}
