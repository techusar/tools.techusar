import { NextRequest, NextResponse } from 'next/server';
import { FeedbackRepository } from '@/lib/data/feedback-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolSlug, authorName, text, rating, badge, verified } = body;

    if (!toolSlug || !text || text.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'toolSlug and comment text are required' },
        { status: 400 }
      );
    }

    const result = FeedbackRepository.addComment(toolSlug, {
      authorName: authorName || 'Community User',
      text,
      rating: Number(rating) || 5,
      badge,
      verified: Boolean(verified),
    });

    return NextResponse.json({ ...result });
  } catch (err: any) {
    console.error('Feedback comment POST error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to post comment' }, { status: 500 });
  }
}
