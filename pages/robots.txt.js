import { siteFromHost, getSiteConfig } from '@/config/sites';

export async function getServerSideProps({ req, res }) {
  const host = req.headers.host || '';
  const siteKey = siteFromHost(host);
  const siteConfig = getSiteConfig(siteKey);
  const hostname = `https://${siteConfig.domain}`;

  const body = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${hostname}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800'
  );
  res.write(body);
  res.end();

  return { props: {} };
}

export default function Robots() {
  return null;
}
