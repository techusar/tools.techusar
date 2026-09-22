'use server';

import { NeonUserRepository, getDb, initNeonDatabase } from '@/lib/db/neon';

export interface RecordHistoryParams {
  userId?: string | null;
  anonymousId?: string | null;
  toolId: string;
  toolName?: string;
  category?: string;
}

export interface HistoryItemResult {
  tool_id: string;
  tool_name: string;
  category: string;
  used_at: string;
}

/**
 * Server-side action to persist tool usage logs to the Neon PostgreSQL database.
 * Supports both authenticated user IDs and per-device/browser anonymous IDs.
 */
export async function recordToolUsageAction(params: RecordHistoryParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId, anonymousId, toolId, toolName, category } = params;
    const targetId = userId || anonymousId;

    if (!targetId || !toolId) {
      return { success: false, error: 'User identifier and Tool ID are required.' };
    }

    await NeonUserRepository.recordHistory(targetId, toolId, toolName, category);

    return { success: true };
  } catch (error: any) {
    console.error('recordToolUsageAction error:', error);
    return { success: false, error: error?.message || 'Failed to record tool usage.' };
  }
}

/**
 * Server-side action to retrieve tool usage history for a user or browser from Neon.
 */
export async function getUserHistoryAction(
  userIdOrAnonId: string,
  limit = 50
): Promise<{ success: boolean; history: HistoryItemResult[]; error?: string }> {
  try {
    if (!userIdOrAnonId) {
      return { success: true, history: [] };
    }

    const history = await NeonUserRepository.getHistory(userIdOrAnonId, limit);
    return {
      success: true,
      history: history.map((row: any) => ({
        tool_id: row.tool_id,
        tool_name: row.tool_name,
        category: row.category,
        used_at: row.used_at ? new Date(row.used_at).toISOString() : new Date().toISOString(),
      })),
    };
  } catch (error: any) {
    console.error('getUserHistoryAction error:', error);
    return { success: false, history: [], error: error?.message || 'Failed to fetch history.' };
  }
}

/**
 * Server-side action to delete tool usage history for a user or browser from Neon.
 */
export async function clearUserHistoryAction(
  userIdOrAnonId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userIdOrAnonId) {
      return { success: false, error: 'Identifier is required.' };
    }

    const ok = await NeonUserRepository.clearHistory(userIdOrAnonId);
    return { success: ok };
  } catch (error: any) {
    console.error('clearUserHistoryAction error:', error);
    return { success: false, error: error?.message || 'Failed to clear history.' };
  }
}
