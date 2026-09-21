import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeContext';
import { UserProvider } from '@/components/auth/UserContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { UsageLimitModal } from '@/components/tools/UsageLimitModal';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'TechTools by TechUsar - 60+ Free Online Developer & AI Utilities',
  description:
    'Fast, privacy-friendly online utilities, code formatters, image compressors, QR generators, and Gemini-powered AI text tools with zero server tracking.',
  openGraph: {
    title: 'TechTools by TechUsar - 60+ Free Online Developer & AI Utilities',
    description:
      'Fast, privacy-friendly online utilities, code formatters, image compressors, QR generators, and Gemini-powered AI text tools with zero server tracking.',
    type: 'website',
    siteName: 'TechTools by TechUsar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechTools by TechUsar - Free Online Tools Suite',
    description: 'Explore 60+ free developer, AI, SEO, and finance utilities.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('techtools_theme');
                  if (t === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} font-sans bg-slate-50 text-slate-900 dark:bg-[#0B0D11] dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-200`}
      >
        <ThemeProvider>
          <UserProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <AuthModal />
            <UsageLimitModal />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
