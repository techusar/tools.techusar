import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Free Online Developer & Content Tools';
    const category = searchParams.get('cat') || 'TechTools';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 80px',
            backgroundColor: '#0B0D13',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(6, 182, 212, 0.15) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            color: '#FFFFFF',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#06B6D4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: '900',
                  color: '#000000',
                }}
              >
                TT
              </div>
              <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                TechTools
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                borderRadius: '999px',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#22D3EE',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              {category}
            </div>
          </div>

          {/* Main Title & Value Prop */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
            <h1
              style={{
                fontSize: '56px',
                fontWeight: '900',
                letterSpacing: '-1.5px',
                lineHeight: '1.15',
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: '22px', color: '#94A3B8', margin: 0, lineHeight: '1.4' }}>
              Fast, free, and 100% in-browser private developer utility. Zero server logs.
            </p>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '24px',
            }}
          >
            <div style={{ display: 'flex', gap: '24px', color: '#64748B', fontSize: '16px' }}>
              <span>✓ 100% Client-Side Private</span>
              <span>✓ Instant Processing</span>
              <span>✓ Complete Utilities Suite</span>
            </div>
            <div style={{ color: '#22D3EE', fontSize: '18px', fontWeight: '700' }}>
              tools.techusar.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
