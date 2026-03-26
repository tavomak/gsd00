import { useState } from 'react';
import Layout from '@/components/Templates/Layout';
import Marquee from '@/components/Molecules/Marquee';
import VideoIframe from '@/components/Atoms/VideoIframe';

import { getWpProjects, getWpProjectById, rateLimit } from '@/utils';
import MasonryGallery from '@/components/Atoms/MasonryGallery';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export async function getStaticProps({ params, locale }) {
  await rateLimit();
  const { slug } = params;
  try {
    const response = await getWpProjectById(slug, [locale]);
    const data = response?.data?.proyecto || {};
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

export async function getStaticPaths() {
  await rateLimit();
  try {
    const projectsResponse = await getWpProjects();
    const projects = projectsResponse?.data?.proyectos?.nodes || [];
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
  mediaNodes.map((node) => ({
    id: node.id,
    src: node.mediaItemUrl,
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
      <section className="py-6 overflow-x-hidden lg:py-10">
        <Marquee speed={200}>
          <h2 className="flex gap-4 py-6 text-6xl font-bold 2xl:text-9xl me-20">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: data?.title }}
            />
          </h2>
        </Marquee>
      </section>
      {data?.proyectos?.secciones?.map((section) => (
        <section
          key={section.tipoDeContenido}
          className="container max-w-screen-xl mx-auto py-14"
        >
          {section?.video && (
            <div className="mx-4 overflow-hidden border rounded-xl xl:rounded-3xl border-neutral-800">
              <VideoIframe videoId={section?.video} controls muted />
            </div>
          )}
          {section?.galeria?.nodes?.length > 0 && (
            <button
              type="button"
              className="w-full text-left"
              onClick={() => {
                setGallerySample(getFormattedMedia(section.galeria.nodes));
                setLightboxOpen(true);
              }}
            >
              <MasonryGallery
                key={section.tipoDeContenido}
                images={getFormattedMedia(section.galeria.nodes)}
                onImageClick={(imgIndex) => {
                  setLightboxIndex(imgIndex);
                }}
              />
            </button>
          )}
          {section?.mixto && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: section.mixto }}
            />
          )}
        </section>
      ))}
    </Layout>
  );
};

export default Project;
