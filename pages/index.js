import { useState, useRef } from 'react';
import { galleryImages, getPageBySlug } from '@/utils';
import { GET_PAGE_HOME } from '@/utils/queries/hygraph';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Marquee from '@/components/Molecules/Marquee';
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

const gallerySample = galleryImages.filter((item, key) => key < 6);

export async function getStaticProps(context) {
  const { locale } = context;
  try {
    const response = await getPageBySlug(GET_PAGE_HOME, 'home', [locale]);
    const data = response?.data?.page || {};
    return {
      props: {
        data,
      },
      revalidate: 100,
    };
  } catch (error) {
    console.error('Error fetching home page:', error);
    return {
      props: {
        data: {},
      },
      revalidate: 100,
    };
  }
}

const Home = ({ data }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState('masonry');
  const galleryRef = useRef(null);
  const { t } = useTranslation('common');
  return (
    <Layout
      title={data?.seoMetadata?.title}
      description={data?.seoMetadata?.seoDescription}
      image={data?.seoMetadata?.seoImage?.url}
    >
      <section className="mb-10 text-black bg-primary-color">
        <Marquee />
      </section>

      <section className="container max-w-screen-xl mx-auto">
        <div className="mx-4 overflow-hidden border border-neutral-800">
          <VideoIframe videoId="1031092352" controls muted />
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={gallerySample}
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
            images={gallerySample}
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
            {gallerySample &&
              gallerySample.map((image, index) => (
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
            totalItems={gallerySample.length}
            targetRef={galleryRef}
          />
        )}
      </section>

      <section className="flex justify-center my-10">
        <Link href="/gallery">
          <Button className="btn btn-primary group">
            {t('nav_go_to_gallery_title')}
          </Button>
        </Link>
      </section>
    </Layout>
  );
};

export default Home;
