import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/lib/data/user-repository';
import { AnalyticsRepository } from '@/lib/data/analytics-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, toolSlug, anonymousId } = body;

    if (!userId || !toolSlug) {
      return NextResponse.json({ error: 'userId and toolSlug required' }, { status: 400 });
    }

    const favorites = UserRepository.toggleFavorite(userId, toolSlug);

    AnalyticsRepository.logEvent({
      event: 'favorite',
      toolSlug,
      userId,
      anonymousId: anonymousId || 'anon',
      metadata: { isFavorited: favorites.includes(toolSlug) },
    });

    return NextResponse.json({ success: true, favorites });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error updating favorites' }, { status: 500 });
  }
}
