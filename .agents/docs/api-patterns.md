# API Patterns

## Data Sources
- **Hygraph** (`utils/lib/api.js` → `executeHygraphQuery`): page metadata/SEO only
- **WordPress** (`utils/lib/api.js` → `executeWpQuery`): project content

## API Functions (utils/lib/api.js)
All functions accept a query as first argument (queries live in `utils/queries/`):
```
getPageBySlug(query, slug, locales)     → { data: { page } }
getProjects(query, locales)             → { data: { projects[] } }
getProjectBySlug(query, slug, locales)  → { data: { project } }
getWpProjects(query)                    → { data: { proyectos: { nodes[] } } }
getWpProjectById(query, id)             → { data: { proyecto } }
```

## Queries Structure
```
utils/queries/
├── hygraph/   GET_PAGE_HOME | GET_PAGE_GALLERY | GET_PAGE_ABOUT |
│              GET_PAGE_CONTACT | GET_PAGE_PROJECTS |
│              GET_PROJECTS | GET_PROJECT_BY_SLUG
└── wordpress/ GET_WP_PROJECTS | GET_WP_PROJECT_BY_ID
```

## Hygraph Page Pattern
```javascript
import { getPageBySlug } from '@/utils';
import { GET_PAGE_HOME } from '@/utils/queries/hygraph';

export async function getStaticProps({ locale }) {
  try {
    const res = await getPageBySlug(GET_PAGE_HOME, 'home', [locale]);
    return { props: { data: res?.data?.page || {} }, revalidate: 100 };
  } catch (e) {
    return { props: { data: {} }, revalidate: 100 };
  }
}
```

## WordPress Projects Pattern
```javascript
import { getWpProjects, rateLimit } from '@/utils';
import { GET_WP_PROJECTS } from '@/utils/queries/wordpress';

export async function getStaticProps() {
  await rateLimit();
  const res = await getWpProjects(GET_WP_PROJECTS);
  const projects = res?.data?.proyectos?.nodes || [];
  return { props: { projects }, revalidate: 100 };
}
```

## WordPress Dynamic Paths (no locales)
```javascript
import { getWpProjects, rateLimit } from '@/utils';
import { GET_WP_PROJECTS } from '@/utils/queries/wordpress';

export async function getStaticPaths() {
  await rateLimit();
  const res = await getWpProjects(GET_WP_PROJECTS);
  const projects = res?.data?.proyectos?.nodes || [];
  return {
    paths: projects.map(p => ({ params: { slug: p.slug } })),
    fallback: true,
  };
}
```

## WordPress Project Shape
```
getWpProjects()     → proyectos.nodes[]: {id, slug, status, title, featuredImage{node{mediaItemUrl}},
                       proyectosBackground{gifPortada{node{mediaItemUrl}}}}
getWpProjectById()  → proyecto: {title, slug, proyectos{secciones[]{mixto, tipoDeContenido,
                       video, galeria{nodes[]{mediaItemUrl, id, slug, title, uri}}}}}
```

## About Page Query Shape
`GET_PAGE_ABOUT` returns extended fields beyond the standard page:
```
page: {
  id, slug, title,
  biography { raw },
  seoMetadata { title, seoDescription, seoImage { url, height, width } }
}
```
- `biography.raw` → pass to `RichContent` as `content={data.biography?.raw}`
- `seoMetadata.seoImage` → render with `next/image` (has `height` + `width`)

## API Routes
`/api/register` (form+reCAPTCHA) • `/api/pages-sitemap` • `/api/projects-sitemap`
