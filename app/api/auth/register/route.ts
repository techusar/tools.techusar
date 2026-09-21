import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/lib/data/user-repository';
import { AnalyticsRepository } from '@/lib/data/analytics-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, anonymousId } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
    }

    const result = UserRepository.register(name, email, password);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    AnalyticsRepository.logEvent({
      event: 'signup',
      userId: result.user?.id,
      anonymousId: anonymousId || 'anon',
    });

    const safeUser = {
      id: result.user!.id,
      name: result.user!.name,
      email: result.user!.email,
      role: result.user!.role,
      favorites: result.user!.favorites,
      createdAt: result.user!.createdAt,
      toolsUsedCount: result.user!.toolsUsedCount,
      aiGenerationsCount: result.user!.aiGenerationsCount,
    };

    return NextResponse.json({ success: true, user: safeUser });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Registration failed' }, { status: 500 });
  }
}
