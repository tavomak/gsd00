import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { HiArrowLongLeft } from 'react-icons/hi2';
import FadeIn from '@/components/Atoms/FadeIn';
import {
  BASE,
  DocumentaryShell,
  Label,
} from '@/components/Templates/Documentary/Documentary';

// ponytail: 22 static files in public/documental/galeria, move to Hygraph when the doc content does
const PHOTOS = Array.from(
  { length: 22 },
  (_, i) => `/documental/galeria/${String(i + 1).padStart(2, '0')}.jpg`
);

const DocumentaryGallery = () => {
  const { t } = useTranslation('documental');
  const [index, setIndex] = useState(-1);
  const slides = PHOTOS.map((src, i) => ({
    src,
    alt: t('gallery.alt', { n: i + 1 }),
  }));

  return (
    <DocumentaryShell
      title={t('gallery.seo.title')}
      description={t('gallery.seo.description')}
    >
      <section className="w-full px-4 py-12 mx-auto max-w-screen-2xl md:px-8 md:py-16">
        <FadeIn className="flex flex-col gap-6 mb-8 md:flex-row md:items-center">
          <div>
            <Label>{t('photos.label')}</Label>
            <h2 className="mt-1 text-5xl italic font-extrabold uppercase font-doc-display md:text-6xl">
              {t('photos.name')}
            </h2>
          </div>
          <p className="max-w-md md:pl-6 md:border-l border-white/30 md:text-lg">
            {t('photos.body')}
          </p>
          <Link
            href={BASE}
            className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] uppercase md:ml-auto font-doc-display hover:text-doc-sky"
          >
            <HiArrowLongLeft className="w-6 h-6" />
            <span className="border-b border-current">{t('gallery.back')}</span>
          </Link>
        </FadeIn>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((img, i) => (
            <button
              type="button"
              key={img.src}
              onClick={() => setIndex(i)}
              className="relative overflow-hidden border rounded aspect-[3/2] border-white/30"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </button>
          ))}
        </div>
        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={slides}
          plugins={[Thumbnails]}
        />
      </section>
    </DocumentaryShell>
  );
};

export default DocumentaryGallery;
