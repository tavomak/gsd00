import Layout from '@/components/Templates/Layout';
import Marquee from '@/components/Molecules/Marquee';
import { getPageBySlug } from '@/utils';

export async function getStaticProps(context) {
  const { locale } = context;
  try {
    const pageResponse = await getPageBySlug('about', [locale]);
    const data = pageResponse?.data?.page || {};
    return {
      props: {
        data,
      },
      revalidate: 100,
    };
  } catch (error) {
    console.error('Error fetching about page:', error);
    return {
      props: {
        data: {},
      },
      revalidate: 100,
    };
  }
}

const About = ({ data }) => {
  console.info({ data });
  return (
    <Layout title="About">
      <section className="mb-10 text-black bg-primary-color">
        <Marquee />
      </section>
      <section className="container max-w-screen-xl mx-auto">
        <h1 className="mb-4 text-4xl font-bold">{data.title}</h1>
      </section>
    </Layout>
  );
};

export default About;
