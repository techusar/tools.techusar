import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsRepository } from '@/lib/data/analytics-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, toolSlug, toolName, category, userId, anonymousId, metadata } = body;

    if (!event) {
      return NextResponse.json({ error: 'Event type required' }, { status: 400 });
    }

    const recorded = AnalyticsRepository.logEvent({
      event,
      toolSlug,
      toolName,
      category,
      userId,
      anonymousId: anonymousId || 'unknown_anon',
      metadata,
    });

    return NextResponse.json({ success: true, eventId: recorded.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error tracking event' }, { status: 500 });
  }
}
