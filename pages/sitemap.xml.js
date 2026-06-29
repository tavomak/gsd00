import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { siteFromHost, getSiteConfig } from '@/config/sites';
import { getProjects, rateLimit } from '@/utils';
import { GET_PROJECTS } from '@/utils/queries/hygraph';
import i18nConfig from '@/i18n.json';

const NAV_PATHS = {
  nav_homepage_title: '/',
  nav_projects_title: '/projects',
  nav_gallery_title: '/gallery',
  nav_about_title: '/about',
  nav_contact_title: '/contact',
};

function localizedUrl(locale, defaultLocale, path) {
  if (locale === defaultLocale) return path === '/' ? '/' : path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

function buildAlternates(locales, defaultLocale, hostname, path) {
  return locales.map((loc) => ({
    lang: loc,
    url: `${hostname}${localizedUrl(loc, defaultLocale, path)}`,
  }));
}

export async function getServerSideProps({ req, res }) {
  const host = req.headers.host || '';
  const siteKey = siteFromHost(host);
  const siteConfig = getSiteConfig(siteKey);
  const hostname = `https://${siteConfig.domain}`;
  const locales = i18nConfig.locales || ['es', 'en'];
  const defaultLocale = siteConfig.defaultLocale || i18nConfig.defaultLocale;

  const staticPaths = (siteConfig.navKeys || [])
    .map((key) => NAV_PATHS[key])
    .filter(Boolean);

  let projectSlugs = [];
  try {
    await rateLimit();
    const projectsResponse = await getProjects(GET_PROJECTS, [defaultLocale]);
    projectSlugs = (projectsResponse?.data?.projects || [])
      .filter((p) => p.categories?.includes(siteConfig.category))
      .map((p) => `/projects/${p.slug}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Sitemap project fetch failed:', error);
  }

  const allPaths = [...staticPaths, ...projectSlugs];

  const links = allPaths.flatMap((path) =>
    locales.map((loc) => ({
      url: localizedUrl(loc, defaultLocale, path),
      links: buildAlternates(locales, defaultLocale, hostname, path),
      changefreq: path === '/' ? 'weekly' : 'monthly',
      priority: path === '/' ? 1.0 : 0.7,
    }))
  );

  const stream = new SitemapStream({ hostname });
  const xml = (
    await streamToPromise(Readable.from(links).pipe(stream))
  ).toString();

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400'
  );
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
