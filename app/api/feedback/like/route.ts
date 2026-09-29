import { NextRequest, NextResponse } from 'next/server';
import { FeedbackRepository } from '@/lib/data/feedback-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolSlug, userId } = body;

    if (!toolSlug) {
      return NextResponse.json({ success: false, error: 'toolSlug is required' }, { status: 400 });
    }

    const result = FeedbackRepository.toggleLike(toolSlug, userId || 'anon');
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Feedback like POST error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to toggle like' }, { status: 500 });
  }
}
