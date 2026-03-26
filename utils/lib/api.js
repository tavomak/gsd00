import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_CMS_API_URL,
  }),
  cache: new InMemoryCache(),
});

const wpClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_WP_API_URL,
  }),
  cache: new InMemoryCache(),
});

export const getServices = async () => {
  try {
    return await client.query({
      query: gql`
        query Services {
          services {
            id
            title
          }
        }
      `,
    });
  } catch (error) {
    console.error('Apollo Error - getServices:', error);
    return { data: { services: [] }, error };
  }
};

export const getTeam = async (locales) => {
  try {
    return await client.query({
      query: gql`
        query getTeam($locales: [Locale!]!) {
          teams(locales: $locales) {
            id
            slug
            description
            image(locales: en) {
              id
              url
              height
              width
            }
            name
            phone
            position
            email
            biography {
              raw
            }
          }
        }
      `,
      variables: {
        locales,
      },
    });
  } catch (error) {
    console.error('Apollo Error - getTeam:', error);
    return { data: { teams: [] }, error };
  }
};

export const getCustomers = async (locales) => {
  try {
    return await client.query({
      query: gql`
        query getCustomers($locales: [Locale!]!) {
          customers(locales: $locales) {
            id
            title
            logo(locales: en) {
              id
              url
              height
              width
            }
          }
        }
      `,
      variables: {
        locales,
      },
    });
  } catch (error) {
    console.error('Apollo Error - getCustomers:', error);
    return { data: { customers: [] }, error };
  }
};

export const getProjects = async (locales) => {
  try {
    return await client.query({
      query: gql`
        query getProjects($locales: [Locale!]!) {
          projects(locales: $locales) {
            id
            slug
            title
            description
            primaryImage(locales: en) {
              id
              url
              height
              width
            }
          }
        }
      `,
      variables: {
        locales,
      },
    });
  } catch (error) {
    console.error('Apollo Error - getProjects:', error);
    return { data: { projects: [] }, error };
  }
};

export const getWpProjects = async () => {
  try {
    return await wpClient.query({
      query: gql`
        query GetWpProjects {
          proyectos {
            nodes {
              id
              slug
              status
              title(format: RENDERED)
              featuredImage {
                node {
                  id
                  uri
                  mediaItemUrl
                }
              }
              proyectosBackground {
                gifPortada {
                  node {
                    mediaItemUrl
                  }
                }
              }
            }
          }
        }
      `,
    });
  } catch (error) {
    console.error('Apollo Error - getWpProjects:', error);
    return { data: { proyectos: [] }, error };
  }
};

export const getWpProjectById = async (id, locales) => {
  try {
    return await wpClient.query({
      query: gql`
        query getWpProjectById($id: ID!) {
          proyecto(id: $id, idType: URI) {
            title
            slug
            proyectos {
              secciones {
                mixto
                tipoDeContenido
                video
                galeria {
                  nodes {
                    mediaItemUrl
                    id
                    slug
                    title(format: RAW)
                    uri
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id,
        locales,
      },
    });
  } catch (error) {
    console.error('Apollo Error - getWpProjectById:', error.cause);
    return { data: { project: null }, error };
  }
};

export const getProjectBySlug = async (slug, locales) => {
  try {
    return await client.query({
      query: gql`
        query getProjectBySlug($slug: String!, $locales: [Locale!]!) {
          project(where: { slug: $slug }, locales: $locales) {
            id
            primaryImage {
              id
              url
              height
              width
            }
            slug
            title
            viemoId
          }
        }
      `,
      variables: {
        slug,
        locales,
      },
    });
  } catch (error) {
    console.error('Apollo Error - getProjectBySlug:', error);
    return { data: { project: null }, error };
  }
};

export const getPageBySlug = async (slug, locales) => {
  try {
    return await client.query({
      query: gql`
        query getPageBySlug($slug: String!, $locales: [Locale!]!) {
          page(where: { slug: $slug }, locales: $locales) {
            id
            slug
            title
            pageType
            primaryVideo
            description
            seoMetadata {
              title
              seoDescription
              keywords
              seoImage {
                url
                height
                width
              }
            }
            primaryImage(locales: en) {
              id
              url
              height
              width
            }
            projects(locales: en) {
              id
              title
              slug
              primaryImage(locales: en) {
                id
                url
              }
            }
            biography {
              raw
            }
          }
        }
      `,
      variables: {
        slug,
        locales,
      },
    });
  } catch (error) {
    console.error('Apollo Error - getPageBySlug:', error);
    return { data: { page: null }, error };
  }
};
