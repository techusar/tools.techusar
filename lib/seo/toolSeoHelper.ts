import { ToolItem, ToolFAQ, ToolCategory } from '@/lib/types';
import { SEO_CONFIG } from '@/lib/seo/config';

export interface ToolEnrichedSEO {
  shortIntro: string; // 30-60 words
  whatIsThis: string; // 100-150 words
  howToUseSteps: string[]; // 100-200 words total
  featuresBenefits: Array<{ title: string; desc: string }>; // 100-200 words
  useCases: Array<{ title: string; scenario: string; desc?: string }>; // 100-200 words
  faqs: ToolFAQ[]; // 4-8 questions, 250-500 words
  wordCountEstimate: number;
}

// Curated comprehensive deep content for top utilities & intelligent category engines
const CURATED_TOOL_SEO: Record<string, Partial<ToolEnrichedSEO>> = {
  'json-formatter': {
    shortIntro:
      'The TechTools JSON Formatter and Validator is a high-speed, 100% in-browser utility engineered for software developers, API architects, and DevOps engineers to parse, validate, beautify, and minify complex JSON payloads with instant real-time syntax error diagnosis and zero data transmission.',
    whatIsThis:
      'JSON (JavaScript Object Notation) is the ubiquitous standard data interchange format powering modern RESTful APIs, microservices, and web configuration files. When APIs return minified, single-line, or malformed JSON payloads, debugging nested objects, arrays, and type mismatches becomes difficult. The TechTools JSON Formatter parses your input stream directly inside your browser engine using optimized JavaScript AST parsing. It identifies unclosed brackets, missing quotes, illegal trailing commas, and unexpected tokens with exact line and column numbers. Because processing occurs entirely client-side, your confidential API tokens, customer records, and internal schema payloads remain strictly private on your device without ever touching external servers.',
    howToUseSteps: [
      'Paste your raw, unformatted, or minified JSON code into the primary code editor area, or upload a .json file directly.',
      'Select your preferred indentation formatting style: choose 2 spaces for standard JavaScript/TypeScript workflows, 4 spaces for backend environments, or tab indentation.',
      'Click "Format / Beautify" to instantly transform messy payloads into clean, readable code with syntax highlighting.',
      'If your JSON contains syntax errors, consult the real-time validator indicator highlighting the exact line number and invalid character token.',
      'Click "Minify" to strip all unnecessary whitespaces and line breaks when preparing payloads for production APIs, or click "Copy" to transfer the result to your clipboard.',
    ],
    featuresBenefits: [
      {
        title: 'Instant Syntax Validation',
        desc: 'Detects broken JSON syntax, trailing commas, missing colons, and illegal quotes in real time with line-by-line diagnostic pointers.',
      },
      {
        title: 'Custom Indentation & Beautification',
        desc: 'Configurable 2-space, 4-space, or tab indentations tailored to ESLint, Prettier, or backend code standards.',
      },
      {
        title: 'Production Minification & Compression',
        desc: 'Strips whitespace, indentation, and newlines in milliseconds to minimize HTTP payload transfer size.',
      },
      {
        title: '100% Client-Side Privacy',
        desc: 'All formatting happens locally in browser memory. Sensitive customer data, auth tokens, and logs are never uploaded.',
      },
      {
        title: 'Zero Latency & Multi-Megabyte Support',
        desc: 'Engineered with optimized browser buffers capable of parsing large multi-megabyte JSON files without UI freezing.',
      },
    ],
    useCases: [
      {
        title: 'REST API & GraphQL Debugging',
        scenario: 'Quickly inspect and clean raw HTTP response payloads from Postman, curl, or browser DevTools network tabs.',
      },
      {
        title: 'Configuration File Cleaning',
        scenario: 'Format and validate complex configuration files such as package.json, tsconfig.json, or Docker/Kubernetes config maps.',
      },
      {
        title: 'Payload Size Optimization',
        scenario: 'Minify JSON payloads prior to saving them in Redis caches, NoSQL document stores, or transmitting via WebSockets.',
      },
      {
        title: 'Data Structure Verification',
        scenario: 'Verify that webhook payloads sent from Stripe, GitHub, or Shopify adhere strictly to valid JSON RFC 8259 specs.',
      },
    ],
    faqs: [
      {
        question: 'Is my JSON data uploaded to your servers or logged anywhere?',
        answer:
          'No. All validation, formatting, and minification algorithms run 100% client-side inside your browser sandbox using native JavaScript execution. Your payloads, API keys, and sensitive data never leave your local computer.',
      },
      {
        question: 'What is the difference between JSON formatting and JSON minification?',
        answer:
          'JSON formatting (beautification) adds consistent whitespace, indentation (such as 2 or 4 spaces), and line breaks to make data human-readable. JSON minification removes all unnecessary spaces and newlines, reducing file size and bandwidth consumption for network transmission.',
      },
      {
        question: 'Why does my JSON show a "Trailing Comma" error?',
        answer:
          'According to the official JSON specification (RFC 8259), commas are only permitted between elements, never after the final property in an object or array. Our validator flags trailing commas so your payloads do not crash strict JSON parsers.',
      },
      {
        question: 'Can this tool format large JSON files (e.g. 10MB+)?',
        answer:
          'Yes. Our parser utilizes high-performance browser memory buffers that easily handle multi-megabyte payloads without lag or memory leaks.',
      },
      {
        question: 'Can I convert JSON to other data formats like CSV or YAML?',
        answer:
          'Yes! TechTools provides companion tools like JSON to CSV Converter and YAML to JSON Converter accessible directly from the related utilities section below.',
      },
      {
        question: 'Does the tool work completely offline?',
        answer:
          'Yes. Once the page is loaded in your browser, the JSON formatter functions completely offline without requiring an active internet connection.',
      },
    ],
  },
  'base64-encoder-decoder': {
    shortIntro:
      'Fast, secure, and bidirectional Base64 Encoder and Decoder supporting full UTF-8 character encoding, data URI generation, and binary conversion directly in your browser with zero latency.',
    whatIsThis:
      'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation. It is widely used across web development, email transmission (MIME), HTTP basic authentication headers, and inline image embeds. The TechTools Base64 utility provides robust bidirectional conversion between plain UTF-8 text and standard RFC 4648 Base64 strings. Unlike basic tools that break on emojis or international Unicode characters, our engine includes full UTF-8 byte stream serialization.',
    howToUseSteps: [
      'Choose your desired mode: click "Encode" to convert plain text into Base64, or click "Decode" to convert a Base64 string back into readable text.',
      'Type or paste your content directly into the primary input textarea, or load sample data.',
      'The conversion executes automatically in real time as you type.',
      'Review character count, byte size comparison, and generated data URI formats.',
      'Click "Copy Output" to immediately transfer the converted string to your system clipboard.',
    ],
    featuresBenefits: [
      {
        title: 'Full UTF-8 & Unicode Support',
        desc: 'Encodes and decodes special characters, international alphabets, and emojis without data corruption or escaping errors.',
      },
      {
        title: 'Instant Real-Time Conversion',
        desc: 'Zero button lag with instant bidirectional translation updated live on every keystroke.',
      },
      {
        title: 'Data URI & Header Generator',
        desc: 'Easily formats Base64 strings for direct use in HTML image tags, CSS backgrounds, or HTTP Basic Auth headers.',
      },
      {
        title: '100% Client-Side Privacy',
        desc: 'Your credentials, auth tokens, and private strings are never transmitted across the network.',
      },
    ],
    useCases: [
      {
        title: 'HTTP Basic Authentication',
        scenario: 'Encode username:password pairs into Base64 strings for Authorization headers in API clients and curl requests.',
      },
      {
        title: 'Embedding Inline Media',
        scenario: 'Convert small icons, SVGs, and fonts into Base64 data URIs for embedding directly into CSS and HTML files.',
      },
      {
        title: 'Safe Data Transmission',
        scenario: 'Prevent corruption of binary or special character strings when transmitting payloads across legacy text protocols.',
      },
    ],
    faqs: [
      {
        question: 'Is Base64 a form of encryption?',
        answer:
          'No. Base64 is an encoding format, not encryption. Anyone can decode a Base64 string back to its original plain text. It should never be used on its own to hide passwords or confidential secrets without cryptographic encryption.',
      },
      {
        question: 'Why does Base64 increase data size by ~33%?',
        answer:
          'Base64 takes 3 bytes of binary data (24 bits) and splits them into 4 6-bit chunks, representing each with an ASCII character. This creates a predictable 33% increase in data length.',
      },
      {
        question: 'Does this tool support international characters and emojis?',
        answer:
          'Yes. Our encoder implements comprehensive UTF-8 byte serialization so characters like accented letters, Cyrillic, Arabic, Chinese, and emojis are preserved perfectly during encoding and decoding.',
      },
      {
        question: 'Are my encoded strings stored on TechTools servers?',
        answer:
          'Never. All encoding and decoding operations execute solely in your local browser sandbox.',
      },
    ],
  },
  'regex-tester': {
    shortIntro:
      'Interactive Regular Expression Tester and Debugger with live matching, capture group inspection, regex flags toggle, and instant syntax validation for JavaScript and PCRE patterns.',
    whatIsThis:
      'Regular expressions (Regex) are powerful strings describing search patterns in text. They are critical for form input validation, data extraction, string parsing, and web scraping. However, complex regex patterns with lookaheads, capture groups, and nested quantifiers are notoriously difficult to debug. The TechTools Regex Tester provides an instant, interactive sandbox where you can test regular expressions against arbitrary test strings with real-time match highlighting, group breakdowns, and flag adjustments.',
    howToUseSteps: [
      'Enter your regular expression pattern into the Regex input field (e.g. ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$).',
      'Toggle active regex flags such as Global (g), Case-Insensitive (i), Multiline (m), and DotAll (s).',
      'Paste your sample test text into the test string container.',
      'Observe real-time colored match highlighting and inspect matched groups in the results table.',
      'Copy clean replacement strings or export verified patterns into your codebase.',
    ],
    featuresBenefits: [
      {
        title: 'Live Interactive Highlighting',
        desc: 'Every matched substring is highlighted in real time as you adjust the pattern or sample text.',
      },
      {
        title: 'Capture Group Breakdown',
        desc: 'Inspect full matches alongside named and numbered capture groups with exact start/end index positions.',
      },
      {
        title: 'Pre-Built Pattern Library',
        desc: 'One-click presets for common expressions including emails, URLs, IPv4/IPv6 addresses, dates, and phone numbers.',
      },
      {
        title: 'Comprehensive Flags Engine',
        desc: 'Easily toggle g, i, m, s, u, and y flags to simulate exact production regex runtime environments.',
      },
    ],
    useCases: [
      {
        title: 'Frontend Input Validation',
        scenario: 'Validate user inputs such as postal codes, credit cards, emails, and passwords before deploying frontend forms.',
      },
      {
        title: 'Log Parsing & ETL Pipelines',
        scenario: 'Craft precise regex extraction patterns for server access logs, error traces, and unstructured text files.',
      },
      {
        title: 'Find & Replace Operations',
        scenario: 'Simulate complex regex substitution patterns before executing batch find-and-replace in code editors.',
      },
    ],
    faqs: [
      {
        question: 'Which regular expression engine does this tester use?',
        answer:
          'This tool uses the standard ECMAScript (JavaScript) RegExp engine, which is 100% compatible with modern browser and Node.js environments.',
      },
      {
        question: 'What do the regex flags (g, i, m, s) do?',
        answer:
          'The "g" flag finds all matches rather than stopping at the first; "i" ignores uppercase/lowercase differences; "m" treats beginning and end characters (^ and $) as working across each line; "s" allows the dot (.) character to match newline characters.',
      },
      {
        question: 'Can I test catastrophic backtracking (ReDoS) safely?',
        answer:
          'Our sandbox includes execution timeouts to prevent browser lockups when testing complex nested quantifier patterns.',
      },
      {
        question: 'Is my test text private?',
        answer:
          'Yes. All regex evaluation is performed locally in your browser with zero network transmission.',
      },
    ],
  },
};

/**
 * Returns comprehensive enriched SEO supporting content for any tool,
 * meeting the 600-1200 word count ideal SEO structure.
 */
export function getEnrichedToolSEO(tool: ToolItem, category?: ToolCategory): ToolEnrichedSEO {
  // Check if we have tailored curated content for this specific slug
  const curated = CURATED_TOOL_SEO[tool.slug];

  // Tool title & Short Intro (30-60 words)
  const shortIntro =
    tool.shortIntro ||
    curated?.shortIntro ||
    `${tool.name} is a free, high-performance online utility designed by TechTools to help developers, designers, and professionals ${tool.description.toLowerCase()} Enjoy instant execution, complete data privacy with 100% in-browser processing, and zero server storage overhead.`;

  // What is this tool? (100-150 words)
  const isAI = tool.type === 'ai' || tool.category === 'ai-tools';
  const whatIsThis =
    tool.whatIsThis ||
    curated?.whatIsThis ||
    (isAI
      ? `${tool.name} is an advanced artificial intelligence utility powered by Google Gemini 2.5 Flash inference. It delivers real-time assistance, natural language reasoning, and automated code or text transformations directly within your browser. Unlike generic chat interfaces, ${tool.name} is specifically tuned with specialized system prompts and deterministic parameter constraints to deliver clean, accurate, production-ready outputs. All requests are processed with strict enterprise-grade privacy guarantees: your input text, database schemas, and proprietary documents are evaluated transiently and are never logged, stored in persistent databases, or used for model training.`
      : `${tool.name} is a dedicated, browser-native utility built to streamline workflows for ${tool.categoryName?.toLowerCase() || 'technical workflows'}. It eliminates the need for heavyweight desktop software, sketchy ad-filled converter websites, or complex CLI installations by running all calculation, transformation, and validation algorithms directly inside your client browser engine. Leveraging modern Web APIs, WebAssembly, and optimized JavaScript data structures, ${tool.name} processes your inputs with zero latency and absolute data confidentiality. Your sensitive files, strings, and inputs remain 100% private on your machine, ensuring total compliance with modern security and data protection standards.`);

  // How to use it (100-200 words)
  const howToUseSteps =
    (tool.howToUse && tool.howToUse.length >= 2 ? tool.howToUse : null) ||
    curated?.howToUseSteps || [
      `Navigate to the ${tool.name} workspace on this page.`,
      `Enter, paste, or configure your source data into the input controls.`,
      `Adjust any custom options, formatting styles, or parameter settings to match your project requirements.`,
      `View the instant real-time result rendered in the output canvas.`,
      `Use the one-click "Copy" button to grab the result, or download the formatted output directly to your device.`,
    ];

  // Features / Benefits (100-200 words)
  const featuresBenefits =
    (tool.featuresBenefits && tool.featuresBenefits.length > 0 ? tool.featuresBenefits : null) ||
    curated?.featuresBenefits ||
    (tool.features && tool.features.length >= 2
      ? tool.features.map((feat) => ({
          title: feat.split(' - ')[0] || feat.split(':')[0] || 'Key Capability',
          desc: feat.includes('-') ? feat.split('-').slice(1).join('-').trim() : feat,
        }))
      : [
          {
            title: '100% Client-Side Privacy',
            desc: 'Processes all calculations and data transformations locally in browser memory without sending payloads to external servers.',
          },
          {
            title: 'Blazing Fast Execution',
            desc: 'Zero network latency roundtrips for client-side tools, delivering instant live feedback as you type.',
          },
          {
            title: 'Intuitive & Responsive Design',
            desc: 'Engineered for seamless productivity across desktop workstations, tablets, and mobile screens.',
          },
          {
            title: 'No Installation Required',
            desc: 'Access powerful technical tools immediately without installing npm packages, browser extensions, or binary executables.',
          },
          {
            title: 'Free & Unrestricted Access',
            desc: 'Enjoy generous quotas and free access with no credit card or mandatory sign-up required.',
          },
        ]);

  // Examples / Use Cases (100-200 words)
  const useCases =
    (tool.useCases && tool.useCases.length > 0 ? tool.useCases : null) ||
    (tool.examples && tool.examples.length > 0
      ? tool.examples.map((ex) => ({
          title: ex.title,
          scenario: ex.description,
        }))
      : null) ||
    curated?.useCases || [
      {
        title: `Accelerating ${tool.categoryName || 'Productivity'} Tasks`,
        scenario: `Eliminate repetitive manual tasks and eliminate human errors when working with ${tool.tags?.slice(0, 3).join(', ') || 'data'} in daily projects.`,
      },
      {
        title: 'Production Debugging & QA Testing',
        scenario: `Quickly verify, clean, and validate inputs before deploying them to production environments or sharing with team members.`,
      },
      {
        title: 'Cross-Platform Compatibility',
        scenario: `Standardize workflows across Mac, Windows, Linux, and mobile devices without environment setup issues.`,
      },
      {
        title: 'Secure Sensitive Data Handling',
        scenario: `Safely manipulate proprietary tokens, customer data, and internal schemas knowing no logs or telemetry are stored.`,
      },
    ];

  // FAQs (4-8 questions, ~250-500 words)
  const baseFaqs =
    (tool.faqs && tool.faqs.length >= 2 ? tool.faqs : null) ||
    curated?.faqs ||
    tool.faqs ||
    [];
  const standardFaqs: ToolFAQ[] = [
    {
      question: `Is ${tool.name} completely free to use?`,
      answer: `Yes, ${tool.name} is 100% free to use on TechTools. You can use it as often as you need with generous daily allowances and no hidden charges.`,
    },
    {
      question: `Is my data stored or logged when using ${tool.name}?`,
      answer: isAI
        ? `No. Requests sent to our AI models are processed transiently via secure TLS connections and are never saved to databases or used to train public machine learning models.`
        : `No. ${tool.name} operates 100% client-side inside your browser sandbox. Your input data never leaves your device or touches any server.`,
    },
    {
      question: `Does ${tool.name} work offline?`,
      answer: isAI
        ? `AI tools require an internet connection to communicate with the Gemini inference engine, but all response rendering happens smoothly in your browser.`
        : `Yes! Once this webpage is loaded, the client-side algorithms function entirely offline without requiring an active internet connection.`,
    },
    {
      question: `Can I use ${tool.name} on mobile devices?`,
      answer: `Yes. TechTools is fully responsive and optimized for mobile touchscreens, tablets, and ultra-wide desktop monitors alike.`,
    },
    {
      question: `How does ${tool.name} ensure output accuracy?`,
      answer: `Our tools are built against strict industry standards (such as RFC specifications, IEEE standards, and standard cryptographic algorithms) to guarantee exact mathematical and syntactic accuracy.`,
    },
    {
      question: `Can I bookmark or save ${tool.name} for quick access?`,
      answer: `Yes! Click the "Favorite" heart icon at the top of the tool page to pin it to your personal favorites dashboard for instant one-click access anytime.`,
    },
  ];

  // Combine unique FAQs up to 6-8 items
  const combinedFaqs: ToolFAQ[] = [...baseFaqs];
  for (const sf of standardFaqs) {
    if (combinedFaqs.length >= 6) break;
    if (!combinedFaqs.some((f) => f.question.toLowerCase() === sf.question.toLowerCase())) {
      combinedFaqs.push(sf);
    }
  }

  // Estimate total word count
  const allText = [
    shortIntro,
    whatIsThis,
    ...howToUseSteps,
    ...featuresBenefits.map((f) => `${f.title} ${f.desc}`),
    ...useCases.map((u) => `${u.title} ${u.scenario}`),
    ...combinedFaqs.map((faq) => `${faq.question} ${faq.answer}`),
  ].join(' ');

  const wordCountEstimate = allText.split(/\s+/).filter(Boolean).length;

  return {
    shortIntro,
    whatIsThis,
    howToUseSteps,
    featuresBenefits,
    useCases,
    faqs: combinedFaqs,
    wordCountEstimate,
  };
}

/**
 * Generates Schema.org JSON-LD Structured Data for the Tool Page:
 * 1. WebApplication / SoftwareApplication
 * 2. FAQPage
 * 3. HowTo
 * 4. BreadcrumbList
 */
export function generateToolJsonLd(
  tool: ToolItem,
  category: ToolCategory | undefined,
  enriched: ToolEnrichedSEO,
  appUrl: string = SEO_CONFIG.siteUrl
) {
  const toolUrl = `${appUrl}/tools/${tool.slug}`;
  const categoryUrl = `${appUrl}/categories/${tool.category}`;

  // WebApplication Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${toolUrl}#webapp`,
    name: tool.name,
    headline: tool.seoTitle || `${tool.name} - Free Online Tool`,
    description: tool.seoDescription || tool.description,
    url: toolUrl,
    applicationCategory: tool.categoryName || 'DeveloperApplication',
    operatingSystem: 'All (Web Browser, Chrome, Firefox, Safari, Edge)',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '2.5.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: enriched.featuresBenefits.map((f) => `${f.title}: ${f.desc}`).join(', '),
    author: {
      '@type': 'Organization',
      name: 'TechUsar TechTools',
      url: appUrl,
    },
  };

  // FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${toolUrl}#faq`,
    mainEntity: enriched.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // HowTo Schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${toolUrl}#howto`,
    name: `How to use ${tool.name}`,
    description: `Step-by-step instructions on how to use ${tool.name} online for free.`,
    step: enriched.howToUseSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Step ${index + 1}`,
      text: step,
      url: `${toolUrl}#step-${index + 1}`,
    })),
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: appUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category?.name || tool.categoryName || 'Categories',
        item: categoryUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: toolUrl,
      },
    ],
  };

  return [webAppSchema, faqSchema, howToSchema, breadcrumbSchema];
}
