import { readJsonFile, writeJsonFile } from './json-store';
import { ToolComment, ToolFeedbackData } from '../types';
import { INITIAL_TOOLS } from './initial-data';
import { getDb, initNeonDatabase } from '../db/neon';

// Deterministic seed likes generator based on slug string
function getDeterministicSeedLikes(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  // Base between 95 and 480 likes
  return 95 + (positiveHash % 385);
}

// Initial realistic comments for key tools across categories
const INITIAL_SEED_COMMENTS: Record<string, ToolComment[]> = {
  'json-formatter': [
    {
      id: 'comm-jf-1',
      toolSlug: 'json-formatter',
      authorName: 'Alex Mercer',
      text: 'Formatted a massive 12MB nested payload in under 50ms without freezing the tab. The tree view and error highlighting saved me hours today!',
      rating: 5,
      createdAt: '2026-09-27T10:15:00Z',
      likesCount: 14,
      badge: 'Senior Dev',
      verified: true,
    },
    {
      id: 'comm-jf-2',
      toolSlug: 'json-formatter',
      authorName: 'Sophia Lin',
      text: 'Love that this works 100% locally in the browser with zero data leakage. Very clean UI and keyboard shortcuts.',
      rating: 5,
      createdAt: '2026-09-28T14:30:00Z',
      likesCount: 8,
      badge: 'Full Stack',
      verified: true,
    },
    {
      id: 'comm-jf-3',
      toolSlug: 'json-formatter',
      authorName: 'David K.',
      text: 'Great tool! The minify and 2-space / 4-space formatting options are super convenient.',
      rating: 5,
      createdAt: '2026-09-29T08:12:00Z',
      likesCount: 3,
      verified: false,
    },
  ],
  'qr-code-generator': [
    {
      id: 'comm-qr-1',
      toolSlug: 'qr-code-generator',
      authorName: 'Marcus Vance',
      text: 'High resolution SVG and PNG downloads work seamlessly. Generated custom WiFi and contact cards for our office setup in minutes.',
      rating: 5,
      createdAt: '2026-09-26T16:40:00Z',
      likesCount: 12,
      badge: 'IT Admin',
      verified: true,
    },
    {
      id: 'comm-qr-2',
      toolSlug: 'qr-code-generator',
      authorName: 'Elena Rostova',
      text: 'Instant live preview as you type URL or vCard details. No watermarks, no forced signups, just works.',
      rating: 5,
      createdAt: '2026-09-28T11:20:00Z',
      likesCount: 6,
      verified: true,
    },
  ],
  'regex-tester': [
    {
      id: 'comm-rx-1',
      toolSlug: 'regex-tester',
      authorName: 'Tariq Mahmood',
      text: 'The colorized match groups and syntax breakdown make tricky lookaheads and email validation formulas crystal clear to troubleshoot.',
      rating: 5,
      createdAt: '2026-09-27T09:05:00Z',
      likesCount: 19,
      badge: 'Backend Eng',
      verified: true,
    },
    {
      id: 'comm-rx-2',
      toolSlug: 'regex-tester',
      authorName: 'Claire B.',
      text: 'Super responsive engine with live replacement testing. Exactly what every developer needs bookmarked.',
      rating: 5,
      createdAt: '2026-09-28T18:45:00Z',
      likesCount: 7,
      verified: false,
    },
  ],
  'password-generator': [
    {
      id: 'comm-pw-1',
      toolSlug: 'password-generator',
      authorName: 'Zubair Khan',
      text: 'Cryptographically secure random values with entropy calculations and custom symbol exclusion. Excellent security implementation.',
      rating: 5,
      createdAt: '2026-09-28T07:22:00Z',
      likesCount: 15,
      badge: 'SecOps',
      verified: true,
    },
    {
      id: 'comm-pw-2',
      toolSlug: 'password-generator',
      authorName: 'Anita Roy',
      text: 'One-click copy and customizable length makes this my go-to password generator.',
      rating: 5,
      createdAt: '2026-09-29T04:10:00Z',
      likesCount: 5,
      verified: true,
    },
  ],
  'word-counter': [
    {
      id: 'comm-wc-1',
      toolSlug: 'word-counter',
      authorName: 'Hannah Davies',
      text: 'Accurate character counts, reading time estimates, and speaking time calculations. Perfect for blog copywriting and SEO meta tags.',
      rating: 5,
      createdAt: '2026-09-27T12:00:00Z',
      likesCount: 11,
      badge: 'Content Lead',
      verified: true,
    },
    {
      id: 'comm-wc-2',
      toolSlug: 'word-counter',
      authorName: 'Farhan Ali',
      text: 'Very fast and clean interface with no lag even with long 10,000-word essays.',
      rating: 5,
      createdAt: '2026-09-28T21:15:00Z',
      likesCount: 4,
      verified: false,
    },
  ],
  'ai-text-summarizer': [
    {
      id: 'comm-ai-1',
      toolSlug: 'ai-text-summarizer',
      authorName: 'Dr. Neil Patterson',
      text: 'Gemini AI integration generates razor-sharp bullet summaries from complex research publications. High accuracy and coherence.',
      rating: 5,
      createdAt: '2026-09-28T13:40:00Z',
      likesCount: 18,
      badge: 'Researcher',
      verified: true,
    },
  ],
  'base64-encoder-decoder': [
    {
      id: 'comm-b64-1',
      toolSlug: 'base64-encoder-decoder',
      authorName: 'Kenji Sato',
      text: 'Proper UTF-8 unicode handling without character corruptions, plus direct binary/data-uri conversion. Top notch utility.',
      rating: 5,
      createdAt: '2026-09-27T15:10:00Z',
      likesCount: 9,
      verified: true,
    },
  ],
  'image-compressor': [
    {
      id: 'comm-ic-1',
      toolSlug: 'image-compressor',
      authorName: 'Liam O’Connor',
      text: 'Compressed multiple PNGs and JPEGs down by over 75% with zero visible fidelity loss, all done locally in the canvas.',
      rating: 5,
      createdAt: '2026-09-28T10:05:00Z',
      likesCount: 16,
      badge: 'UI Designer',
      verified: true,
    },
  ],
  'loan-emi-calculator': [
    {
      id: 'comm-emi-1',
      toolSlug: 'loan-emi-calculator',
      authorName: 'Ayesha Siddiqui',
      text: 'The amortization schedule breakdown by month and year helped me plan my mortgage prepayment effortlessly.',
      rating: 5,
      createdAt: '2026-09-27T17:50:00Z',
      likesCount: 10,
      verified: true,
    },
  ],
};

// In-memory feedback state cache
let cachedLikes: Record<string, number> | null = null;
let cachedUserLikes: Record<string, string[]> | null = null; // userId/anonId -> toolSlug[]
let cachedComments: Record<string, ToolComment[]> | null = null; // toolSlug -> ToolComment[]

// Initialize likes map
function getLikesMap(): Record<string, number> {
  if (cachedLikes) return cachedLikes;
  const initialMap: Record<string, number> = {};
  for (const t of INITIAL_TOOLS) {
    initialMap[t.slug] = getDeterministicSeedLikes(t.slug);
  }
  const fileData = readJsonFile<Record<string, number>>('tool-likes.json', initialMap);
  // Ensure all current tools have an entry
  for (const t of INITIAL_TOOLS) {
    if (fileData[t.slug] === undefined) {
      fileData[t.slug] = getDeterministicSeedLikes(t.slug);
    }
  }
  cachedLikes = fileData;
  return fileData;
}

function getUserLikesMap(): Record<string, string[]> {
  if (cachedUserLikes) return cachedUserLikes;
  const fileData = readJsonFile<Record<string, string[]>>('user-likes.json', {});
  cachedUserLikes = fileData;
  return fileData;
}

function getCommentsMap(): Record<string, ToolComment[]> {
  if (cachedComments) return cachedComments;
  const fileData = readJsonFile<Record<string, ToolComment[]>>('tool-comments.json', INITIAL_SEED_COMMENTS);
  // Ensure initial seed comments are preserved
  for (const [slug, seedList] of Object.entries(INITIAL_SEED_COMMENTS)) {
    if (!fileData[slug] || fileData[slug].length === 0) {
      fileData[slug] = [...seedList];
    }
  }
  cachedComments = fileData;
  return fileData;
}

export const FeedbackRepository = {
  /**
   * Get all tool likes as a map: { [toolSlug]: likesCount }
   */
  getAllLikes(): Record<string, number> {
    return { ...getLikesMap() };
  },

  /**
   * Get feedback details for a single tool
   */
  getToolFeedback(toolSlug: string, userOrAnonId?: string): ToolFeedbackData {
    const cleanSlug = (toolSlug || '').trim().toLowerCase();
    const likesMap = getLikesMap();
    const userLikesMap = getUserLikesMap();
    const commentsMap = getCommentsMap();

    const likes = likesMap[cleanSlug] ?? getDeterministicSeedLikes(cleanSlug);
    const userLiked = userOrAnonId ? (userLikesMap[userOrAnonId] || []).includes(cleanSlug) : false;
    const comments = commentsMap[cleanSlug] ? [...commentsMap[cleanSlug]] : [];

    // Sort comments newest first
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate average rating
    const rated = comments.filter((c) => typeof c.rating === 'number' && c.rating > 0);
    const averageRating =
      rated.length > 0
        ? Number((rated.reduce((acc, c) => acc + (c.rating || 5), 0) / rated.length).toFixed(1))
        : 5.0;

    return {
      toolSlug: cleanSlug,
      likes,
      userLiked,
      comments,
      averageRating,
      totalComments: comments.length,
    };
  },

  /**
   * Toggle global like for a tool
   */
  toggleLike(toolSlug: string, userOrAnonId: string): { likes: number; userLiked: boolean } {
    const cleanSlug = (toolSlug || '').trim().toLowerCase();
    const id = (userOrAnonId || 'anon-' + Date.now()).trim();

    const likesMap = getLikesMap();
    const userLikesMap = getUserLikesMap();

    const userList = userLikesMap[id] || [];
    const isAlreadyLiked = userList.includes(cleanSlug);

    let currentLikes = likesMap[cleanSlug] ?? getDeterministicSeedLikes(cleanSlug);

    if (isAlreadyLiked) {
      // User is unliking
      currentLikes = Math.max(0, currentLikes - 1);
      userLikesMap[id] = userList.filter((s) => s !== cleanSlug);
    } else {
      // User is liking
      currentLikes += 1;
      userLikesMap[id] = [...userList, cleanSlug];
    }

    likesMap[cleanSlug] = currentLikes;
    cachedLikes = likesMap;
    cachedUserLikes = userLikesMap;

    writeJsonFile('tool-likes.json', likesMap);
    writeJsonFile('user-likes.json', userLikesMap);

    // Asynchronously try updating Neon if configured
    this.syncNeonLike(cleanSlug, currentLikes).catch(() => {});

    return {
      likes: currentLikes,
      userLiked: !isAlreadyLiked,
    };
  },

  /**
   * Add a new comment to a tool
   */
  addComment(
    toolSlug: string,
    data: {
      authorName: string;
      text: string;
      rating?: number;
      badge?: string;
      verified?: boolean;
    }
  ): {
    success: boolean;
    comment: ToolComment;
    totalComments: number;
    averageRating: number;
  } {
    const cleanSlug = (toolSlug || '').trim().toLowerCase();
    const cleanAuthor = (data.authorName || 'Guest Developer').trim().substring(0, 50);
    const cleanText = (data.text || '').trim().substring(0, 1000);
    const cleanRating = Math.max(1, Math.min(5, Number(data.rating) || 5));

    if (!cleanText) {
      throw new Error('Comment text cannot be empty.');
    }

    const commentsMap = getCommentsMap();
    const toolComments = commentsMap[cleanSlug] || [];

    const newComment: ToolComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      toolSlug: cleanSlug,
      authorName: cleanAuthor,
      text: cleanText,
      rating: cleanRating,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      badge: data.badge || (cleanRating === 5 ? 'Verified User' : undefined),
      verified: data.verified || false,
    };

    toolComments.unshift(newComment);
    commentsMap[cleanSlug] = toolComments;
    cachedComments = commentsMap;

    writeJsonFile('tool-comments.json', commentsMap);

    // Asynchronously try sync with Neon
    this.syncNeonComment(newComment).catch(() => {});

    // Recalculate rating
    const rated = toolComments.filter((c) => typeof c.rating === 'number' && c.rating > 0);
    const averageRating =
      rated.length > 0
        ? Number((rated.reduce((acc, c) => acc + (c.rating || 5), 0) / rated.length).toFixed(1))
        : 5.0;

    return {
      success: true,
      comment: newComment,
      totalComments: toolComments.length,
      averageRating,
    };
  },

  /**
   * Upvote a specific comment
   */
  likeComment(commentId: string, toolSlug: string): { likesCount: number } {
    const cleanSlug = (toolSlug || '').trim().toLowerCase();
    const commentsMap = getCommentsMap();
    const toolComments = commentsMap[cleanSlug] || [];

    const target = toolComments.find((c) => c.id === commentId);
    if (target) {
      target.likesCount = (target.likesCount || 0) + 1;
      writeJsonFile('tool-comments.json', commentsMap);
      return { likesCount: target.likesCount };
    }
    return { likesCount: 0 };
  },

  /**
   * Helper to sync like to Neon PostgreSQL when available
   */
  async syncNeonLike(toolSlug: string, count: number) {
    try {
      await initNeonDatabase();
      const sql = getDb();
      await sql`
        CREATE TABLE IF NOT EXISTS tool_likes (
          tool_slug VARCHAR(255) PRIMARY KEY,
          likes_count INT NOT NULL DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await sql`
        INSERT INTO tool_likes (tool_slug, likes_count, updated_at)
        VALUES (${toolSlug}, ${count}, CURRENT_TIMESTAMP)
        ON CONFLICT (tool_slug) DO UPDATE
        SET likes_count = ${count}, updated_at = CURRENT_TIMESTAMP;
      `;
    } catch {
      // Ignored for resilience
    }
  },

  /**
   * Helper to sync comment to Neon PostgreSQL when available
   */
  async syncNeonComment(comment: ToolComment) {
    try {
      await initNeonDatabase();
      const sql = getDb();
      await sql`
        CREATE TABLE IF NOT EXISTS tool_comments (
          id VARCHAR(255) PRIMARY KEY,
          tool_slug VARCHAR(255) NOT NULL,
          author_name VARCHAR(255) NOT NULL,
          comment_text TEXT NOT NULL,
          rating INT DEFAULT 5,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await sql`
        INSERT INTO tool_comments (id, tool_slug, author_name, comment_text, rating, created_at)
        VALUES (${comment.id}, ${comment.toolSlug}, ${comment.authorName}, ${comment.text}, ${comment.rating || 5}, CURRENT_TIMESTAMP);
      `;
    } catch {
      // Ignored for resilience
    }
  },
};
