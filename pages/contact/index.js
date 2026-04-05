import Image from 'next/image';
import Layout from '@/components/Templates/Layout';
import Marquee from '@/components/Molecules/Marquee';
import ContactForm from '@/components/Molecules/ContactForm';
import { getPageBySlug, siteName } from '@/utils';
import { GET_PAGE_CONTACT } from '@/utils/queries/hygraph';
import FadeIn from '@/components/Atoms/FadeIn';

export async function getStaticProps(context) {
  const { locale } = context;
  try {
    const response = await getPageBySlug(GET_PAGE_CONTACT, 'contact', [locale]);
    const data = response?.data?.page || {};
    return {
      props: {
        data,
      },
      revalidate: 100,
    };
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return {
      props: {
        data: {},
      },
      revalidate: 100,
    };
  }
}

const Contact = ({ data }) => (
  <Layout
    title={data?.seoMetadata?.title}
    description={data?.seoMetadata?.seoDescription}
    noPreFooter
    noContact
  >
    <section className="mb-10 text-black bg-primary-color">
      <Marquee />
    </section>

    <section className="container flex items-center justify-center max-w-screen-xl px-4 mx-auto min-h-[80vh]">
      <FadeIn className="flex flex-col items-center justify-center w-full gap-6 lg:flex-row">
        <div className="hidden px-6 lg:w-1/3">
          {data?.primaryImage?.url && (
            <Image
              src={data?.primaryImage?.url}
              alt={data?.primaryImage?.alt || siteName}
              width={data?.primaryImage?.width || 280}
              height={data?.primaryImage?.height || 100}
              priority
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>

        <div className="w-full lg:w-2/3">
          <ContactForm />
        </div>
      </FadeIn>
    </section>
  </Layout>
);

export default Contact;
