import { NextResponse } from 'next/server';
import { getAllTools } from '@/lib/data/toolsRepository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tools = await getAllTools();
    return NextResponse.json({
      success: true,
      count: tools.length,
      tools,
    });
  } catch (error: any) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
