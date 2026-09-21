import { DataStore } from './json-store';
import { ToolItem } from '../types';

export const UsageRepository = {
  getUsageCount(identifier: string, toolSlug: string): number {
    const usage = DataStore.getUsage();
    if (!usage[identifier]) return 0;
    return usage[identifier][toolSlug] || 0;
  },

  incrementUsage(identifier: string, toolSlug: string): number {
    const usage = DataStore.getUsage();
    if (!usage[identifier]) {
      usage[identifier] = {};
    }
    const current = usage[identifier][toolSlug] || 0;
    usage[identifier][toolSlug] = current + 1;
    DataStore.saveUsage(usage);
    return usage[identifier][toolSlug];
  },

  checkLimitExceeded(
    identifier: string,
    tool: ToolItem,
    isAuthenticated: boolean = false
  ): { exceeded: boolean; current: number; limit: number; remaining: number } {
    if (tool.unlimited) {
      return { exceeded: false, current: 0, limit: Infinity, remaining: Infinity };
    }

    const current = this.getUsageCount(identifier, tool.slug);
    const limit = isAuthenticated
      ? tool.authenticatedLimit || 4
      : tool.anonymousLimit || 2;

    const exceeded = current >= limit;
    const remaining = Math.max(0, limit - current);

    return { exceeded, current, limit, remaining };
  },

  resetUsage(identifier: string) {
    const usage = DataStore.getUsage();
    delete usage[identifier];
    DataStore.saveUsage(usage);
  },
};
