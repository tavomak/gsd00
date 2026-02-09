import { useState } from 'react';
import { getPageBySlug } from '@/utils/lib/api';

import Marquee from 'react-fast-marquee';
import Layout from '@/components/Templates/Layout';
import VideoIframe from '@/components/Atoms/VideoIframe';
import RichContent from '@/components/Atoms/RichContent';
import ScrollTriggered from '@/components/Atoms/ScrollTriggered';
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

      <section className="container flex-col justify-between hidden gap-4 px-4 mx-auto xl:gap-10 lg:flex-row">
        <div className="lg:w-1/2">
          <div className="my-5">
            <RichContent content={data?.twoColumnsText?.[0]?.raw} />
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="my-5">
            <RichContent content={data?.twoColumnsText?.[1]?.raw} />
          </div>
        </div>
      </section>

      {data?.sections?.map((section) => (
        <section
          key={section?.id}
          className="container flex flex-col justify-between hidden max-w-screen-xl gap-4 px-4 mx-auto lg:py-10 xl:gap-10 lg:flex-row"
        >
          <div className="lg:w-1/3">
            <h2 className="font-bold lg:text-4xl">{section?.title}</h2>
          </div>
          <div className="lg:w-2/3">
            <RichContent content={section?.content?.json} />
          </div>
        </section>
      ))}

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
        {galleryImages &&
          galleryImages.map((image, index) => (
            <a
              href="!#"
              key={image.id}
              onClick={(e) => {
                e.preventDefault();
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
            >
              <ScrollTriggered
                src={image.src}
                alt={image.alt}
                width={1440}
                height={810}
                position={image.position}
                index={index + 1}
              />
            </a>
          ))}
      </section>
    </Layout>
  );
};

export default Home;
