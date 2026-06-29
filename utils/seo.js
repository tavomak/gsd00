export function buildOrganizationSchema(config) {
  if (!config) return null;
  const url = `https://${config.domain}`;
  const sameAs = [config.instagram].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url,
    logo: `${url}${config.icons?.base || ''}/android-icon-192x192.png`,
    sameAs,
  };
}
