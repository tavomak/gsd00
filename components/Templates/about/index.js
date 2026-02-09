import Layout from '@/components/Templates/Layout';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';
import RichContent from '@/components/Atoms/RichContent';
import { getPageBySlug, getServices, siteName } from '@/utils';
import useTranslation from 'next-translate/useTranslation';

export async function getStaticProps(context) {
  const { locale } = context;
  const pageResponse = await getPageBySlug('about', [locale]);
  const data = pageResponse?.data?.page || [];
  const servicesResponse = await getServices([locale]);
  const services = servicesResponse?.data?.services || [];
  return {
    props: {
      data,
      services,
    },
    revalidate: 100,
  };
}

const About = ({ data, services }) => {
  const { t } = useTranslation('common');
  return (
    <Layout title="About">
      <section className="py-6 overflow-x-hidden lg:py-10 min-h-[40vh] flex flex-col items-center justify-center">
        <div className="w-5/6 md:w-1/2 lg:w-1/3">
          <Image
            src={data?.primaryImage?.url}
            alt={data?.primaryImage?.alt || siteName}
            width={data?.primaryImage?.width || 445}
            height={data?.primaryImage?.height || 604}
            priority
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        <Marquee speed={200}>
          <h2 className="flex gap-4 py-6 text-6xl font-bold 2xl:text-9xl me-20">
            <span> Mobile </span>
            <span className="text-primary-color">Design </span>
            <span>
              <i>Filmmaking</i>
            </span>
          </h2>
        </Marquee>
      </section>

      {data?.sections?.map((section) => (
        <section
          key={section?.id}
          className="container flex flex-col justify-between max-w-screen-xl gap-4 px-4 mx-auto mb-10 xl:mb-20 lg:py-10 xl:gap-10 lg:flex-row about-section"
        >
          <div className="lg:w-1/3">
            <h2 className="font-bold lg:text-4xl">{section?.title}</h2>
          </div>
          <div className="lg:w-2/3">
            <RichContent content={section?.content?.json} />
          </div>
        </section>
      ))}

      <section className="container flex flex-col justify-between max-w-screen-xl gap-4 px-4 mx-auto mb-10 xl:mb-20 lg:py-10 xl:gap-10 lg:flex-row about-section">
        <div className="lg:w-1/3">
          <h3 className="text-4xl font-bold">{t('nav_services_title')}</h3>
        </div>
        <div className="lg:w-2/3">
          <ul className="pl-5 list-disc">
            {services?.map((service) => (
              <li key={service?.id}>
                <p className="mb-10 text-2xl font-bold">{service?.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default About;
