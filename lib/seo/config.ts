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
    'Free online tools for developers, SEO, images, AI, calculators, productivity, business and everyday tasks. Fast, 100% private in-browser processing with zero data retention.',
  totalToolsCount: 70,
  totalToolsLabel: '70+',
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
  contactEmail: 'techusar17@gmail.com',
  whatsappNumber: '03318917330',
  whatsappPhoneIntl: '+923318917330',
  whatsappUrl: 'https://wa.me/923318917330',
  privacyEmail: 'techusar17@gmail.com',
  legalEmail: 'techusar17@gmail.com',
} as const;

export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.siteUrl}${cleanPath === '/' ? '' : cleanPath}`;
}
