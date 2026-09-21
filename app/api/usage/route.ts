import { NextRequest, NextResponse } from 'next/server';
import { UsageRepository } from '@/lib/data/usage-repository';
import { ToolRepository } from '@/lib/data/tool-repository';
import { AnalyticsRepository } from '@/lib/data/analytics-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, identifier, toolSlug, isAuthenticated } = body;

    if (!identifier || !toolSlug) {
      return NextResponse.json({ error: 'identifier and toolSlug required' }, { status: 400 });
    }

    const tool = ToolRepository.getBySlug(toolSlug);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    if (action === 'increment') {
      const count = UsageRepository.incrementUsage(identifier, toolSlug);
      const limitCheck = UsageRepository.checkLimitExceeded(identifier, tool, isAuthenticated);

      if (limitCheck.exceeded) {
        AnalyticsRepository.logEvent({
          event: 'limit_reached',
          toolSlug: tool.slug,
          toolName: tool.name,
          category: tool.category,
          anonymousId: identifier,
        });
      }

      return NextResponse.json({
        success: true,
        count,
        limit: limitCheck.limit,
        exceeded: limitCheck.exceeded,
        remaining: limitCheck.remaining,
      });
    }

    // Default: check usage status
    const limitCheck = UsageRepository.checkLimitExceeded(identifier, tool, isAuthenticated);
    return NextResponse.json({
      success: true,
      current: limitCheck.current,
      limit: limitCheck.limit,
      exceeded: limitCheck.exceeded,
      remaining: limitCheck.remaining,
      unlimited: Boolean(tool.unlimited),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Usage error' }, { status: 500 });
  }
}
