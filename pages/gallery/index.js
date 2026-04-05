import { useState, useRef } from 'react';
import { getPageBySlug, galleryImages } from '@/utils';
import { GET_PAGE_GALLERY } from '@/utils/queries/hygraph';
import Marquee from '@/components/Molecules/Marquee';
import { FaThLarge, FaList } from 'react-icons/fa';
import Layout from '@/components/Templates/Layout';
import ScrollTriggered from '@/components/Atoms/ScrollTriggered';
import GalleryScrollIndicator from '@/components/Atoms/GalleryScrollIndicator';
import MasonryGallery from '@/components/Atoms/MasonryGallery';
import Button from '@/components/Atoms/Button';
import FadeIn from '@/components/Atoms/FadeIn';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export async function getStaticProps(context) {
  const { locale } = context;
  try {
    const response = await getPageBySlug(GET_PAGE_GALLERY, 'gallery', [locale]);
    const data = response?.data?.page || {};
    return {
      props: {
        data,
      },
      revalidate: 100,
    };
  } catch (error) {
    console.error('Error fetching gallery page:', error);
    return {
      props: {
        data: {},
      },
      revalidate: 100,
    };
  }
}

const Gallery = ({ data }) => {
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
      <section className="mb-10 text-black bg-primary-color">
        <Marquee />
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
        <FadeIn>
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
                    className="sticky w-full text-left top-20"
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
        </FadeIn>
      </section>
    </Layout>
  );
};

export default Gallery;
