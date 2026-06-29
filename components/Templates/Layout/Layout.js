import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Navbar from '@/components/Molecules/Navbar';
import Footer from '@/components/Molecules/Footer';
import PropTypes from 'prop-types';
import { useSite } from '@/contexts/SiteContext';
import GoToTopButton from '@/components/Molecules/GoToTopButton';
import i18nConfig from '@/i18n.json';

const APPLE_ICON_SIZES = [57, 60, 72, 76, 114, 120, 144, 152, 180];
const FAVICON_PNG_SIZES = [32, 96, 16];

const OG_LOCALE_MAP = {
  es: 'es_ES',
  en: 'en_US',
};

function stripLocale(pathname, locales) {
  const match = locales.find(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );
  if (!match) return pathname;
  if (pathname === `/${match}`) return '/';
  return pathname.slice(match.length + 1);
}

function buildLocalizedUrl(origin, locale, defaultLocale, pathname) {
  const path = pathname === '/' ? '' : pathname;
  if (locale === defaultLocale) return `${origin}${path || '/'}`;
  return `${origin}/${locale}${path}`;
}

function absolutize(origin, url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

const Layout = ({
  children,
  title,
  description,
  schema,
  className,
  image,
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt,
  ogType = 'website',
  noPreFooter,
  noContact,
}) => {
  const { t, lang } = useTranslation('common');
  const { config } = useSite();
  const router = useRouter();
  const siteName = config?.name || '';
  const domain = config?.domain || '';
  const origin = domain ? `https://${domain}` : '';
  const iconBase = config?.icons?.base || '';
  const manifestHref = config?.icons?.manifest || '/manifest.json';
  const msTileHref = config?.icons?.msTile || '';
  const themeColor = config?.themeColor || '#ffffff';
  const msTileColor = config?.msTileColor || themeColor;
  const locales = i18nConfig.locales || ['es', 'en'];
  const defaultLocale =
    config?.defaultLocale || i18nConfig.defaultLocale || 'es';
  const asPath = (router?.asPath || '/').split('?')[0].split('#')[0];
  const cleanPath = stripLocale(asPath, locales);
  const canonical = buildLocalizedUrl(origin, lang, defaultLocale, cleanPath);
  const ogImageResolved = absolutize(
    origin,
    image || config?.seo?.defaultOgImage || ''
  );
  const metaDescription =
    description ||
    config?.seo?.defaultDescription ||
    t('seo.default_description');
  const resolvedTitle =
    title && title !== siteName ? `${title} | ${siteName}` : siteName;
  const twitterHandle = config?.twitter || '';
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <Head>
        <title>{resolvedTitle}</title>
        <meta charSet="UTF-8" />
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonical} />

        {locales.map((loc) => (
          <link
            key={`hreflang-${loc}`}
            rel="alternate"
            hrefLang={loc}
            href={buildLocalizedUrl(origin, loc, defaultLocale, cleanPath)}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={buildLocalizedUrl(
            origin,
            defaultLocale,
            defaultLocale,
            cleanPath
          )}
        />

        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={resolvedTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:locale" content={OG_LOCALE_MAP[lang] || 'es_ES'} />
        {locales
          .filter((loc) => loc !== lang)
          .map((loc) => (
            <meta
              key={`og-locale-${loc}`}
              property="og:locale:alternate"
              content={OG_LOCALE_MAP[loc] || loc}
            />
          ))}
        {ogImageResolved && (
          <>
            <meta property="og:image" content={ogImageResolved} />
            <meta property="og:image:width" content={String(imageWidth)} />
            <meta property="og:image:height" content={String(imageHeight)} />
            <meta property="og:image:alt" content={imageAlt || resolvedTitle} />
          </>
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={resolvedTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {ogImageResolved && (
          <meta name="twitter:image" content={ogImageResolved} />
        )}
        {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}

        {APPLE_ICON_SIZES.map((size) => (
          <link
            key={`apple-${size}`}
            rel="apple-touch-icon"
            sizes={`${size}x${size}`}
            href={`${iconBase}/apple-icon-${size}x${size}.png`}
          />
        ))}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`${iconBase}/android-icon-192x192.png`}
        />
        {FAVICON_PNG_SIZES.map((size) => (
          <link
            key={`favicon-${size}`}
            rel="icon"
            type="image/png"
            sizes={`${size}x${size}`}
            href={`${iconBase}/favicon-${size}x${size}.png`}
          />
        ))}
        <link rel="icon" sizes="any" href={`${iconBase}/favicon.ico`} />
        <link rel="manifest" href={manifestHref} />
        <meta name="msapplication-TileColor" content={msTileColor} />
        {msTileHref && (
          <meta name="msapplication-TileImage" content={msTileHref} />
        )}
        <meta name="theme-color" content={themeColor} />
      </Head>
      <Navbar />
      <main className={`min-h-[calc(100vh-217px)] flex flex-col ${className}`}>
        <h1 className="sr-only">{title}</h1>
        {children}
      </main>
      <ToastContainer />
      {showTopBtn && <GoToTopButton />}
      <Footer noPreFooter={noPreFooter} noContact={noContact} />
      {schema && (
        // eslint-disable-next-line
        <Script
          id="structured-data"
          key="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          strategy="beforeInteractive"
        />
      )}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  schema: PropTypes.shape({}),
  className: PropTypes.string,
  image: PropTypes.string,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  imageAlt: PropTypes.string,
  ogType: PropTypes.string,
  noPreFooter: PropTypes.bool,
  noContact: PropTypes.bool,
};

export default Layout;
