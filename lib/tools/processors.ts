import QRCode from 'qrcode';

// ==================== CRYPTO & HASHES ====================

// MD5 implementation in pure TypeScript for browser execution
export function computeMD5(string: string): string {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX: number, lY: number) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }
  function F(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }
  function G(x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  }
  function H(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }
  function I(x: number, y: number, z: number) {
    return y ^ (x | ~z);
  }
  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(string: string) {
    let lWordCount;
    const lMessageLength = string.length;
    const lNumberOfWords_temp1 = lMessageLength + 8;
    const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = new Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue: number) {
    let wordToHexValue = '',
      wordToHexValue_temp = '',
      lByte,
      lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  }

  const x = convertToWordArray(string);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a;
    const BB = b;
    const CC = c;
    const DD = d;
    a = FF(a, b, c, d, x[k + 0] || 0, 7, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1] || 0, 12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2] || 0, 17, 0x242070db);
    b = FF(b, c, d, a, x[k + 3] || 0, 22, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4] || 0, 7, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5] || 0, 12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6] || 0, 17, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7] || 0, 22, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8] || 0, 7, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9] || 0, 12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10] || 0, 17, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11] || 0, 22, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12] || 0, 7, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13] || 0, 12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14] || 0, 17, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15] || 0, 22, 0x49b40821);

    a = GG(a, b, c, d, x[k + 1] || 0, 5, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6] || 0, 9, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11] || 0, 14, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0] || 0, 20, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5] || 0, 5, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10] || 0, 9, 0x02441453);
    c = GG(c, d, a, b, x[k + 15] || 0, 14, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4] || 0, 20, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9] || 0, 5, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14] || 0, 9, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3] || 0, 14, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8] || 0, 20, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13] || 0, 5, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2] || 0, 9, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7] || 0, 14, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12] || 0, 20, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[k + 5] || 0, 4, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8] || 0, 11, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11] || 0, 16, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14] || 0, 23, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1] || 0, 4, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4] || 0, 11, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7] || 0, 16, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10] || 0, 23, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13] || 0, 4, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0] || 0, 11, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3] || 0, 16, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6] || 0, 23, 0x04881d05);
    a = HH(a, b, c, d, x[k + 9] || 0, 4, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12] || 0, 11, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15] || 0, 16, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2] || 0, 23, 0xc4ac5665);

    a = II(a, b, c, d, x[k + 0] || 0, 6, 0xf4292244);
    d = II(d, a, b, c, x[k + 7] || 0, 10, 0x432aff97);
    c = II(c, d, a, b, x[k + 14] || 0, 15, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5] || 0, 21, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12] || 0, 6, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3] || 0, 10, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10] || 0, 15, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1] || 0, 21, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8] || 0, 6, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15] || 0, 10, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6] || 0, 15, 0xa3014314);
    b = II(b, c, d, a, x[k + 13] || 0, 21, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4] || 0, 6, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11] || 0, 10, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2] || 0, 15, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9] || 0, 21, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

export async function computeSubtleHash(algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512', text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ==================== JSON & DEVELOPER ====================

export function formatJSON(raw: string, indent: number = 2): { result: string; valid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(raw);
    return {
      result: JSON.stringify(parsed, null, indent),
      valid: true,
    };
  } catch (err: any) {
    return {
      result: raw,
      valid: false,
      error: err?.message || 'Invalid JSON syntax',
    };
  }
}

export function minifyJSON(raw: string): { result: string; valid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(raw);
    return {
      result: JSON.stringify(parsed),
      valid: true,
    };
  } catch (err: any) {
    return {
      result: raw,
      valid: false,
      error: err?.message || 'Invalid JSON syntax',
    };
  }
}

export function jsonToCsv(rawJson: string): { result: string; error?: string } {
  try {
    const parsed = JSON.parse(rawJson);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    if (arr.length === 0) return { result: '' };

    const keys = Array.from(new Set(arr.flatMap((obj) => Object.keys(obj))));
    const header = keys.map((k) => `"${k.replace(/"/g, '""')}"`).join(',');
    const rows = arr.map((row) =>
      keys
        .map((k) => {
          const val = row[k];
          if (val === undefined || val === null) return '""';
          if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    return { result: [header, ...rows].join('\n') };
  } catch (e: any) {
    return { result: '', error: 'Could not convert to CSV: Ensure input is a valid JSON array or object.' };
  }
}

// Base64 encode/decode UTF-8 safe
export function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binString);
}

export function decodeBase64(b64: string): { result: string; valid: boolean; error?: string } {
  try {
    const binString = atob(b64.trim());
    const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
    return { result: new TextDecoder().decode(bytes), valid: true };
  } catch (e: any) {
    return { result: '', valid: false, error: 'Invalid Base64 encoded string' };
  }
}

// JWT Decode
export function decodeJWT(token: string): {
  header: any;
  payload: any;
  signature: string;
  isExpired: boolean;
  expDate?: string;
  error?: string;
} {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { header: null, payload: null, signature: '', isExpired: false, error: 'JWT must contain 3 dot-separated parts' };
    }
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const signature = parts[2];

    let isExpired = false;
    let expDate: string | undefined;
    if (payload.exp) {
      const expMs = payload.exp * 1000;
      isExpired = Date.now() > expMs;
      expDate = new Date(expMs).toUTCString();
    }

    return { header, payload, signature, isExpired, expDate };
  } catch (e: any) {
    return { header: null, payload: null, signature: '', isExpired: false, error: 'Failed to decode JWT: ' + e?.message };
  }
}

// UUID Generator
export function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ==================== TEXT & CONTENT ====================

export function analyzeText(text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed]).length : 0;
  const paragraphs = trimmed ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
  const lines = text.split('\n').length;

  const readingTimeMinutes = (words.length / 225).toFixed(1);
  const speakingTimeMinutes = (words.length / 130).toFixed(1);

  // Keyword density
  const wordFreq: Record<string, number> = {};
  const stopWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me']);

  words.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length > 2 && !stopWords.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });

  const keywords = Object.entries(wordFreq)
    .map(([word, count]) => ({
      word,
      count,
      density: ((count / (words.length || 1)) * 100).toFixed(1) + '%',
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    wordCount: words.length,
    words: words.length,
    charsWithSpaces,
    characters: charsWithSpaces,
    charsNoSpaces,
    charactersNoSpaces: charsNoSpaces,
    sentenceCount: sentences,
    sentences,
    paragraphCount: paragraphs,
    paragraphs,
    lineCount: lines,
    lines,
    readingTime: `${readingTimeMinutes} min`,
    readingTimeMinutes,
    speakingTime: `${speakingTimeMinutes} min`,
    speakingTimeMinutes,
    keywords,
    topKeywords: keywords,
  };
}

export function convertCase(
  text: string,
  targetCase: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant'
): string {
  if (!text) return '';

  switch (targetCase) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    case 'sentence':
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case 'camel': {
      const words = text.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/);
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join('');
    }
    case 'pascal': {
      const words = text.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/);
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    }
    case 'snake':
      return text
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^[_\s]+|[_\s]+$/g, '')
        .toLowerCase();
    case 'kebab':
      return text
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^[-_\s]+|[-_\s]+$/g, '')
        .toLowerCase();
    case 'constant':
      return text
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^[_\s]+|[_\s]+$/g, '')
        .toUpperCase();
    default:
      return text;
  }
}

export interface SlugOptions {
  separator?: string;
  lowercase?: boolean;
  removeStopWords?: boolean;
}

export function generateSlug(text: string, optionsOrSeparator: string | SlugOptions = '-'): string {
  const options: SlugOptions =
    typeof optionsOrSeparator === 'string' ? { separator: optionsOrSeparator } : optionsOrSeparator || {};
  const sep = options.separator || '-';
  const isLower = options.lowercase !== false;

  let processed = text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (isLower) {
    processed = processed.toLowerCase();
  }

  if (options.removeStopWords) {
    const stopWords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    processed = processed
      .split(/\s+/)
      .filter((w) => !stopWords.has(w.toLowerCase()))
      .join(' ');
  }

  return processed
    .trim()
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .replace(/[\s-_]+/g, sep)
    .replace(new RegExp(`^\\${sep}+|\\${sep}+$`, 'g'), '');
}

// ==================== SECURITY & PASSWORDS ====================

export interface PasswordGenOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}

export function generatePassword(options: PasswordGenOptions): { password: string; entropy: number; crackTime: string } {
  let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lower = 'abcdefghijklmnopqrstuvwxyz';
  let nums = '0123456789';
  let syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  if (options.avoidAmbiguous) {
    upper = upper.replace(/[IO]/g, '');
    lower = lower.replace(/[lo]/g, '');
    nums = nums.replace(/[01]/g, '');
    syms = syms.replace(/[{}[\]()/\\'"`~,;:.<>]/g, '');
  }

  let charPool = '';
  if (options.uppercase) charPool += upper;
  if (options.lowercase) charPool += lower;
  if (options.numbers) charPool += nums;
  if (options.symbols) charPool += syms;

  if (!charPool) charPool = lower + nums;

  const length = Math.max(6, Math.min(128, options.length));
  const array = new Uint32Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 4294967296);
    }
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charPool[array[i] % charPool.length];
  }

  // Calculate entropy: length * log2(poolSize)
  const poolSize = charPool.length;
  const entropy = Math.round(length * (Math.log(poolSize) / Math.log(2)));

  let crackTime = 'Instantly';
  if (entropy > 120) crackTime = 'Centuries (Unbreakable)';
  else if (entropy > 80) crackTime = 'Millions of years';
  else if (entropy > 60) crackTime = 'Several centuries';
  else if (entropy > 45) crackTime = 'A few years';
  else if (entropy > 35) crackTime = 'A few days';
  else crackTime = 'Few minutes or hours';

  return { password, entropy, crackTime };
}

// ==================== QR CODE ====================

export async function generateQrDataUrl(
  text: string,
  options: {
    colorDark?: string;
    colorLight?: string;
    width?: number;
  } = {}
): Promise<string> {
  return await QRCode.toDataURL(text || 'https://tools.techusar.com', {
    width: options.width || 320,
    margin: 2,
    color: {
      dark: options.colorDark || '#111318',
      light: options.colorLight || '#FFFFFF',
    },
    errorCorrectionLevel: 'H',
  });
}

// ==================== COLOR CONVERSIONS ====================

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace(/^#/, '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function calculateContrastRatio(hex1: string, hex2: string): number {
  function getLuminance(hex: string) {
    const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
    const a = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// ==================== FINANCE & CALCULATORS ====================

export function calculateLoanEmi(principal: number, annualRate: number, tenureYears: number) {
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  if (monthlyRate === 0) {
    const emi = principal / totalMonths;
    return {
      monthlyEmi: emi,
      totalPayment: principal,
      totalInterest: 0,
      principalPercent: 100,
      interestPercent: 0,
    };
  }

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEmi: Math.round(emi * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    principalPercent: Math.round((principal / totalPayment) * 100),
    interestPercent: Math.round((totalInterest / totalPayment) * 100),
  };
}

export function calculateProfitMargin(cost: number, revenue: number) {
  const profit = revenue - cost;
  const marginPercent = revenue > 0 ? (profit / revenue) * 100 : 0;
  const markupPercent = cost > 0 ? (profit / cost) * 100 : 0;

  return {
    profit: Math.round(profit * 100) / 100,
    grossProfit: Math.round(profit * 100) / 100,
    marginPercent: Math.round(marginPercent * 100) / 100,
    grossMarginPercent: Math.round(marginPercent * 100) / 100,
    markupPercent: Math.round(markupPercent * 100) / 100,
  };
}

// Alias for UUID generator
export const generateUUID = generateUUIDv4;

// Hash generator suite
export async function generateHashes(text: string) {
  const md5 = computeMD5(text);
  let sha1 = '';
  let sha256 = '';
  let sha512 = '';
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      sha1 = await computeSubtleHash('SHA-1', text);
      sha256 = await computeSubtleHash('SHA-256', text);
      sha512 = await computeSubtleHash('SHA-512', text);
    }
  } catch {
    // Fallback if subtle crypto is restricted
  }
  return { md5, sha1, sha256, sha512 };
}

// Exact Age Calculator
export function calculateExactAge(birthDateStr: string | Date, targetDateStr?: string | Date) {
  const birth = new Date(birthDateStr);
  const target = targetDateStr ? new Date(targetDateStr) : new Date();

  if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalDays: 0,
      totalHours: 0,
      nextBirthdayDays: 0,
    };
  }

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffTime = Math.max(0, target.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalMonths = Math.max(0, years * 12 + months);
  const totalHours = totalDays * 24;

  const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday.getTime() < target.getTime()) {
    nextBday.setFullYear(target.getFullYear() + 1);
  }
  const nextBirthdayDays = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalMonths,
    totalDays,
    totalHours,
    nextBirthdayDays: isNaN(nextBirthdayDays) ? 0 : Math.max(0, nextBirthdayDays),
  };
}

// Compound Interest Calculator
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundFreq: number = 12,
  monthlyDeposit: number = 0
) {
  const r = annualRate / 100;
  const n = compoundFreq > 0 ? compoundFreq : 12;
  const t = Math.max(0, years);

  const principalGrowth = principal * Math.pow(1 + r / n, n * t);
  const ratePerMonth = r / 12;
  const totalMonths = t * 12;

  let depositGrowth = 0;
  if (ratePerMonth > 0) {
    depositGrowth = monthlyDeposit * ((Math.pow(1 + ratePerMonth, totalMonths) - 1) / ratePerMonth);
  } else {
    depositGrowth = monthlyDeposit * totalMonths;
  }

  const futureValue = Math.round((principalGrowth + depositGrowth) * 100) / 100;
  const totalDeposits = Math.round((principal + monthlyDeposit * totalMonths) * 100) / 100;
  const totalInterest = Math.round(Math.max(0, futureValue - totalDeposits) * 100) / 100;

  return {
    futureValue: isNaN(futureValue) ? 0 : futureValue,
    totalDeposits: isNaN(totalDeposits) ? 0 : totalDeposits,
    totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
  };
}

// Percentage Calculator
export function calculatePercentage(
  type: 'what_is_x_percent_of_y' | 'x_is_what_percent_of_y' | 'percentage_change' | string,
  val1: number,
  val2: number
): { result: number; explanation: string } {
  if (type === 'what_is_x_percent_of_y') {
    const res = Math.round(((val1 / 100) * val2) * 100) / 100;
    return {
      result: isNaN(res) ? 0 : res,
      explanation: `${val1}% of ${val2} is ${res}. Formula: (${val1} / 100) × ${val2}`,
    };
  }
  if (type === 'x_is_what_percent_of_y') {
    if (val2 === 0) return { result: 0, explanation: 'Division by zero is undefined.' };
    const res = Math.round(((val1 / val2) * 100) * 100) / 100;
    return {
      result: isNaN(res) ? 0 : res,
      explanation: `${val1} is ${res}% of ${val2}. Formula: (${val1} / ${val2}) × 100`,
    };
  }
  if (type === 'percentage_change') {
    if (val1 === 0) return { result: 0, explanation: 'Initial value of zero cannot calculate percentage change.' };
    const res = Math.round((((val2 - val1) / val1) * 100) * 100) / 100;
    const diff = Math.round((val2 - val1) * 100) / 100;
    const direction = res >= 0 ? 'increase' : 'decrease';
    return {
      result: isNaN(res) ? 0 : res,
      explanation: `Difference is ${diff}. That is a ${Math.abs(res)}% ${direction}. Formula: ((${val2} - ${val1}) / ${val1}) × 100`,
    };
  }
  return { result: 0, explanation: '' };
}

// Regular Expression Tester
export function testRegex(pattern: string, flags: string = 'g', text: string) {
  try {
    const reg = new RegExp(pattern, flags);
    const matches: Array<{ match: string; index: number; groups?: Record<string, string> }> = [];

    if (!flags.includes('g')) {
      const m = reg.exec(text);
      if (m) {
        matches.push({ match: m[0], index: m.index, groups: m.groups });
      }
    } else {
      let m: RegExpExecArray | null;
      let count = 0;
      while ((m = reg.exec(text)) !== null && count++ < 500) {
        matches.push({ match: m[0], index: m.index, groups: m.groups });
        if (m.index === reg.lastIndex) {
          reg.lastIndex++;
        }
      }
    }
    return { isValid: true, matches };
  } catch (err: any) {
    return { isValid: false, error: err?.message || 'Invalid regular expression', matches: [] };
  }
}

// WCAG Contrast Checker
export function checkColorContrast(hex1: string, hex2: string) {
  const ratioNum = calculateContrastRatio(hex1, hex2);
  const ratio = Math.round(ratioNum * 100) / 100;
  return {
    ratio,
    aaLevel: ratio >= 4.5,
    aaaLevel: ratio >= 7.0,
  };
}

// Lorem Ipsum Generator
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur',
  'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in',
  'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export function generateLoremIpsum(options: {
  count: number;
  type: 'paragraphs' | 'sentences' | 'words';
  startWithLorem?: boolean;
  asHtml?: boolean;
}): string {
  const { count = 3, type = 'paragraphs', startWithLorem = true, asHtml = false } = options;

  function getRandomWord(): string {
    return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  }

  function generateSentence(isFirstSentence: boolean = false): string {
    const wordCount = 8 + Math.floor(Math.random() * 10);
    const words: string[] = [];

    if (isFirstSentence && startWithLorem) {
      words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      while (words.length < wordCount) {
        words.push(getRandomWord());
      }
    } else {
      for (let i = 0; i < wordCount; i++) {
        words.push(getRandomWord());
      }
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    return words.join(' ') + '.';
  }

  function generateParagraph(isFirstParagraph: boolean = false): string {
    const sentenceCount = 4 + Math.floor(Math.random() * 4);
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence(isFirstParagraph && i === 0));
    }
    return sentences.join(' ');
  }

  if (type === 'words') {
    const words: string[] = [];
    if (startWithLorem) {
      words.push(...'Lorem ipsum dolor sit amet'.split(' ').slice(0, count));
    }
    while (words.length < count) {
      words.push(getRandomWord());
    }
    return words.slice(0, count).join(' ');
  }

  if (type === 'sentences') {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
      sentences.push(generateSentence(i === 0));
    }
    return sentences.join(' ');
  }

  // Paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateParagraph(i === 0));
  }

  if (asHtml) {
    return paragraphs.map((p) => `<p>${p}</p>`).join('\n\n');
  }
  return paragraphs.join('\n\n');
}
