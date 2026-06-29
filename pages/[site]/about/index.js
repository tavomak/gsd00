import Image from 'next/image';
import Layout from '@/components/Templates/Layout';
import { getPageBySlug } from '@/utils';
import { GET_PAGE_ABOUT } from '@/utils/queries/hygraph';
import RichContent from '@/components/Atoms/RichContent';
import FadeIn from '@/components/Atoms/FadeIn';
import Marquee from '@/components/Molecules/Marquee';
import { sites, getSiteConfig } from '@/config/sites';

export async function getStaticPaths({ locales }) {
  const siteKeys = Object.keys(sites);
  return {
    paths: locales.flatMap((locale) =>
      siteKeys.map((site) => ({ params: { site }, locale }))
    ),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { locale, params } = context;
  const siteConfig = getSiteConfig(params.site);
  try {
    const pageResponse = await getPageBySlug(GET_PAGE_ABOUT, 'about', [locale]);
    const data = pageResponse?.data?.page || {};
    return {
      props: {
        data,
        siteKey: siteConfig.key,
      },
      revalidate: 100,
    };
  } catch (error) {
    console.error('Error fetching about page:', error);
    return {
      props: {
        data: {},
        siteKey: siteConfig.key,
      },
      revalidate: 100,
    };
  }
}

const AboutPage = ({ data }) => (
  <Layout
    title={data?.seoMetadata?.title}
    description={data?.seoMetadata?.seoDescription}
  >
    <section className="mb-10 text-black bg-primary-color">
      <Marquee />
    </section>

    <FadeIn className="container max-w-screen-xl px-4 py-16 mx-auto">
      {data?.title && (
        <h1 className="mb-10 text-2xl uppercase">{data.title}</h1>
      )}
      <div className="flex flex-col gap-12 md:flex-row md:items-start">
        <div className="flex-1 max-w-3xl">
          <RichContent content={data?.biography?.raw} />
        </div>
        {data?.seoMetadata?.seoImage?.url && (
          <div className="w-full md:w-2/5 shrink-0">
            <Image
              src={data.seoMetadata.seoImage.url}
              alt={data.title || ''}
              width={data.seoMetadata.seoImage.width || 800}
              height={data.seoMetadata.seoImage.height || 600}
              className="object-cover w-full rounded-xl"
              priority
            />
          </div>
        )}
      </div>
    </FadeIn>
  </Layout>
);

export default AboutPage;
