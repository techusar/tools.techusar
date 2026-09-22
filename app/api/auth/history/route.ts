import { NextRequest, NextResponse } from 'next/server';
import { NeonUserRepository } from '@/lib/db/neon';
import { AnalyticsRepository } from '@/lib/data/analytics-repository';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const anonymousId = searchParams.get('anonymousId');
  const targetId = userId || anonymousId;

  if (!targetId) {
    return NextResponse.json({ history: [] });
  }

  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const history = await NeonUserRepository.getHistory(targetId, limit);

  return NextResponse.json({ history });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, anonymousId, toolId, toolName, category } = body;
    const targetId = userId || anonymousId;

    if (!targetId || !toolId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    await NeonUserRepository.recordHistory(targetId, toolId, toolName, category);

    // Optional event tracking
    AnalyticsRepository.logEvent({
      event: 'tool_use',
      toolSlug: toolId,
      toolName: toolName || toolId,
      category: category || 'general',
      userId: userId || undefined,
      anonymousId: anonymousId || targetId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('History record API error:', error);
    return NextResponse.json({ error: 'Failed to record history' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, anonymousId } = body;
    const targetId = userId || anonymousId;

    if (!targetId) {
      return NextResponse.json({ error: 'Identifier required' }, { status: 400 });
    }

    const success = await NeonUserRepository.clearHistory(targetId);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('History clear API error:', error);
    return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
  }
}
