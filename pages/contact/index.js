import Image from 'next/image';
import Layout from '@/components/Templates/Layout';
import Marquee from 'react-fast-marquee';
import { getPageBySlug, siteName } from '@/utils';
import ContactForm from '@/components/Molecules/ContactForm';

export async function getStaticProps(context) {
  const { locale } = context;
  const response = await getPageBySlug('contact', [locale]);
  const data = response?.data?.page || [];
  return {
    props: {
      data,
    },
    revalidate: 100,
  };
}

const Contact = ({ data }) => (
  <Layout
    title={data?.seoMetaData?.title}
    description={data?.seoMetaData?.description}
    noPreFooter
  >
    <section className="py-6 overflow-x-hidden lg:py-10 min-h-[40vh] flex flex-col items-center justify-center">
      <Marquee speed={200} autoFill>
        <h2 className="flex gap-4 py-6 text-6xl font-bold 2xl:text-9xl me-20">
          <span> {data?.title} </span>
        </h2>
      </Marquee>
    </section>

    <section className="container flex justify-center max-w-screen-xl px-4 mx-auto">
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
    </section>
  </Layout>
);

export default Contact;
