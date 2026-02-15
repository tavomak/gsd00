import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_CMS_API_URL,
  }),
  cache: new InMemoryCache(),
});

export const getServices = () =>
  client.query({
    query: gql`
      query Services {
        services {
          id
          title
        }
      }
    `,
  });

export const getTeam = (locales) =>
  client.query({
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

export const getCustomers = (locales) =>
  client.query({
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

export const getProjects = (locales) =>
  client.query({
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

export const getProjectBySlug = (slug, locales) =>
  client.query({
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

export const getPageBySlug = (slug, locales) =>
  client.query({
    query: gql`
      query getPageBySlug($slug: String!, $locales: [Locale!]!) {
        page(where: { slug: $slug }, locales: $locales) {
          id
          slug
          title
          pageType
          primaryVideo
          secondVideo
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
          whoWeAreTitle
          whoWeAreText {
            raw
          }
          sections {
            id
            title
            content {
              json
            }
          }
          twoColumnsText {
            raw
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
          team(first: 50) {
            id
            slug
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
            linkedin
            officeTag
          }
          logos(locales: en) {
            id
            title
            logo {
              url
              fileName
              id
              height
              width
            }
          }
        }
      }
    `,
    variables: {
      slug,
      locales,
    },
  });
