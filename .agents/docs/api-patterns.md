# API Patterns

## GraphCMS (utils/lib/api.js)
`getServices | getTeam | getCustomers | getProjects | getProjectBySlug | getPageBySlug`

## Data Shapes
```
getServices()            → services[]: {id, title}
getTeam(locales)         → teams[]: {id, slug, name, position, email, phone, description, image{url,h,w}, biography{raw}}
getCustomers(locales)    → customers[]: {id, title, logo{url,h,w}}
getProjects(locales)     → projects[]: {id, slug, title, description, primaryImage{url,h,w}}
getProjectBySlug(s,l)    → project: {id, slug, title, viemoId, primaryImage{url,h,w}}
getPageBySlug(s,l)       → page: {id, slug, title, pageType, primaryVideo, secondVideo, description,
                           seoMetadata{title,seoDescription,keywords,seoImage}, whoWeAreTitle,
                           whoWeAreText{raw}, sections[]{id,title,content{json}},
                           twoColumnsText{raw}, primaryImage, projects[], team[](first:50), logos[]}
```

## Pages Router Pattern
```javascript
import { getPageBySlug } from '@/utils';

export async function getStaticProps({ locale }) {
  try {
    const res = await getPageBySlug('slug', [locale]);
    return { props: { data: res?.data?.page || [] }, revalidate: 100 };
  } catch (e) {
    return { notFound: true };
  }
}
```

## Dynamic Routes
```javascript
export async function getStaticPaths({ locales }) {
  const res = await getProjects(locales);
  return {
    paths: res?.data?.projects.map(p => ({ params: { slug: p.slug } })),
    fallback: true,
  };
}
```

## API Routes
`/api/register` (form+reCAPTCHA) • `/api/pages-sitemap` • `/api/projects-sitemap`
