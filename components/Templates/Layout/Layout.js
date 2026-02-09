import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import Script from 'next/script';
import useTranslation from 'next-translate/useTranslation';
import Navbar from '@/components/Molecules/Navbar';
import Footer from '@/components/Molecules/Footer';
import PropTypes from 'prop-types';
import { siteName } from '@/utils';
import GoToTopButton from '@/components/Molecules/GoToTopButton';

const Layout = ({
  children,
  title,
  description,
  schema,
  className,
  image,
  noPreFooter,
}) => {
  const hostname = typeof window !== 'undefined' ? window.location.href : '';
  const { t, lang } = useTranslation('common');
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
    return () => {
      window.removeEventListener('scroll', () => {
        if (window.scrollY > 600) {
          setShowTopBtn(true);
        } else {
          setShowTopBtn(false);
        }
      });
    };
  }, []);
  return (
    <>
      <Head>
        <title>{`${title ? `${title} | ${siteName}` : siteName}`}</title>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content={`${description || t('seo.default_description')}`}
        />
        <link rel="canonical" href={hostname} />
        <meta
          property="og:locale"
          content={lang === 'es' ? 'es_ES' : 'en_US'}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={hostname} />
        <meta property="og:site_name" content={siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content={image} />

        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Navbar />
      <main className={`min-h-[calc(100vh-217px)] flex flex-col ${className}`}>
        <h1 className="sr-only">{title}</h1>
        {children}
      </main>
      <ToastContainer />
      {showTopBtn && <GoToTopButton />}
      <Footer noPreFooter={noPreFooter} />
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
  noPreFooter: PropTypes.bool,
};

export default Layout;
