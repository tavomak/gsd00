import { gql } from '@apollo/client';

export const GET_PAGE_HOME = gql`
  query getPageHome($slug: String!, $locales: [Locale!]!) {
    page(where: { slug: $slug }, locales: $locales) {
      id
      slug
      title
      seoMetadata {
        title
        seoDescription
        seoImage {
          url
          height
          width
        }
      }
      homeProjects(locales: $locales) {
        ... on Project {
          id
          categories
          primaryImage {
            url
          }
          title
        }
      }
    }
  }
`;

export const GET_PAGE_GALLERY = gql`
  query getPageGallery($slug: String!, $locales: [Locale!]!) {
    page(where: { slug: $slug }, locales: $locales) {
      id
      slug
      title
      seoMetadata {
        title
        seoDescription
        seoImage {
          url
          height
          width
        }
      }
    }
  }
`;

export const GET_PAGE_ABOUT = gql`
  query getPageAbout($slug: String!, $locales: [Locale!]!) {
    page(where: { slug: $slug }, locales: $locales) {
      id
      title
      slug
      biography {
        raw
      }
      seoMetadata {
        title
        seoDescription
        seoImage {
          url
          height
          width
        }
      }
    }
  }
`;

export const GET_PAGE_CONTACT = gql`
  query getPageContact($slug: String!, $locales: [Locale!]!) {
    page(where: { slug: $slug }, locales: $locales) {
      id
      slug
      title
      seoMetadata {
        title
        seoDescription
      }
    }
  }
`;

export const GET_PAGE_PROJECTS = gql`
  query getPageProjects($slug: String!, $locales: [Locale!]!) {
    page(where: { slug: $slug }, locales: $locales) {
      id
      slug
      title
      seoMetadata {
        title
        seoDescription
      }
    }
  }
`;
