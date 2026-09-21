import { NextRequest, NextResponse } from 'next/server';
import { ToolRepository } from '@/lib/data/tool-repository';

export async function GET() {
  try {
    const tools = ToolRepository.getAll();
    return NextResponse.json({ success: true, tools });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch tools' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool } = body;

    if (!tool || !tool.id || !tool.name) {
      return NextResponse.json({ error: 'Valid tool data required with id and name' }, { status: 400 });
    }

    ToolRepository.updateTool(tool);
    return NextResponse.json({ success: true, message: 'Tool and SEO content updated successfully', tool });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error updating tool' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Tool id required' }, { status: 400 });
    }
    ToolRepository.deleteTool(id);
    return NextResponse.json({ success: true, message: 'Tool removed successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error deleting tool' }, { status: 500 });
  }
}
