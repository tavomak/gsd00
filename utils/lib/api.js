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

const executeHygraphQuery = async (query, variables = {}) => {
  try {
    return await client.query({ query, variables });
  } catch (error) {
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
