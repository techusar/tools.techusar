import { ToolFAQ } from '@/lib/types';

export const COMPREHENSIVE_TOOL_FAQS: Record<string, ToolFAQ[]> = {
  'unix-timestamp-converter': [
    {
      question: 'What is a Unix epoch timestamp and how is it measured?',
      answer:
        'A Unix timestamp represents the exact number of seconds (or milliseconds) that have elapsed since the Unix epoch at 00:00:00 UTC on Thursday, January 1, 1970, excluding leap seconds. It provides a timezone-independent, universal integer representation of moments in time across distributed databases, servers, and APIs.',
    },
    {
      question: 'How do I distinguish between seconds and milliseconds timestamps?',
      answer:
        'Standard 10-digit integers (e.g. 1740000000) count seconds and are commonly used by POSIX systems, Python, PHP, and databases like PostgreSQL. 13-digit integers (e.g. 1740000000000) count milliseconds and are standard in JavaScript (`Date.now()`), Java, and modern REST APIs. TechTools automatically detects whether your input is in seconds, milliseconds, or microseconds.',
    },
    {
      question: 'What is the Year 2038 problem (Y2038) and how does this tool handle it?',
      answer:
        'The Year 2038 problem occurs on legacy 32-bit systems where signed integers overflow past 03:14:07 UTC on January 19, 2038 (timestamp 2,147,483,647). TechTools computes conversions using modern 64-bit IEEE 754 floating point numbers and BigInt arithmetic, safely supporting dates far beyond 2038 and before 1970.',
    },
    {
      question: 'Does this converter account for daylight saving time (DST) and timezones?',
      answer:
        'Yes. The converter outputs UTC alongside your local timezone, ISO 8601 strings, RFC 2822 formatting, and relative time expressions. Because epoch values are strictly UTC, timezone offsets and DST transitions are computed accurately based on your browser locale.',
    },
    {
      question: 'Is any timestamp data logged or sent to external servers?',
      answer:
        'No. All timestamp parsing, timezone translations, and human-readable formatting happen 100% client-side inside your browser sandbox. No date values or location data are ever transmitted or tracked.',
    },
  ],

  'ai-text-summarizer': [
    {
      question: 'How does the AI Text Summarizer analyze and compress long documents?',
      answer:
        'Our text summarizer leverages Google Gemini models running on secure inference endpoints. It evaluates linguistic hierarchy, semantic weight, key arguments, and quantitative evidence, condensing dense essays, technical whitepapers, research articles, or meeting transcripts into coherent executive summaries or bullet points.',
    },
    {
      question: 'Can I control the summary format and level of detail?',
      answer:
        'Yes. You can select between executive bullet points, a concise single-paragraph brief, or key takeaway action items. The output is structured to preserve core facts, statistics, and essential conclusions without introducing hallucinations or losing critical nuances.',
    },
    {
      question: 'Is my confidential text or proprietary document stored or used for AI training?',
      answer:
        'No. Content sent to our AI API is processed in real time via encrypted TLS connections with zero data retention. Your inputs are never stored in databases, never logged, and are never used to train or fine-tune public foundation models.',
    },
    {
      question: 'What is the maximum text length supported by the summarizer?',
      answer:
        'The tool comfortably supports large articles, essays, and reports up to several thousand words in a single pass. For multi-chapter books or massive PDF documents, summarizing section by section delivers the highest level of conceptual accuracy.',
    },
    {
      question: 'Can the summarizer process languages other than English?',
      answer:
        'Yes. The underlying AI model natively supports over 50 languages, including Spanish, French, German, Urdu, Arabic, Hindi, Chinese, and Japanese, accurately summarizing foreign-language source materials into the language of your choice.',
    },
  ],

  'ai-rewriter': [
    {
      question: 'How does the AI Content Rewriter preserve original meaning while changing style?',
      answer:
        'The AI paraphrasing engine analyzes the semantic core of each sentence before generating alternative phrasing. It restructures syntax, replaces repetitive vocabulary with context-appropriate synonyms, and improves flow while rigorously keeping original facts, claims, and data points intact.',
    },
    {
      question: 'Which writing tones and personas are available?',
      answer:
        'You can choose from multiple stylistic tones including Professional (ideal for business emails and reports), Casual (great for social media and blogs), Academic (for research and formal papers), and Creative (for engaging copy and storytelling).',
    },
    {
      question: 'Does rewriting help eliminate accidental plagiarism and improve readability?',
      answer:
        'Yes. By transforming passive voice to active voice, breaking down convoluted clauses, and offering diverse sentence structures, the tool produces original phrasing that improves Flesch-Kincaid readability scores while preventing duplicate phrasing penalties.',
    },
    {
      question: 'Is my input text stored or monitored on any server?',
      answer:
        'No. Texts submitted to our AI rewriting utility are handled ephemerally during generation and are never logged, cataloged, or saved to persistent storage. Your privacy and intellectual property are strictly safeguarded.',
    },
  ],

  'ai-grammar-fixer': [
    {
      question: 'How does this tool differ from traditional spellcheckers?',
      answer:
        'Unlike basic dictionary spellcheckers that only flag misspelled words, our AI Grammar & Style Fixer analyzes full contextual relationships across paragraphs. It corrects subtle subject-verb agreement mismatches, dangling modifiers, incorrect prepositions, missing punctuation, and stylistic inconsistencies.',
    },
    {
      question: 'Does the tool support regional English variations like UK and US spelling?',
      answer:
        'Yes. The model recognizes American English (e.g., "color", "organize"), British English (e.g., "colour", "organise"), Canadian, and Australian conventions, adapting spellings and punctuation norms (such as Oxford commas and quotation styling) consistently.',
    },
    {
      question: 'Can I see an explanation of why changes were suggested?',
      answer:
        'Yes. Along with the corrected prose, the tool provides concise grammatical notes explaining punctuation rules, passive-to-active voice improvements, and conciseness enhancements so you can improve your writing skills over time.',
    },
    {
      question: 'Is there a limit on how many sentences I can check at once?',
      answer:
        'You can paste entire articles, emails, cover letters, or academic essays with several hundred words. For extensive manuscripts, checking section-by-section allows you to review stylistic refinements with maximum precision.',
    },
  ],

  'ai-code-explainer': [
    {
      question: 'Which programming languages can the AI Code Explainer analyze?',
      answer:
        'The AI Code Explainer understands virtually all modern and legacy programming languages, including TypeScript, JavaScript, Python, Rust, Go, C++, C#, Java, SQL, PHP, Ruby, Kotlin, Swift, Bash, and Terraform. It interprets syntax, standard library functions, and complex design patterns.',
    },
    {
      question: 'Can this tool detect bugs, security vulnerabilities, or performance bottlenecks?',
      answer:
        'Yes. Beyond explaining how code functions line-by-line, the model reviews edge cases, potential null pointer exceptions, unhandled Promise rejections, memory leaks, and Big-O algorithmic complexity, suggesting optimized refactorings with modern idioms.',
    },
    {
      question: 'Is proprietary source code or intellectual property exposed?',
      answer:
        'No. Code submitted for explanation is passed securely via transient API inference without logging or caching. No proprietary code snippets, business logic, or internal algorithms are ever saved to disk or utilized for model training.',
    },
    {
      question: 'Can it convert or translate code between different languages?',
      answer:
        'While primarily built to explain logic and architecture, the AI model can also provide side-by-side translated snippets (e.g. converting a Python script into idiomatic TypeScript or Go).',
    },
  ],

  'ai-regex-generator': [
    {
      question: 'How do I describe what I want the RegEx pattern to match?',
      answer:
        'Simply state your requirement in plain English. For example, "Match international phone numbers with optional country codes", "Extract hex color codes from CSS", or "Validate strong passwords with uppercase, numbers, and symbols". The AI interprets your constraints and outputs the exact regular expression.',
    },
    {
      question: 'Does the generator include matching flags and breakdown explanations?',
      answer:
        'Yes. Along with the regex string, the tool outputs recommended flags (such as `g` for global, `i` for case-insensitive, `m` for multiline) and a comprehensive token-by-token explanation of capture groups, character classes, lookaheads, and quantifiers.',
    },
    {
      question: 'Can I immediately test the generated regular expression against sample inputs?',
      answer:
        'Yes! You can copy the generated pattern directly into our companion Regex Tester tool on TechTools with one click to verify positive and negative test cases against real strings in real time.',
    },
    {
      question: 'Which RegEx dialect or flavor is generated by default?',
      answer:
        'The generator targets standard ECMAScript / PCRE syntax by default, making it directly compatible with JavaScript, TypeScript, Python, PHP, Java, and Go regex engines.',
    },
  ],

  'ai-seo-meta-generator': [
    {
      question: 'Why are pixel and character limits crucial for SEO title tags and meta descriptions?',
      answer:
        'Google typically truncates title tags exceeding ~60 characters (or approximately 580-600 pixels) and meta descriptions longer than ~155-160 characters on desktop (or ~120 characters on mobile). Staying within optimal limits ensures your search snippet renders cleanly without trailing ellipses ("...").',
    },
    {
      question: 'How does the generator incorporate targeted keywords naturally?',
      answer:
        'The AI generates high-converting titles and descriptions that position primary keywords near the beginning while maintaining natural, persuasive phrasing with clear calls-to-action (CTAs) that maximize organic search Click-Through Rates (CTR).',
    },
    {
      question: 'Can I generate multiple variations for A/B testing?',
      answer:
        'Yes. The tool produces multiple high-ranking variations including question-based headlines, number-driven titles, value-proposition hooks, and brand-first titles so you can test which snippet yields the best CTR.',
    },
    {
      question: 'Does it generate Open Graph social media tags as well?',
      answer:
        'Yes. You can use the generated copy directly in your Open Graph (`og:title`, `og:description`) and Twitter Card tags. For complete tag markup, pair this tool with our OG Meta Generator utility.',
    },
  ],

  'ai-email-writer': [
    {
      question: 'Can this tool write cold outreach, client proposals, and support responses?',
      answer:
        'Yes. The AI Email Writer generates polished drafts for cold sales pitches, project proposals, follow-up messages, salary negotiations, customer service replies, meeting requests, and formal apologies with context-appropriate etiquette.',
    },
    {
      question: 'How do I generate an email reply to a message I received?',
      answer:
        'Simply paste the incoming email into the prompt area and specify your desired response intention (e.g., "Politely decline the vendor offer while leaving the door open for next quarter"). The AI structures a courteous, professionally phrased reply.',
    },
    {
      question: 'Can I customize the greeting, sign-off, and tone?',
      answer:
        'Yes. You can toggle between Executive, Casual, Direct, Formal, or Friendly tones, and easily configure placeholders for recipient names, company branding, and personal sign-offs.',
    },
    {
      question: 'Is my email draft private and confidential?',
      answer:
        'Yes. All requests are processed securely with zero server storage. Client names, financial details, and proprietary notes are never stored or reviewed.',
    },
  ],

  'image-to-base64': [
    {
      question: 'Why would I convert an image into a Base64 data URI string?',
      answer:
        'Base64 data URIs allow you to embed small images, SVGs, or icons directly into HTML, CSS, or JSON payloads without triggering additional HTTP requests. This reduces latency on critical rendering paths, speeds up email template loading, and simplifies offline single-file bundles.',
    },
    {
      question: 'What are the downsides of using Base64 strings for large images?',
      answer:
        'Base64 encoding increases overall payload size by approximately 33% compared to raw binary files. For large photos (over 100KB), standard image formats (like WebP or AVIF) served via CDN caching are significantly more efficient. Base64 is best reserved for inline icons, favicons, and critical UI badges.',
    },
    {
      question: 'Does the tool provide ready-to-use HTML and CSS snippet formats?',
      answer:
        'Yes. TechTools instantly provides the raw Base64 string, the standard `data:image/...;base64,...` data URI, an ready-to-paste `<img src="...">` tag, and a CSS `background-image: url(...)` rule.',
    },
    {
      question: 'Is my uploaded image uploaded to a server for encoding?',
      answer:
        'No. The conversion is performed directly in your browser using the native HTML5 FileReader API. Your images never leave your computer, ensuring absolute privacy for proprietary designs and photos.',
    },
  ],

  'favicon-generator': [
    {
      question: 'What image formats and dimensions are needed for a modern favicon?',
      answer:
        'Modern browsers and mobile devices require multiple icon dimensions: standard 16x16 and 32x32 pixels for desktop browser tabs, 48x48 for legacy shortcuts, 180x180 for Apple Touch Icons (iOS home screen), and 192x192 / 512x512 for Progressive Web App (PWA) Android manifests.',
    },
    {
      question: 'Does this generator provide HTML `<link>` tags for my website `<head>`?',
      answer:
        'Yes. TechTools outputs the generated icon assets alongside clean, standards-compliant HTML markup ready to paste into your Next.js, HTML5, WordPress, or Vite header template.',
    },
    {
      question: 'How do I ensure my favicon looks crisp on both dark and light browser themes?',
      answer:
        'Use high-contrast glyphs or shapes with subtle borders or transparent surrounds. Avoid complex text or minute details that blur at 16x16 resolution, and test your icon against dark and light tab bars.',
    },
    {
      question: 'Are my brand logos uploaded to any external server?',
      answer:
        'No. All resizing, format conversions, and canvas rendering execute 100% locally in your browser memory. Your branding assets remain completely private.',
    },
  ],

  'case-converter': [
    {
      question: 'Which casing formats are supported by the Case Converter?',
      answer:
        'The tool supports all major programming and typography conventions: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE (screaming snake), Title Case, Sentence case, UPPERCASE, lowercase, and dot.case.',
    },
    {
      question: 'How does Title Case capitalization handle prepositions and conjunctions?',
      answer:
        'Our Title Case algorithm adheres to standard editorial style guides (such as Chicago and AP), automatically keeping minor words (like "and", "or", "in", "the", "of", "to") in lowercase unless they appear as the first or last word of the title.',
    },
    {
      question: 'Can I convert code identifiers or variables with spaces and symbols?',
      answer:
        'Yes. The converter intelligently parses spaces, underscores, hyphens, and existing camelCase boundaries, cleanly transforming multi-word identifiers between frontend (camelCase), backend (snake_case), and CSS (kebab-case) conventions.',
    },
    {
      question: 'Is there a character limit on text conversion?',
      answer:
        'No. You can paste thousands of lines of text or code. Everything executes instantly in client-side memory with zero latency.',
    },
  ],

  'text-diff': [
    {
      question: 'How does the Text Diff tool identify additions, deletions, and modifications?',
      answer:
        'The tool uses the Myers difference algorithm to compare two texts line-by-line and character-by-character. Insertions are highlighted in green, deletions in red, and in-line word edits with distinct shades for instant visual reconciliation.',
    },
    {
      question: 'Can I view the comparison in split-screen (side-by-side) or unified mode?',
      answer:
        'Yes. You can toggle between a side-by-side view (ideal for wide desktop screens and code reviews) and a unified inline view (great for tracking line edits and mobile viewing).',
    },
    {
      question: 'Can this tool compare code files, JSON payloads, or configuration files?',
      answer:
        'Absolutely. It is widely used by developers and DevOps engineers to compare `.env` files, JSON configs, SQL schemas, markdown drafts, and source code before deploying or merging changes.',
    },
    {
      question: 'Is my sensitive text or proprietary code sent to any server?',
      answer:
        'No. The diff computation runs 100% in-browser using JavaScript. Your confidential texts, contracts, and internal code snippets are never transmitted over the network.',
    },
  ],

  'lorem-ipsum-generator': [
    {
      question: 'What is Lorem Ipsum and why is it used in design mockups?',
      answer:
        'Lorem Ipsum is dummy placeholder text derived from classical Latin literature written by Cicero in 45 BC. Designers and developers use it to demonstrate visual typography, layouts, and font hierarchies without distracting reviewers with readable content.',
    },
    {
      question: 'Can I generate dummy text by word count, sentence count, or paragraph count?',
      answer:
        'Yes. You can choose exact quantities of words, sentences, or paragraphs, and toggle whether to start with the traditional "Lorem ipsum dolor sit amet..." opening phrase.',
    },
    {
      question: 'Can this tool wrap generated paragraphs in HTML `<p>` tags?',
      answer:
        'Yes. You can toggle HTML output mode to instantly copy text enclosed in `<p>`, `<ul><li>`, or blockquote tags, saving time when populating CMS entries or frontend templates.',
    },
    {
      question: 'Does the generator work offline?',
      answer:
        'Yes. Once the page is loaded, the text generator operates completely offline inside your browser.',
    },
  ],

  'serp-snippet-preview': [
    {
      question: 'How accurate is this Google SERP preview compared to real search results?',
      answer:
        'Our SERP Preview simulator precisely matches Google desktop and mobile search layout standards, including font styling (Arial), pixel-based truncation thresholds (~600px for titles, ~960px for descriptions), breadcrumb URL styling, and favicon display.',
    },
    {
      question: 'Why does Google measure title tag length in pixels rather than characters?',
      answer:
        'Different characters have different proportional widths (for instance, "W" takes significantly more horizontal pixels than "I" or "l"). Google search results allocate a fixed pixel container (roughly 600px on desktop); measuring by pixels gives you an exact guarantee against truncation.',
    },
    {
      question: 'Can I test mobile vs desktop search previews?',
      answer:
        'Yes. You can toggle seamlessly between Desktop and Mobile preview modes to verify that your headlines, meta descriptions, and URLs render cleanly across all device form factors.',
    },
    {
      question: 'Does this tool save or crawl my target URL?',
      answer:
        'No. The preview is rendered entirely locally on your screen in real time. No web crawlers or scrapers are dispatched, ensuring zero server footprint.',
    },
  ],

  'schema-markup-generator': [
    {
      question: 'What Schema.org structured data formats does this generator create?',
      answer:
        'It generates Google-recommended JSON-LD structured data for WebSite, Organization, LocalBusiness, Article, FAQPage, HowTo, Product, BreadcrumbList, and Event entities.',
    },
    {
      question: 'Why is JSON-LD preferred over Microdata or RDFa?',
      answer:
        'Google explicitly recommends JSON-LD because it sits cleanly inside a standalone `<script type="application/ld+json">` tag in the `<head>` or `<body>`. It does not require interleaving attributes into your HTML markup, making it easier to maintain and debug.',
    },
    {
      question: 'How do I validate the generated JSON-LD schema?',
      answer:
        'You can copy the generated JSON-LD block and test it directly in Google Rich Results Test or the Schema.org Validator to confirm zero syntax errors and verify rich snippet eligibility.',
    },
    {
      question: 'Can I generate nested schemas (e.g. an Article with an Organization publisher)?',
      answer:
        'Yes. The generator automatically builds hierarchical, interconnected schemas with proper `@id` cross-references and nested author/publisher objects.',
    },
  ],

  'utm-builder': [
    {
      question: 'What are UTM parameters and why are they necessary for analytics?',
      answer:
        'UTM (Urchin Tracking Module) parameters are five standard query tags appended to URLs: `utm_source` (where traffic comes from), `utm_medium` (channel type, e.g. email or cpc), `utm_campaign` (promo name), `utm_term` (paid keywords), and `utm_content` (creative variant). They allow Google Analytics 4 (GA4) and CRM tools to track campaign ROI accurately.',
    },
    {
      question: 'Does the tool automatically sanitize and URL-encode parameter values?',
      answer:
        'Yes. Spaces are automatically converted to hyphens or encoded as `%20`, and query parameters are cleanly joined using `?` and `&` delimiters without breaking existing URL anchors or hashes.',
    },
    {
      question: 'Can I build batch campaign links or shorten them?',
      answer:
        'You can generate links with real-time live preview, test the URL with one click, and copy the full tagged URL to pair with your preferred link shortener or marketing automation software.',
    },
    {
      question: 'Are my campaign names or destination URLs logged or shared?',
      answer:
        'No. All URL assembly and string encoding happen locally in your web browser. Confidential marketing campaign parameters and landing page paths are never saved or sent to any server.',
    },
  ],

  'percentage-calculator': [
    {
      question: 'What types of percentage calculations can this tool perform?',
      answer:
        'The calculator solves all common percentage problems: What is X% of Y?, What percentage is X of Y?, Percentage increase or decrease from X to Y, and Reverse percentage calculations (finding the base value before tax or discount).',
    },
    {
      question: 'How is percentage increase/decrease calculated mathematically?',
      answer:
        'Percentage change is calculated using the formula: `((New Value - Old Value) / |Old Value|) * 100`. The tool displays both the net percentage difference and the absolute numeric difference with step-by-step mathematical working.',
    },
    {
      question: 'Can I use negative numbers or decimal values in calculations?',
      answer:
        'Yes. The calculator fully supports negative percentages, floating point decimals, fractional values, and large commercial numbers with high numerical precision.',
    },
    {
      question: 'Does the tool retain any of my financial or academic calculations?',
      answer:
        'No. Calculations execute entirely in browser memory. No figures, formulas, or history are stored on any backend database.',
    },
  ],

  'age-calculator': [
    {
      question: 'How does the Age Calculator compute exact years, months, and days?',
      answer:
        'The calculator factors in the exact calendar differences between your birth date and the reference date, accounting for varying month lengths (28, 29, 30, or 31 days) and leap years to provide a mathematically precise breakdown.',
    },
    {
      question: 'Does the calculator show total elapsed days, hours, and minutes lived?',
      answer:
        'Yes. Alongside your age in years, months, and days, the tool displays lifetime totals: total weeks, total days, total hours, total minutes, and an exact countdown to your next birthday.',
    },
    {
      question: 'Can I calculate age as of a specific date in the past or future?',
      answer:
        'Yes. You can customize both the start date (date of birth) and the "Age at the Date of" field, making it easy to determine historical age for legal forms, visa applications, or retirement planning.',
    },
    {
      question: 'Is my birth date or personal information logged?',
      answer:
        'No. Your birth date is processed strictly in your local browser sandbox. TechTools stores zero personal identity information.',
    },
  ],

  'unit-converter': [
    {
      question: 'Which unit measurement categories are supported by the converter?',
      answer:
        'The tool converts units across all scientific and everyday domains: Length (meters, feet, inches, miles, km), Weight & Mass (kg, lbs, ounces, grams, stones), Temperature (Celsius, Fahrenheit, Kelvin), Area, Volume & Capacity, Digital Storage (bytes, MB, GB, TB), Speed, and Time.',
    },
    {
      question: 'How does the converter maintain precision across large scale conversions?',
      answer:
        'Conversions utilize high-precision SI base multipliers and exact thermodynamic formulas (such as `(F - 32) * 5/9` for temperature) to prevent rounding drift across multiple unit steps.',
    },
    {
      question: 'Does the tool support both Metric and Imperial / US Customary systems?',
      answer:
        'Yes. You can effortlessly convert between international Metric units (SI) and US Imperial / Customary standards with instant reciprocal conversion toggles.',
    },
    {
      question: 'Can I use this tool offline while traveling?',
      answer:
        'Yes! All conversion formulas and lookup tables are bundled locally in the client application, so it functions seamlessly without an active internet connection.',
    },
  ],

  'slug-generator': [
    {
      question: 'What is a URL slug and why is it important for SEO?',
      answer:
        'A URL slug is the human-readable, lowercase portion of a URL that identifies a specific page using descriptive keywords separated by hyphens (e.g., `techusar.com/tools/json-formatter`). Clean slugs improve Google crawlability, social link trust, and click-through rates.',
    },
    {
      question: 'How does the Slug Generator handle accents, diacritics, and special characters?',
      answer:
        'The generator performs comprehensive Unicode normalization (NFKD) to transliterate accented letters (like "é" to "e", "ü" to "u", "ñ" to "n"), strips illegal URL symbols (like quotes, commas, brackets, and emojis), and collapses consecutive spaces into single hyphens.',
    },
    {
      question: 'Can I remove common stop words (e.g. "a", "the", "and") for concise SEO slugs?',
      answer:
        'Yes. You can toggle optional stop-word filtering to keep your slugs concise, focused on high-intent target keywords, and clean for CMS publishing.',
    },
    {
      question: 'Is the slug generator suitable for WordPress, Next.js, and static site generators?',
      answer:
        'Yes. The output adheres to standard POSIX and web URL conventions, making it fully compatible with WordPress permalinks, Next.js dynamic routes, Hugo, Jekyll, and database identifiers.',
    },
  ],

  'color-converter': [
    {
      question: 'Which color spaces and formats can this tool convert between?',
      answer:
        'It converts seamlessly between HEX (#RRGGBB and #RRGGBBAA), RGB / RGBA, HSL / HSLA, HSV, and CMYK color models with real-time color swatch preview and opacity support.',
    },
    {
      question: 'Can I copy ready-to-use CSS syntax for modern web styling?',
      answer:
        'Yes. You can copy modern CSS formats with a single click, including standard `rgb(r, g, b)`, `rgba(r, g, b, a)`, and modern CSS Color Module Level 4 syntax like `hsl(210deg 50% 60% / 0.8)`.',
    },
    {
      question: 'How does the CMYK conversion work for print design?',
      answer:
        'CMYK percentages are calculated using standard subtractive color space formulas derived from RGB values, providing a reliable starting point for print assets, brochures, and branding palettes.',
    },
    {
      question: 'Is there a color picker tool included?',
      answer:
        'Yes. You can use the built-in HTML5 color picker to visually sample shades, or type in raw hex values, color names, or channel numbers directly.',
    },
  ],

  'wcag-contrast-checker': [
    {
      question: 'What are the WCAG 2.1 contrast ratio requirements for AA and AAA compliance?',
      answer:
        'Under WCAG 2.1: Level AA requires a minimum contrast ratio of 4.5:1 for regular text and 3:1 for large text (at least 18pt or 14pt bold) and graphical UI elements. Level AAA requires an enhanced contrast ratio of 7:1 for normal text and 4.5:1 for large text.',
    },
    {
      question: 'How is the color contrast ratio calculated mathematically?',
      answer:
        'Contrast ratio is calculated using relative luminance: `(L1 + 0.05) / (L2 + 0.05)`, where L1 is the relative luminance of the lighter color and L2 is the relative luminance of the darker color, normalized to an absolute scale from 1:1 (no contrast) to 21:1 (black on white).',
    },
    {
      question: 'Does the tool provide suggestions if my color combination fails compliance?',
      answer:
        'Yes. The tool features an intelligent shade adjuster that suggests the closest compliant foreground or background tint, helping designers achieve accessibility without discarding their brand identity.',
    },
    {
      question: 'Why is web accessibility compliance legally and commercially important?',
      answer:
        'Accessible color contrast ensures digital content is readable for users with low vision, cataracts, color blindness, or aging eyes. It also helps websites comply with legal frameworks (such as ADA Title III, Section 508, and the European Accessibility Act) while boosting SEO.',
    },
  ],

  'css-box-shadow-generator': [
    {
      question: 'How does this tool generate layered, realistic box shadows?',
      answer:
        'Rather than single harsh shadows, the generator allows you to create smooth, natural multi-layered ambient shadows (such as those popular in modern Tailwind and Neumorphic design systems) by combining subtle ambient occlusion layers with directional light sources.',
    },
    {
      question: 'What parameters can I customize for each shadow layer?',
      answer:
        'You can configure horizontal offset (X), vertical offset (Y), blur radius, spread radius, color, opacity, and toggle between outer shadows and inset (inner) shadows with live interactive rendering.',
    },
    {
      question: 'Does it output ready-to-paste CSS and Tailwind classes?',
      answer:
        'Yes. You can copy clean vanilla CSS (`box-shadow: ...;`) or arbitrary Tailwind CSS utility classes (`shadow-[...]`) directly into your project.',
    },
    {
      question: 'Can I test shadows on different background colors and border radiuses?',
      answer:
        'Yes. The interactive preview container allows you to change the background canvas and container shape to inspect how the shadow interacts with cards, buttons, modals, and dark mode containers.',
    },
  ],

  'pdf-viewer': [
    {
      question: 'How does this in-browser PDF viewer render documents without uploading them?',
      answer:
        'TechTools utilizes client-side WebAssembly and HTML5 Canvas rendering engines to parse and rasterize PDF pages directly in your browser memory. Your sensitive files, tax forms, and contracts never touch an external server.',
    },
    {
      question: 'Which viewing features are supported (zoom, pagination, search)?',
      answer:
        'The viewer supports page-by-page navigation, smooth thumbnail sidebar browsing, zoom in/out (from 25% to 400%), fit-to-width, fit-to-page, full screen mode, and document rotation.',
    },
    {
      question: 'Can I view password-protected PDF files?',
      answer:
        'Yes. If your PDF has user-level encryption, the viewer prompts you to enter the decryption password locally in your browser to unlock and render the contents securely.',
    },
    {
      question: 'What is the maximum PDF file size supported?',
      answer:
        'Because the viewer runs locally on your device hardware, it can comfortably open documents spanning hundreds of pages and tens of megabytes, limited only by your computer’s RAM.',
    },
  ],

  'pdf-metadata-viewer': [
    {
      question: 'What hidden metadata is embedded inside a standard PDF document?',
      answer:
        'PDF files typically store embedded metadata including Document Title, Author, Subject, Keywords, Creator application (e.g. Microsoft Word, InDesign, Canva), Producer engine (e.g. Acrobat Distiller, Quartz), Creation Date, Modification Date, and PDF version format.',
    },
    {
      question: 'Why should I inspect PDF metadata before sending documents to clients or the public?',
      answer:
        'PDF metadata can inadvertently leak confidential information, including internal usernames, company file paths, software license details, and previous editor revisions. Inspecting metadata ensures sensitive data is sanitized before public release.',
    },
    {
      question: 'Is my PDF uploaded to any server when inspecting metadata?',
      answer:
        'No. The metadata parser reads the PDF file header and XMP metadata packets strictly inside your local browser sandbox. Zero bytes are transferred across the network.',
    },
    {
      question: 'Does the tool extract embedded fonts and page count details?',
      answer:
        'Yes. The tool reveals the exact page count, page dimensions (Letter, A4, Custom), linearized (Fast Web View) status, and embedded font subsets.',
    },
  ],

  'jpg-to-png': [
    {
      question: 'What are the main advantages of converting JPG images to PNG format?',
      answer:
        'PNG uses lossless compression (DEFLATE algorithm), meaning image clarity and sharp edges do not degrade when repeatedly edited or saved. Converting JPG to PNG is ideal when you need to add transparent backgrounds, edit logos, or preserve crisp graphic lines in UI mockups.',
    },
    {
      question: 'Does converting JPG to PNG automatically restore lost image quality?',
      answer:
        'No. Because JPG is inherently a lossy format, any compression artifacts already baked into the original JPG cannot be magically restored. However, converting to PNG guarantees that no further compression artifacts will be introduced upon subsequent saves.',
    },
    {
      question: 'Can I batch convert multiple JPG files at once?',
      answer:
        'Yes. You can drag and drop multiple JPG or JPEG files and download individual PNG conversions or a single zip bundle in seconds.',
    },
    {
      question: 'Are my photos uploaded to external cloud servers for conversion?',
      answer:
        'No. All rasterization and PNG encoding occur 100% client-side using browser HTML5 Canvas buffers. Your personal photos and creative assets remain completely secure and private.',
    },
  ],

  'png-to-jpg': [
    {
      question: 'Why convert PNG images to JPG format?',
      answer:
        'PNG files for photographic images or complex textures can be very large (often 3MB to 10MB). Converting them to JPG applies perceptual lossy compression that can reduce file size by 70% to 90%, significantly accelerating web page load times and reducing storage requirements.',
    },
    {
      question: 'What happens to transparent backgrounds when converting PNG to JPG?',
      answer:
        'The standard JPEG format does not support alpha channel transparency. When converting a transparent PNG to JPG, the transparent areas are automatically replaced with a clean background color (white by default, or customizable).',
    },
    {
      question: 'Can I control the JPEG output quality slider?',
      answer:
        'Yes. You can adjust the quality compression ratio from 10% to 100% to find the exact balance between minimal file size and sharp visual presentation.',
    },
    {
      question: 'Does the conversion execute in-browser without server uploads?',
      answer:
        'Yes. The entire rendering and JPEG encoding process runs in your browser engine. Your files never leave your computer.',
    },
  ],

  'character-counter': [
    {
      question: 'What metrics are calculated by the Character Counter tool?',
      answer:
        'The tool computes comprehensive text statistics in real time: Total Characters (with and without spaces), Total Words, Sentences, Paragraphs, Estimated Reading Time (based on standard 200 wpm), and Speaking Time (based on 130 wpm).',
    },
    {
      question: 'Does the tool track social media character limits (Twitter/X, LinkedIn, Meta)?',
      answer:
        'Yes! The interface features visual progress meters indicating character thresholds for Twitter / X posts (280 characters), LinkedIn status updates (3,000 characters), Instagram captions (2,200 characters), and Google SEO meta descriptions (160 characters).',
    },
    {
      question: 'How does it count words in languages with complex character sets?',
      answer:
        'The counter uses Unicode-aware word boundary detection, accurately processing accented characters, emoji sequences, and CJK (Chinese, Japanese, Korean) ideographic scripts.',
    },
    {
      question: 'Is my written text logged, saved, or monitored?',
      answer:
        'No. Counting algorithms execute locally in JavaScript as you type or paste. No keystrokes or text snippets are ever logged or uploaded.',
    },
  ],

  'json-validator': [
    {
      question: 'How does this tool identify and diagnose invalid JSON syntax?',
      answer:
        'The validator parses your JSON through a strict native AST parser, instantly reporting the exact line number, column offset, and token error (such as unclosed curly braces, single quotes instead of double quotes, trailing commas, or missing colons).',
    },
    {
      question: 'Can this validator format and beautify the code after fixing errors?',
      answer:
        'Yes. Once your payload is valid, you can click Format to beautify the hierarchy with 2-space or 4-space indentation, or click Minify to compress it for production API requests.',
    },
    {
      question: 'Why are trailing commas illegal in JSON?',
      answer:
        'The official JSON standard (RFC 8259) prohibits commas after the last key-value pair in an object or array. While permitted in standard JavaScript, trailing commas cause hard parse errors in Python `json.loads()`, Java Jackson, and standard REST APIs.',
    },
    {
      question: 'Is it safe to validate sensitive production API keys or user data?',
      answer:
        'Yes. TechTools validates JSON 100% locally in your browser memory. Your sensitive database dumps, API tokens, and user records are never sent over the internet.',
    },
  ],

  'base64-encoder': [
    {
      question: 'What is Base64 encoding and why is it used in programming?',
      answer:
        'Base64 is a binary-to-text encoding scheme that translates raw bytes into a sequence of 64 ASCII printable characters (A-Z, a-z, 0-9, +, and /). It prevents data corruption when transferring binary payloads across protocols designed strictly for plain text, such as SMTP email and HTTP headers.',
    },
    {
      question: 'What does the "=" padding character represent at the end of a Base64 string?',
      answer:
        'Base64 processes binary data in 6-bit chunks (using 3 input bytes to produce 4 output characters). If the total number of input bytes is not divisible by 3, one or two "=" padding characters are appended to indicate the shortfall to the decoder.',
    },
    {
      question: 'Can this tool encode Unicode characters and emojis correctly?',
      answer:
        'Yes. The encoder uses modern UTF-8 byte serialization, ensuring non-ASCII characters, accented glyphs, and emojis encode cleanly without producing garbled characters.',
    },
    {
      question: 'Is my encoded text private?',
      answer:
        'Yes. All encoding happens instantly on your device via client-side JavaScript. No text is ever transmitted to an external server.',
    },
  ],

  'base64-decoder': [
    {
      question: 'How do I decode Base64 text back into human-readable characters?',
      answer:
        'Paste your Base64 encoded string into the input area. TechTools decodes the 6-bit character map back into original UTF-8 bytes and displays the decoded text with real-time error checking for invalid characters or malformed padding.',
    },
    {
      question: 'What causes an "Invalid Character" or "Malformed Input" error during decoding?',
      answer:
        'This error occurs if your input contains characters outside the standard Base64 alphabet (A-Z, a-z, 0-9, +, /) or if the string length is not a multiple of 4. TechTools highlights and cleans whitespace automatically to help you recover corrupted strings.',
    },
    {
      question: 'Can this decoder handle URL-safe Base64 strings?',
      answer:
        'Yes. TechTools automatically recognizes URL-safe Base64 variants where `+` is replaced with `-` and `/` is replaced with `_` (standard in JWT tokens and web URLs).',
    },
    {
      question: 'Is any of my decoded data logged or monitored?',
      answer:
        'No. Decoding executes strictly inside your browser sandbox. Sensitive decoded passwords, API secrets, and tokens remain completely private.',
    },
  ],

  'html-entities-encoder': [
    {
      question: 'What are HTML entities and why are they necessary for web security?',
      answer:
        'HTML entities are standardized character references (such as `&lt;` for `<` and `&amp;` for `&`) used to render reserved HTML characters as plain text. Encoding user inputs is a foundational defense against Cross-Site Scripting (XSS) attacks in web applications.',
    },
    {
      question: 'Which characters are converted during HTML encoding?',
      answer:
        "The encoder handles essential markup characters (`<`, `>`, `&`, `\"`, `'`) as well as extended typography symbols (copyright `&copy;`, em-dash `&mdash;`, non-breaking spaces `&nbsp;`), and mathematical symbols.",
    },
    {
      question: 'Can I decode HTML entities back into standard text?',
      answer:
        'Yes. You can switch between Encode and Decode modes with one click to easily inspect scraped web content, raw CMS responses, or email templates.',
    },
    {
      question: 'Does the tool support named, decimal, and hexadecimal entity formats?',
      answer:
        'Yes. You can choose whether to output named entities (e.g. `&quot;`), decimal entities (`&#34;`), or hex entities (`&#x22;`) based on your backend database requirements.',
    },
  ],

  'time-zone-converter': [
    {
      question: 'How does the Time Zone Converter compute international time differences?',
      answer:
        'The converter references the official IANA Time Zone Database (tzdata) integrated into modern browser engines, accurately mapping Daylight Saving Time (DST) changes, local UTC offsets, and historical shift rules across hundreds of global cities.',
    },
    {
      question: 'Can I coordinate multi-city meetings across different global timezones?',
      answer:
        'Yes. You can add multiple destination cities (e.g. New York, London, Dubai, Karachi, Tokyo, San Francisco) to see a synchronized visual timeline and identify overlapping working hours.',
    },
    {
      question: 'Does the converter account for upcoming Daylight Saving Time transitions?',
      answer:
        'Yes. Because it uses real calendar dates rather than static offsets, it reflects whether a target location will be on standard time or daylight saving time on your specified date.',
    },
    {
      question: 'Is my location or local timezone shared with any third party?',
      answer:
        'No. All timezone calculations are performed locally on your device with zero server tracking.',
    },
  ],

  'gpa-calculator': [
    {
      question: 'How is GPA calculated on standard 4.0 grading scales?',
      answer:
        'GPA is calculated by multiplying the grade point value of each course (e.g., A=4.0, B=3.0, C=2.0) by its course credit hours, summing the total grade points earned, and dividing by total attempted credits: `Total Quality Points / Total Credit Hours`.',
    },
    {
      question: 'Does the calculator support weighted and unweighted GPA scales?',
      answer:
        'Yes. You can toggle between unweighted 4.0 scales and weighted 5.0 scales that assign bonus honor points for Advanced Placement (AP), International Baccalaureate (IB), or Honors coursework.',
    },
    {
      question: 'Can I calculate cumulative GPA by factoring in prior semesters?',
      answer:
        'Yes. You can input your existing cumulative GPA and previous completed credits to see how your current semester grades will impact your overall graduation standing.',
    },
    {
      question: 'Is my academic coursework stored on TechTools?',
      answer:
        'No. All course names, grades, and credit entries are kept strictly in your local browser session and are never transmitted to any database.',
    },
  ],

  'pomodoro-timer': [
    {
      question: 'What is the Pomodoro Technique and how do the intervals work?',
      answer:
        'The Pomodoro Technique is a time-management methodology created by Francesco Cirillo. It breaks work into focused 25-minute sprints separated by short 5-minute breaks. After completing four consecutive sprints, you take an extended 15-30 minute break to recharge cognitive focus.',
    },
    {
      question: 'Can I customize work interval durations and break lengths?',
      answer:
        'Yes. You can customize the focus sprint duration (e.g., 25, 45, or 50 minutes), short break length, long break length, and the total interval cycle count to match your personal productivity flow.',
    },
    {
      question: 'Does the timer provide audio chimes and desktop browser notifications?',
      answer:
        'Yes. The timer features gentle audio alerts and optional browser desktop notifications so you know when a session ends even when working in another tab or application.',
    },
    {
      question: 'Does the timer keep running if I switch browser tabs?',
      answer:
        'Yes. The timer synchronizes against system timestamp delta counters rather than unreliable interval ticks, guaranteeing precise elapsed time even when your browser tab is in the background.',
    },
  ],

  'social-post-preview': [
    {
      question: 'Which social platforms can I preview with this tool?',
      answer:
        'You can preview real-time mockups for Twitter / X (Summary Large Image & Standard cards), LinkedIn Feed updates, Facebook link shares, and Slack / Discord messenger embeds.',
    },
    {
      question: 'Why are thumbnail dimensions and aspect ratios critical for social engagement?',
      answer:
        'Platforms automatically crop or letterbox images that do not adhere to standard aspect ratios (such as 1.91:1 or 1200x630 pixels). Previewing your post ensures crucial logos, text captions, and facial focal points remain visible in user feeds.',
    },
    {
      question: 'Can I test how Open Graph meta tags will render on a live website?',
      answer:
        'Yes. You can type in your intended headline, description, domain name, and upload or paste an image URL to simulate the exact social share card your audience will see.',
    },
    {
      question: 'Are my social copy drafts or images saved to your servers?',
      answer:
        'No. Everything is simulated in-memory within your browser. No drafts, links, or image uploads are ever stored.',
    },
  ],

  'css-gradient-generator': [
    {
      question: 'What types of CSS gradients can I generate with this tool?',
      answer:
        'You can create Linear Gradients (with custom degree angles), Radial Gradients (with circle or ellipse shapes and custom focal positions), and Conic Gradients (ideal for color wheels, pie segments, and rotating UI borders).',
    },
    {
      question: 'Can I add multiple color stops and adjust their percentage positions?',
      answer:
        'Yes. You can add unlimited color stops, fine-tune individual color hex/rgba values, and slide position percentages along the gradient axis with instant visual feedback.',
    },
    {
      question: 'Does the tool provide cross-browser fallback CSS and Tailwind classes?',
      answer:
        'Yes. TechTools outputs standard modern CSS (`background: linear-gradient(...);`), legacy vendor prefixes if needed, and corresponding Tailwind CSS gradient utility classes.',
    },
    {
      question: 'Are curated trending gradient presets available?',
      answer:
        'Yes. You can choose from dozens of designer-curated trending gradients (mesh styles, neon sunsets, modern pastels, sleek dark mode accents) to jumpstart your UI design.',
    },
  ],

  'glassmorphism-generator': [
    {
      question: 'What is glassmorphism and what CSS properties create the frosted glass effect?',
      answer:
        'Glassmorphism is a modern UI design aesthetic characterized by translucent frosted surfaces, multi-layered depth, and vivid borders. It is built using CSS `backdrop-filter: blur(...)`, semi-transparent RGBA backgrounds, and subtle 1px border highlights.',
    },
    {
      question: 'How do I ensure glassmorphic elements remain legible across different backgrounds?',
      answer:
        'Maintain sufficient contrast between your text color and the underlying wallpaper. Increasing the blur radius (e.g. 12px to 20px) and adding a subtle dark or light translucent background tint ensures text stays readable over complex patterns.',
    },
    {
      question: 'Which browsers support CSS `backdrop-filter`?',
      answer:
        'All modern browser engines (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge) provide full native support for `backdrop-filter`. The tool also outputs the `-webkit-backdrop-filter` vendor prefix for comprehensive Safari compatibility.',
    },
    {
      question: 'Can I test the effect over different photographic and abstract backgrounds?',
      answer:
        'Yes. The interactive workspace allows you to switch between diverse high-resolution background wallpapers to evaluate real-world transparency, blur refraction, and border illumination.',
    },
  ],

  'markdown-editor': [
    {
      question: 'Does the Markdown Editor feature real-time side-by-side HTML preview?',
      answer:
        'Yes. As you type in the editor panel, the live preview renders GitHub Flavored Markdown (GFM) instantly, including headings, bold/italics, lists, code blocks with syntax highlighting, blockquotes, and tables.',
    },
    {
      question: 'Can I export my Markdown to clean HTML code or download a .md file?',
      answer:
        'Yes. You can copy the generated HTML markup with one click, copy raw markdown text, or download the file directly to your computer as a `.md` or `.html` document.',
    },
    {
      question: 'Does the editor support GitHub Flavored Markdown (GFM) task lists and tables?',
      answer:
        'Yes. It fully supports GFM extensions such as interactive task lists (`- [x] Task`), formatted tables with column alignment, strikethrough text (`~~text~~`), and syntax highlighted code blocks.',
    },
    {
      question: 'Is my written markdown content saved or sent to any server?',
      answer:
        'No. All parsing and HTML compilation happen 100% locally in your web browser. Your private notes, documentation drafts, and articles never leave your device.',
    },
  ],

  'csv-json-converter': [
    {
      question: 'How does the CSV to JSON converter handle delimiters and header rows?',
      answer:
        'The converter automatically detects standard comma (`,`), tab (`\\t`), semicolon (`;`), and pipe (`|`) delimiters. It treats the first row as object keys, transforming subsequent tabular rows into an array of structured JSON objects.',
    },
    {
      question: 'Can the tool convert JSON back into CSV format?',
      answer:
        'Yes! The tool features two-way conversion, allowing you to transform flat or nested JSON arrays into clean CSV spreadsheets with proper quote escaping for commas and line breaks.',
    },
    {
      question: 'Can it parse large multi-megabyte CSV spreadsheet files?',
      answer:
        'Yes. Built with high-speed streaming parsers, TechTools effortlessly processes files with tens of thousands of rows directly inside your browser memory without UI lag.',
    },
    {
      question: 'Are my confidential business spreadsheets or customer lists uploaded?',
      answer:
        'No. All data transformations execute strictly inside your local browser sandbox. No CSV or JSON data is ever transmitted or stored on any server.',
    },
  ],

  'number-base-converter': [
    {
      question: 'Which number bases can this tool convert between?',
      answer:
        'It converts seamlessly between Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16), as well as custom bases ranging from Base 2 up to Base 36.',
    },
    {
      question: 'Does the converter support large BigInt numbers and negative values?',
      answer:
        'Yes. Using JavaScript `BigInt` arbitrary-precision arithmetic, the converter handles extraordinarily large numbers exceeding standard 64-bit integer limits without rounding errors or loss of precision.',
    },
    {
      question: 'Can I see the bitwise representations and byte groupings?',
      answer:
        'Yes. Binary outputs can be automatically formatted into clean 4-bit nibbles or 8-bit byte clusters with spaces for effortless hardware debugging and memory inspection.',
    },
    {
      question: 'Is the converter free and available offline?',
      answer:
        'Yes. The tool operates completely offline in your browser with zero latency and no usage restrictions.',
    },
  ],

  'dummy-data-generator': [
    {
      question: 'What types of realistic mock data can this tool generate?',
      answer:
        'The generator produces realistic dummy datasets including Full Names, Email Addresses, Phone Numbers, Street Addresses, Company Names, Job Titles, UUIDs, Dates, Financial amounts, and Lorem Ipsum paragraphs.',
    },
    {
      question: 'Which export formats are supported for API and database seeding?',
      answer:
        'You can export your generated data as formatted JSON, CSV tabular spreadsheets, or SQL `INSERT` statements ready for direct import into PostgreSQL, MySQL, SQLite, or MongoDB.',
    },
    {
      question: 'Can I define custom JSON schemas with specific field types?',
      answer:
        'Yes. You can customize field names and assign specific data generators to each property, tailoring the output to match your exact backend data model.',
    },
    {
      question: 'How many rows of mock data can I generate at once?',
      answer:
        'You can generate up to 1,000 rows in a single batch in seconds directly in your browser without requiring external mock API subscriptions.',
    },
  ],

  'aspect-ratio-calculator': [
    {
      question: 'What is an aspect ratio and why is it important in video and design?',
      answer:
        'An aspect ratio describes the proportional relationship between an image or video screen’s width and height (e.g. 16:9 for modern widescreen video, 4:3 for standard displays, 1:1 for square social posts, 9:16 for vertical TikTok/Reels). Maintaining aspect ratios prevents visual stretching or distortion.',
    },
    {
      question: 'How do I calculate new dimensions while preserving the original aspect ratio?',
      answer:
        'Enter your original width and height, then input either the desired new width OR new height. TechTools automatically calculates the missing dimension using the formula: `New Height = (Original Height / Original Width) * New Width`.',
    },
    {
      question: 'Does the tool list standard video and photo resolution presets?',
      answer:
        'Yes. The calculator includes quick-select presets for 4K UHD (3840x2160), 1080p Full HD (1920x1080), 720p HD (1280x720), Instagram Square (1080x1080), Stories/Reels (1080x1920), and Golden Ratio (1.618:1).',
    },
    {
      question: 'Can this tool calculate the greatest common divisor (GCD) of a resolution?',
      answer:
        'Yes. It computes the mathematical Greatest Common Divisor (GCD) using the Euclidean algorithm to simplify arbitrary pixel dimensions into their cleanest fractional ratio (e.g. 1920x1080 simplifies to 16:9).',
    },
  ],

  'bmi-calorie-calculator': [
    {
      question: 'How is Body Mass Index (BMI) calculated and what are the WHO categories?',
      answer:
        'BMI is calculated by dividing weight in kilograms by height in meters squared: `BMI = kg / m²`. According to the World Health Organization (WHO): Underweight is below 18.5, Normal weight is 18.5 - 24.9, Overweight is 25.0 - 29.9, and Obese is 30.0 or higher.',
    },
    {
      question: 'What is Basal Metabolic Rate (BMR) and how is it estimated?',
      answer:
        'BMR is the minimum number of calories your body burns at rest to maintain vital functions (breathing, circulation, cellular repair). The calculator uses the medically validated Mifflin-St Jeor equation, factoring in age, biological gender, height, and weight.',
    },
    {
      question: 'How does Total Daily Energy Expenditure (TDEE) help with calorie planning?',
      answer:
        'TDEE multiplies your BMR by an activity multiplier (from sedentary to athlete). This gives you your daily maintenance calorie target. Consuming 300-500 calories below your TDEE supports steady weight loss, while consuming above supports muscle hypertrophy.',
    },
    {
      question: 'Does the calculator support both Imperial (lbs/inches) and Metric (kg/cm) units?',
      answer:
        'Yes. You can switch between Metric and US Imperial units with one click. All conversions and calculations execute entirely in your browser with complete privacy.',
    },
  ],

  'xml-yaml-formatter': [
    {
      question: 'What are the main formatting features of the XML and YAML Formatter?',
      answer:
        'The tool parses, validates, and beautifies XML and YAML documents. It fixes indentation hierarchies, aligns attributes, validates tag closing, and converts between XML and YAML or JSON formats with instant syntax highlighting.',
    },
    {
      question: 'How does YAML indentation differ from standard programming languages?',
      answer:
        'YAML relies strictly on consistent whitespace indentation (typically 2 spaces) to define data hierarchy and forbids tab characters. The formatter automatically detects and converts tabs into clean spaces to prevent YAML parser crashes.',
    },
    {
      question: 'Can this tool detect unclosed XML tags or mismatched hierarchy?',
      answer:
        'Yes. If your XML contains missing closing tags, unquoted attributes, or mismatched elements, the validator highlights the exact line number and offending token.',
    },
    {
      question: 'Is my XML or YAML configuration data uploaded to any server?',
      answer:
        'No. Parsing and formatting run 100% locally in your browser memory. Proprietary Kubernetes manifests, CI/CD pipelines, and configuration files remain confidential.',
    },
  ],
};
