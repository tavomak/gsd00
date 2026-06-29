// Prefix a path with the locale segment. Spanish is the default locale (no prefix).
export const localePath = (lang, path) =>
  `${lang === 'es' ? '' : '/en'}${path}`;

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
