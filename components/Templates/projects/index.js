import Image from 'next/image';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Layout from '@/components/Templates/Layout';
import Marquee from 'react-fast-marquee';
import { getPageBySlug, getProjects, rateLimit } from '@/utils';

export async function getStaticProps({ locale }) {
  await rateLimit();
  const pageResponse = await getPageBySlug('projects', [locale]);
  const data = pageResponse?.data?.page || [];
  const projectsResponse = await getProjects([locale]);
  const projects = projectsResponse?.data?.projects || [];

  return {
    props: {
      data,
      projects,
    },
    revalidate: 100,
  };
}

const Projects = ({ data, projects }) => {
  const { lang } = useTranslation();
  const { t } = useTranslation('common');
  return (
    <Layout
      title={data?.seoMetaData?.title}
      description={data?.seoMetaData?.description}
    >
      <section className="py-6 overflow-x-hidden lg:py-10 lg:min-h-[40vh] flex flex-col items-center justify-center">
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
      <section className="container max-w-screen-xl px-4 mx-auto">
        <div className="flex-wrap w-full md:flex">
          {projects.map((project) => (
            <Link
              key={project?.id}
              href={`${lang === 'es' ? '' : 'en'}/projects/${project?.slug}`}
              className="flex flex-col mb-5 md:p-4 md:w-3/6 lg:w-2/6 group"
            >
              <Image
                src={project?.primaryImage?.url}
                alt={project?.title}
                width={project?.primaryImage?.width || 300}
                height={project?.primaryImage?.height || 300}
                className="transition-all duration-300 border shadow rounded-xl hover:scale-105 border-neutral-800"
                priority
                style={{
                  height: '250px',
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
              <h3 className="mt-4 text-xl font-bold transition-all duration-300 group-hover:text-primary-color">
                {project?.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="container flex flex-col justify-between max-w-screen-xl gap-4 px-4 mx-auto mt-10 xl:mt-20 lg:py-10 xl:gap-10 lg:flex-row">
        <div className="lg:w-1/3">
          <h2 className="text-xl font-bold lg:text-4xl">
            {t('our_customers')}
          </h2>
        </div>
        <div className="lg:w-2/3">
          <div className="mb-5" />
        </div>
      </section>
      <section className="container max-w-screen-xl px-4 mx-auto my-10">
        <ul className="flex flex-col flex-wrap items-center justify-center w-full lg:flex-row">
          {data?.logos?.map((item) => (
            <li className="w-1/2 p-12 lg:w-3/12" key={item?.id}>
              <Image
                src={item?.logo?.url}
                alt={item?.title}
                width={item?.logo?.width || 280}
                height={item?.logo?.height || 100}
                priority
                style={{
                  width: '100%',
                  height: '100px',
                  maxHeight: '90px',
                  objectFit: 'contain',
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export default Projects;
