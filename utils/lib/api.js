import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_CMS_API_URL,
    headers: {
      Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
    },
  }),
  cache: new InMemoryCache(),
});

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Hygraph rate limit: 5 req/sec → minimum 200ms between requests per worker process.
// Retry backoff handles overflow when multiple build workers burst simultaneously.
const MIN_INTERVAL_MS = 200;
let lastRequestTime = 0;
let requestChain = Promise.resolve();

const throttle = () => {
  requestChain = requestChain.then(() => {
    const wait = Math.max(0, lastRequestTime + MIN_INTERVAL_MS - Date.now());
    return sleep(wait).then(() => {
      lastRequestTime = Date.now();
    });
  });
  return requestChain;
};

const executeHygraphQuery = async (
  query,
  variables = {},
  retries = 4,
  attempt = 0
) => {
  await throttle();

  try {
    return await client.query({ query, variables, fetchPolicy: 'no-cache' });
  } catch (error) {
    const isRateLimit =
      error?.networkError?.statusCode === 429 ||
      error?.message?.includes('429');

    if (isRateLimit && attempt < retries) {
      const delay = 2 ** attempt * 1000;
      // eslint-disable-next-line no-console
      console.warn(
        `Hygraph rate limit hit, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`
      );
      await sleep(delay);
      return executeHygraphQuery(query, variables, retries, attempt + 1);
    }

    // eslint-disable-next-line no-console
    console.error('Apollo Error (Hygraph):', error);
    return { data: null, error };
  }
};

export const getProjects = async (query, locales) => {
  const result = await executeHygraphQuery(query, { locales });
  return result?.data
    ? result
    : { data: { projects: [] }, error: result.error };
};

export const getProjectBySlug = async (query, slug, locales) => {
  const result = await executeHygraphQuery(query, { slug, locales });
  return result?.data
    ? result
    : { data: { project: null }, error: result.error };
};

export const getPageBySlug = async (query, slug, locales) => {
  const result = await executeHygraphQuery(query, { slug, locales });
  return result?.data ? result : { data: { page: null }, error: result.error };
};
