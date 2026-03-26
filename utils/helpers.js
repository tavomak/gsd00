export const bannersToShow = (items) => {
  const now = new Date();
  return items.filter((item) => !item.endTime || now < new Date(item.endTime));
};

export function formatPhoneNumberString(value) {
  const trimmedValue = value.trim().replace(/\s/g, '');
  const valueToReturn = `${trimmedValue.slice(0, 1)} ${trimmedValue.slice(1, 5)} ${trimmedValue.slice(5)}`;

  return valueToReturn;
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
