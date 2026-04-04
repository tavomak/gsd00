import { useState } from 'react';
import Layout from '@/components/Templates/Layout';
import Marquee from '@/components/Molecules/Marquee';
import RichContent from '@/components/Atoms/RichContent';
import {
  getProjects,
  getProjectBySlug,
  rateLimit,
  GET_PROJECT_BY_SLUG,
  GET_PROJECTS,
} from '@/utils';
import MasonryGallery from '@/components/Atoms/MasonryGallery';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export async function getStaticProps({ params, locale }) {
  await rateLimit();
  const { slug } = params;
  try {
    const response = await getProjectBySlug(GET_PROJECT_BY_SLUG, slug, [
      locale,
    ]);
    const data = response?.data?.project || {};
    return {
      props: {
        data,
      },
      revalidate: 100,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return {
      props: {
        data: {},
      },
      revalidate: 100,
    };
  }
}

export async function getStaticPaths({ locales, defaultLocale }) {
  await rateLimit();
  try {
    const projectsResponse = await getProjects(
      GET_PROJECTS,
      locales ?? [defaultLocale]
    );
    const projects = projectsResponse?.data?.projects || [];
    return {
      paths: projects.map((project) => ({
        params: { slug: project.slug },
      })),
      fallback: true,
    };
  } catch (error) {
    console.error('Error fetching project paths:', error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

const getFormattedMedia = (mediaNodes) =>
  (mediaNodes || []).map((node) => ({
    id: node.id,
    src: node.url,
    alt: node.title || 'Project Image',
  }));

const Project = ({ data }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [gallerySample, setGallerySample] = useState([]);
  return (
    <Layout
      title={data?.seoMetadata?.title}
      description={data?.seoMetadata?.description}
    >
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={gallerySample}
        plugins={[Thumbnails]}
        index={lightboxIndex}
      />
      <section className="mb-20 text-black bg-primary-color">
        <Marquee />
      </section>
      <section className="py-6 overflow-x-hidden lg:py-10">
        <Marquee direction="right" speed={40}>
          <h2 className="flex gap-4 py-6 text-6xl font-bold me-20">
            {data?.title}
          </h2>
        </Marquee>
      </section>
      {data?.gallery?.length > 0 && (
        <section className="container max-w-screen-xl px-4 mx-auto py-14 lg:px-0">
          <MasonryGallery
            images={getFormattedMedia(data.gallery)}
            onImageClick={(imgIndex) => {
              setGallerySample(getFormattedMedia(data.gallery));
              setLightboxIndex(imgIndex);
              setLightboxOpen(true);
            }}
          />
        </section>
      )}
      {data?.description?.raw && (
        <section className="container max-w-screen-xl px-4 mx-auto py-14 lg:px-0">
          <h3 className="mb-6 text-xl font-bold">{data?.title}</h3>
          <RichContent content={data.description.raw} />
        </section>
      )}
    </Layout>
  );
};

export default Project;
