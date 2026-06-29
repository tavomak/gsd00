import PropTypes from 'prop-types';
import Layout from '@/components/Templates/Layout';
import Marquee from '@/components/Molecules/Marquee';
import VideoIframe from '@/components/Atoms/VideoIframe';
import RichContent from '@/components/Atoms/RichContent';
import FadeIn from '@/components/Atoms/FadeIn';
import { getVimeoId } from '@/utils';

const ProjectDetail83s = ({ data }) => {
  const vimeoIds = (data?.videoList || []).map(getVimeoId).filter(Boolean);

  return (
    <Layout
      title={data?.seoMetadata?.title || data?.title}
      description={data?.seoMetadata?.seoDescription}
      image={data?.seoMetadata?.seoImage?.url || data?.primaryImage?.url}
      imageWidth={data?.seoMetadata?.seoImage?.width}
      imageHeight={data?.seoMetadata?.seoImage?.height}
      imageAlt={data?.title}
      ogType="article"
    >
      <section className="mb-10 text-black bg-primary-color">
        <Marquee />
      </section>

      {data?.title && (
        <section className="py-6 overflow-x-hidden lg:py-10">
          <Marquee direction="right" speed={40}>
            <h2 className="flex gap-4 py-6 text-4xl uppercase me-20">
              {data?.title}
            </h2>
          </Marquee>
        </section>
      )}

      {vimeoIds.length > 0 && (
        <section className="container flex flex-col max-w-screen-xl gap-10 px-4 mx-auto lg:px-0">
          {vimeoIds.map((id) => (
            <FadeIn key={id}>
              <VideoIframe videoId={id} controls />
            </FadeIn>
          ))}
        </section>
      )}

      {data?.description?.raw && (
        <section className="container max-w-screen-xl px-4 mx-auto py-14 lg:px-0">
          <FadeIn>
            <RichContent content={data.description.raw} />
          </FadeIn>
        </section>
      )}
    </Layout>
  );
};

ProjectDetail83s.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    videoList: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.shape({ raw: PropTypes.shape({}) }),
    seoMetadata: PropTypes.shape({
      title: PropTypes.string,
      seoDescription: PropTypes.string,
    }),
  }),
};

export default ProjectDetail83s;
