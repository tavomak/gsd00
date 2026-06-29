export function getVimeoId(value) {
  if (!value) return null;
  const str = String(value).trim();
  if (/^\d+$/.test(str)) return str;
  const match = str.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

let lastRequestTime = 0;
const requestQueue = [];

export const rateLimit = async () => {
  const now = Date.now();
  if (lastRequestTime + 2000 < now) {
    lastRequestTime = now;
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    requestQueue.push(resolve);
    if (requestQueue.length === 1) {
      setTimeout(() => {
        const resolvers = [...requestQueue];
        requestQueue.length = 0;
        resolvers.forEach((r) => r());
      }, 2000);
    }
  });
};

const getSanitizeConfig = () => ({
  ALLOWED_TAGS: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'strong',
    'em',
    'u',
    'a',
    'ul',
    'ol',
    'li',
    'blockquote',
    'img',
    'figure',
    'figcaption',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'div',
    'span',
  ],
  ALLOWED_ATTR: [
    'href',
    'title',
    'alt',
    'src',
    'width',
    'height',
    'class',
    'id',
  ],
  ALLOW_DATA_ATTR: false,
});

export const sanitizeHtml = (dirtyHtml) => {
  if (!dirtyHtml) return '';

  try {
    // eslint-disable-next-line global-require
    const DOMPurify = require('dompurify');
    const purify =
      typeof DOMPurify === 'function' ? DOMPurify : DOMPurify.default;
    return purify.sanitize(dirtyHtml, getSanitizeConfig());
  } catch (error) {
    console.error('Sanitization error:', error);
    // Fallback: return as-is only in error cases
    return dirtyHtml;
  }
};
