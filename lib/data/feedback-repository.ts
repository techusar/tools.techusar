import { readJsonFile, writeJsonFile } from './json-store';
import { ToolComment, ToolFeedbackData } from '../types';
import { getDb, initNeonDatabase } from '../db/neon';

// In-memory feedback state cache
let cachedLikes: Record<string, number> | null = null;
let cachedUserLikes: Record<string, string[]> | null = null; // userId/anonId -> toolSlug[]
let cachedComments: Record<string, ToolComment[]> | null = null; // toolSlug -> ToolComment[]

// Initialize likes map (clean empty state by default, 0 likes for all tools)
function getLikesMap(): Record<string, number> {
  if (cachedLikes) return cachedLikes;
  const fileData = readJsonFile<Record<string, number>>('tool-likes.json', {});
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
  const fileData = readJsonFile<Record<string, ToolComment[]>>('tool-comments.json', {});
  cachedComments = fileData;
  return fileData;
}

export const FeedbackRepository = {
  /**
   * Reset in-memory cache
   */
  resetCache() {
    cachedLikes = null;
    cachedUserLikes = null;
    cachedComments = null;
  },

  /**
   * Get all tool likes as a map: { [toolSlug]: likesCount }
   */
  getAllLikes(): Record<string, number> {
    return { ...getLikesMap() };
  },

  /**
   * Get feedback details for a single tool (real data only, 0 by default)
   */
  getToolFeedback(toolSlug: string, userOrAnonId?: string): ToolFeedbackData {
    const cleanSlug = (toolSlug || '').trim().toLowerCase();
    const likesMap = getLikesMap();
    const userLikesMap = getUserLikesMap();
    const commentsMap = getCommentsMap();

    const likes = likesMap[cleanSlug] ?? 0;
    const userLiked = userOrAnonId ? (userLikesMap[userOrAnonId] || []).includes(cleanSlug) : false;
    const comments = commentsMap[cleanSlug] ? [...commentsMap[cleanSlug]] : [];

    // Sort comments newest first
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate average rating
    const rated = comments.filter((c) => typeof c.rating === 'number' && c.rating > 0);
    const averageRating =
      rated.length > 0
        ? Number((rated.reduce((acc, c) => acc + (c.rating || 5), 0) / rated.length).toFixed(1))
        : 0;

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
   * Toggle global like for a tool (real-time increment/decrement and persistence)
   */
  toggleLike(toolSlug: string, userOrAnonId: string): { likes: number; userLiked: boolean } {
    const cleanSlug = (toolSlug || '').trim().toLowerCase();
    const id = (userOrAnonId || 'anon-' + Date.now()).trim();

    const likesMap = getLikesMap();
    const userLikesMap = getUserLikesMap();

    const userList = userLikesMap[id] || [];
    const isAlreadyLiked = userList.includes(cleanSlug);

    let currentLikes = likesMap[cleanSlug] ?? 0;

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

    // Asynchronously update Neon database if available
    this.syncNeonLike(cleanSlug, currentLikes).catch(() => {});

    return {
      likes: currentLikes,
      userLiked: !isAlreadyLiked,
    };
  },

  /**
   * Add a real user comment to a tool
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
    const cleanAuthor = (data.authorName || 'Guest User').trim().substring(0, 50);
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

    // Asynchronously try sync with Neon database
    this.syncNeonComment(newComment).catch(() => {});

    // Recalculate average rating
    const rated = toolComments.filter((c) => typeof c.rating === 'number' && c.rating > 0);
    const averageRating =
      rated.length > 0
        ? Number((rated.reduce((acc, c) => acc + (c.rating || 5), 0) / rated.length).toFixed(1))
        : 0;

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
