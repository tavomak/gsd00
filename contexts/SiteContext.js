import { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_SITE, getSiteConfig } from '@/config/sites';

const SiteContext = createContext({
  site: DEFAULT_SITE,
  config: getSiteConfig(DEFAULT_SITE),
});

export function SiteProvider({ children, initialSite = DEFAULT_SITE }) {
  const value = useMemo(
    () => ({ site: initialSite, config: getSiteConfig(initialSite) }),
    [initialSite]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

SiteProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialSite: PropTypes.string,
};

export function useSite() {
  return useContext(SiteContext);
}
