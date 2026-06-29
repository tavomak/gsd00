import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Layout from '@/components/Templates/Layout';
import Marquee from '@/components/Molecules/Marquee';
import ProjectCard from '@/components/Molecules/ProjectCard';
import FadeIn from '@/components/Atoms/FadeIn';
import { buildOrganizationSchema } from '@/utils';
import { useSite } from '@/contexts/SiteContext';

const Home83s = ({ data, projects }) => {
  const { lang } = useTranslation();
  const { config } = useSite();
  const orgSchema = buildOrganizationSchema(config);
  return (
    <Layout
      title={data?.seoMetadata?.title}
      description={data?.seoMetadata?.seoDescription}
      image={data?.seoMetadata?.seoImage?.url}
      imageWidth={data?.seoMetadata?.seoImage?.width}
      imageHeight={data?.seoMetadata?.seoImage?.height}
      schema={orgSchema}
    >
      <section className="mb-20 text-black bg-primary-color">
        <Marquee />
      </section>
      <section className="container max-w-screen-xl px-4 mx-auto">
        <FadeIn>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} lang={lang} />
            ))}
          </div>
        </FadeIn>
      </section>
    </Layout>
  );
};

Home83s.propTypes = {
  data: PropTypes.shape({
    seoMetadata: PropTypes.shape({
      title: PropTypes.string,
      seoDescription: PropTypes.string,
    }),
  }),
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
};

export default Home83s;
