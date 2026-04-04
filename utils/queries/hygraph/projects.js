import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query getProjects($locales: [Locale!]!) {
    projects(locales: $locales) {
      id
      slug
      title
      categories
      primaryImage(locales: [en]) {
        url
      }
      seoMetadata {
        seoImage(locales: [en]) {
          url
        }
      }
    }
  }
`;

export const GET_PROJECT_BY_SLUG = gql`
  query getProjectBySlug($slug: String!, $locales: [Locale!]!) {
    project(where: { slug: $slug }, locales: $locales) {
      id
      slug
      title
      categories
      seoMetadata {
        title
        seoDescription
        seoImage {
          url
        }
      }
      description {
        raw
      }
      primaryImage(locales: [en]) {
        url
      }
      gallery(locales: [en]) {
        id
        url
      }
    }
  }
`;
