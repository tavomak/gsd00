import { useState, useRef } from 'react';
import { getPageBySlug } from '@/utils/lib/api';

import Marquee from 'react-fast-marquee';
import { FaThLarge, FaList } from 'react-icons/fa';
import Layout from '@/components/Templates/Layout';
import VideoIframe from '@/components/Atoms/VideoIframe';
import ScrollTriggered from '@/components/Atoms/ScrollTriggered';
import GalleryScrollIndicator from '@/components/Atoms/GalleryScrollIndicator';
import MasonryGallery from '@/components/Atoms/MasonryGallery';
import Button from '@/components/Atoms/Button';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import { galleryImages } from '@/utils';

export async function getStaticProps(context) {
  const { locale } = context;
  const response = await getPageBySlug('home', [locale]);
  const data = response?.data?.page || [];

  return {
    props: {
      data,
    },
    revalidate: 100,
  };
}

const Home = ({ data }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState('masonry');
  const galleryRef = useRef(null);
  return (
    <Layout
      title={data?.seoMetadata?.title}
      description={data?.seoMetadata?.seoDescription}
      image={data?.seoMetadata?.seoImage?.url}
    >
      <section className="py-2 overflow-x-hidden lg:py-4">
        <Marquee speed={200} autoFill>
          <h2 className="flex gap-4 py-2 text-2xl font-bold uppercase 2xl:text-4xl me-20">
            <span> Free Style </span>
            <span className="text-primary-color">Photography </span>
          </h2>
        </Marquee>
      </section>

      <section className="container max-w-screen-xl mx-auto">
        <div className="mx-4 overflow-hidden border border-neutral-800">
          <VideoIframe videoId="1031092352" controls muted />
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={galleryImages}
        plugins={[Thumbnails]}
        index={lightboxIndex}
      />

      <section
        className="container max-w-screen-xl px-4 mx-auto my-10"
        id="gallery"
      >
        <div className="relative flex items-center justify-end gap-2 mb-6">
          <Button
            aria-label="Masonry view"
            className={`btn ${viewMode === 'masonry' ? 'btn-primary' : 'border border-neutral-600'}`}
            onClick={() => setViewMode('masonry')}
          >
            <FaThLarge />
          </Button>
          <Button
            aria-label="Scroll view"
            className={`btn ${viewMode === 'scroll' ? 'btn-primary' : 'border border-neutral-600'}`}
            onClick={() => setViewMode('scroll')}
          >
            <FaList />
          </Button>
        </div>

        {viewMode === 'masonry' ? (
          <MasonryGallery
            images={galleryImages}
            onImageClick={(index) => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          />
        ) : (
          <div
            ref={galleryRef}
            className="container max-w-screen-md mx-auto overflow-visible"
          >
            {galleryImages &&
              galleryImages.map((image, index) => (
                <button
                  type="button"
                  key={image.id}
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                  className="sticky top-20 w-full text-left"
                >
                  <ScrollTriggered
                    src={image.src}
                    alt={image.alt}
                    width={1440}
                    height={810}
                    position={image.position}
                    index={index + 1}
                  />
                </button>
              ))}
          </div>
        )}

        {viewMode === 'scroll' && (
          <GalleryScrollIndicator
            totalItems={galleryImages.length}
            targetRef={galleryRef}
          />
        )}
      </section>
    </Layout>
  );
};

export default Home;
