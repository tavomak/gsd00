import Document, { Html, Head, Main, NextScript } from 'next/document';
import { DEFAULT_SITE, sites } from '@/config/sites';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const querySite = ctx.query?.site;
    const site = querySite && sites[querySite] ? querySite : DEFAULT_SITE;
    return { ...initialProps, locale: ctx.locale, site };
  }

  render() {
    const { locale, site } = this.props;
    return (
      <Html lang={locale || 'en'} data-site={site}>
        <Head />
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
