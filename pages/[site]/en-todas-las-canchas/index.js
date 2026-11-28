import { getSiteConfig } from '@/config/sites';
import Documentary from '@/components/Templates/Documentary';

// Landing only exists on 83s; gsd00 gets a 404.
export async function getStaticPaths({ locales }) {
  return {
    paths: locales.map((locale) => ({ params: { site: '83s' }, locale })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const siteConfig = getSiteConfig(params.site);
  return {
    props: { siteKey: siteConfig.key, siteDomain: siteConfig.domain },
  };
}

export default Documentary;
