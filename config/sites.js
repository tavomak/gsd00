export const DEFAULT_SITE = 'gsd00';

export const sites = {
  gsd00: {
    key: 'gsd00',
    domain: 'gsd00.com',
    category: 'photography',
    defaultLocale: 'es',
    name: 'GSD00',
    logo: {
      src: '/brand-icon.svg',
      width: 220,
      height: 60,
    },
    navKeys: [
      'nav_homepage_title',
      'nav_projects_title',
      'nav_gallery_title',
      'nav_about_title',
      'nav_contact_title',
    ],
    instagram: 'https://www.instagram.com/gsd00/',
    copyrightName: 'GSD00',
    icons: {
      base: '/favicons/gsd00',
      manifest: '/favicons/gsd00/manifest.json',
      browserconfig: '/favicons/gsd00/browserconfig.xml',
      msTile: '/favicons/gsd00/ms-icon-144x144.png',
    },
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    seo: {
      defaultOgImage: '/favicons/gsd00/og-default.jpg',
      defaultDescription: null,
    },
  },
  '83s': {
    key: '83s',
    domain: '83scontent.com',
    category: 'video',
    defaultLocale: 'es',
    name: '83s',
    logo: {
      src: '/isotipoweb-83s.svg',
      width: 221,
      height: 106,
    },
    navKeys: [
      'nav_homepage_title',
      'nav_video_title',
      'nav_photography_title',
      'nav_about_title',
      'nav_contact_title',
    ],
    instagram: 'https://www.instagram.com/83s.content/',
    copyrightName: '83s',
    icons: {
      base: '/favicons/83s',
      manifest: '/favicons/83s/manifest.json',
      browserconfig: '/favicons/83s/browserconfig.xml',
      msTile: '/favicons/83s/ms-icon-144x144.png',
    },
    themeColor: '#000000',
    msTileColor: '#000000',
    seo: {
      defaultOgImage: '/favicons/83s/og-default.jpg',
      defaultDescription: null,
    },
  },
};

export const HOST_PATTERNS = [
  { site: '83s', pattern: '(^|\\.)83s(\\.|$)' },
  { site: 'gsd00', pattern: '(^|\\.)gsd00(\\.|$)' },
];

const HOST_MAP = HOST_PATTERNS.map(({ site, pattern }) => ({
  site,
  match: new RegExp(pattern),
}));

export function siteFromHost(host = '') {
  const clean = host.toLowerCase().split(':')[0];
  const entry = HOST_MAP.find(({ match }) => match.test(clean));
  return entry ? entry.site : DEFAULT_SITE;
}

export function getSiteConfig(siteKey) {
  return sites[siteKey] || sites[DEFAULT_SITE];
}
