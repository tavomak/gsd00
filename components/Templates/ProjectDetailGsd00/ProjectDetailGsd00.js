import { useState } from 'react';
import PropTypes from 'prop-types';
import Layout from '@/components/Templates/Layout';
import Marquee from '@/components/Molecules/Marquee';
import ImageGalleryCarousel from '@/components/Molecules/ImageGalleryCarousel';
import RichContent from '@/components/Atoms/RichContent';
import MasonryGallery from '@/components/Atoms/MasonryGallery';
import FadeIn from '@/components/Atoms/FadeIn';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const getFormattedMedia = (mediaNodes) =>
  (mediaNodes || []).map((node) => ({
    id: node.id,
    src: node.url,
    alt: node.title || 'Project Image',
  }));

const ProjectDetailGsd00 = ({ data }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [gallerySample, setGallerySample] = useState([]);
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

      {data?.gallery?.length > 0 && (
        <section className="container max-w-screen-xl py-6 mx-auto">
          <FadeIn>
            <div className="mx-4">
              <ImageGalleryCarousel
                items={(data.gallery || []).slice(0, 4).map((project) => ({
                  id: project.id,
                  src: project.url,
                  alt: project.title || data?.title || 'Project image',
                  title: project.title,
                }))}
                autoplay
                loop
                showArrows
                showDots
                onImageClick={(index) => {
                  setGallerySample(getFormattedMedia(data.gallery));
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              />
            </div>
          </FadeIn>
        </section>
      )}

      <section className="py-6 overflow-x-hidden lg:py-10">
        <Marquee direction="right" speed={40}>
          <h2 className="flex gap-4 py-6 text-4xl uppercase me-20">
            {data?.title}
          </h2>
        </Marquee>
      </section>

      {data?.gallery?.length > 0 && (
        <section className="container max-w-screen-xl px-4 mx-auto py-14 lg:px-0">
          <FadeIn>
            <MasonryGallery
              images={getFormattedMedia(data.gallery)}
              onImageClick={(imgIndex) => {
                setGallerySample(getFormattedMedia(data.gallery));
                setLightboxIndex(imgIndex);
                setLightboxOpen(true);
              }}
            />
          </FadeIn>
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

ProjectDetailGsd00.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    gallery: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        title: PropTypes.string,
      })
    ),
    description: PropTypes.shape({ raw: PropTypes.shape({}) }),
    seoMetadata: PropTypes.shape({
      title: PropTypes.string,
      seoDescription: PropTypes.string,
    }),
  }),
};

export default ProjectDetailGsd00;
