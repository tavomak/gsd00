import useTranslation from 'next-translate/useTranslation';
import Layout from '@/components/Templates/Layout';
import Marquee from '@/components/Molecules/Marquee';
import ProjectCard from '@/components/Molecules/ProjectCard';
import {
  getPageBySlug,
  getProjects,
  rateLimit,
  GET_PROJECTS,
  GET_PAGE_PROJECTS,
} from '@/utils';

export async function getStaticProps({ locale }) {
  await rateLimit();
  try {
    const pageResponse = await getPageBySlug(GET_PAGE_PROJECTS, 'projects', [
      locale,
    ]);
    const data = pageResponse?.data?.page || {};
    const projectsResponse = await getProjects(GET_PROJECTS, [locale]);
    const projects = projectsResponse?.data?.projects || [];
    return {
      props: {
        data,
        projects,
      },
      revalidate: 100,
    };
  } catch (error) {
    console.error('Error fetching projects page:', error);
    return {
      props: {
        data: {},
        projects: [],
      },
      revalidate: 100,
    };
  }
}

const Projects = ({ data, projects }) => {
  const { lang } = useTranslation();
  return (
    <Layout
      title={data?.seoMetadata?.title}
      description={data?.seoMetadata?.seoDescription}
    >
      <section className="mb-20 text-black bg-primary-color">
        <Marquee />
      </section>
      <section className="container max-w-screen-xl px-4 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
          {projects
            .filter((project) =>
              project.categories?.some((cat) => cat === 'photography')
            )
            .map((project) => (
              <ProjectCard key={project?.id} project={project} lang={lang} />
            ))}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
