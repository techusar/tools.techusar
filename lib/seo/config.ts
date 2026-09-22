export const SEO_CONFIG = {
  siteName: 'TechTools by TechUsar',
  shortName: 'TechTools',
  siteUrl: 'https://tools.techusar.com',
  parentCompany: 'TechUsar',
  parentCompanyUrl: 'https://www.techusar.com',
  author: 'TechUsar Editorial Team',
  twitterHandle: '@TechUsar',
  defaultTitle: 'TechTools by TechUsar – Free Online Developer & AI Utilities',
  defaultDescription:
    'Free online developer tools, code formatters, image compressors, QR code generators, calculators, and Gemini AI utilities. Fast, privacy-focused in-browser processing.',
  defaultKeywords: [
    'developer tools',
    'free online tools',
    'JSON formatter',
    'image compressor',
    'QR code generator',
    'base64 encoder',
    'regex tester',
    'loan EMI calculator',
    'AI text tools',
    'online utilities',
    'TechTools',
    'TechUsar',
  ],
  ogImage: 'https://tools.techusar.com/api/og',
  contactEmail: 'support@techusar.com',
  privacyEmail: 'privacy@techusar.com',
  legalEmail: 'legal@techusar.com',
} as const;

export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.siteUrl}${cleanPath === '/' ? '' : cleanPath}`;
}
