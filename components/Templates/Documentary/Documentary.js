import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import { Barlow, Barlow_Condensed, Playfair_Display } from 'next/font/google';
import useTranslation from 'next-translate/useTranslation';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { FaPlay, FaInstagram } from 'react-icons/fa';
import { HiArrowLongRight } from 'react-icons/hi2';
import Layout from '@/components/Templates/Layout';
import FadeIn from '@/components/Atoms/FadeIn';
import VideoIframe from '@/components/Atoms/VideoIframe';
import LanguageSwitcher from '@/components/Atoms/LanguageSwitcher';
import { useSite } from '@/contexts/SiteContext';

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-doc-display',
  display: 'swap',
});
const body = Barlow({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-doc-body',
  display: 'swap',
});
const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-doc-serif',
  display: 'swap',
});

// ponytail: Vimeo IDs live here until the content moves to Hygraph; empty = button shows "coming soon"
const VIDEOS = {
  documentary: '',
  director: '',
  filial: '',
  sponsors: ['', '', ''],
};

const GALLERY = [
  { src: '/documental/galeria-bombos.jpg', className: '' },
  { src: '/documental/galeria-hinchas.jpg', className: '' },
  {
    src: '/documental/galeria-maradona.jpg',
    className: 'col-span-2 md:col-span-1 md:row-span-2',
  },
  { src: '/documental/galeria-banderas.jpg', className: '' },
  { src: '/documental/galeria-messi.jpg', className: '' },
];

const NAV = [
  ['documentary', '#documental'],
  ['director', '#mirada'],
  ['photos', '#fotografias'],
  ['filial', '#filial'],
  ['sponsors', '#sponsors'],
  ['credits', '#creditos'],
];

const Label = ({ children, className = '' }) => (
  <p
    className={`font-doc-display text-xs md:text-sm font-medium uppercase tracking-[0.3em] ${className}`}
  >
    {children}
  </p>
);

Label.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const PlayButton = ({ videoId, onPlay, label, duration, soon }) => (
  <button
    type="button"
    onClick={() => onPlay(videoId)}
    disabled={!videoId}
    title={videoId ? undefined : soon}
    className="flex items-center gap-3 text-left group disabled:cursor-not-allowed"
  >
    <span className="flex items-center justify-center w-10 h-10 transition border-2 border-current rounded-full shrink-0 group-enabled:group-hover:scale-110">
      <FaPlay className="w-3 h-3 ml-0.5" />
    </span>
    <span className="text-sm font-bold leading-tight uppercase font-doc-display">
      {label}
      <br />
      <span className="font-medium">({duration})</span>
    </span>
  </button>
);

PlayButton.propTypes = {
  videoId: PropTypes.string,
  onPlay: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  soon: PropTypes.string.isRequired,
};

// Native <dialog>: Esc, focus trap and backdrop come for free.
const VideoDialog = ({ videoId, onClose, closeLabel }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (videoId) ref.current?.showModal();
    else ref.current?.close();
  }, [videoId]);
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="w-full max-w-5xl p-0 overflow-visible bg-black backdrop:bg-black/85"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-0 text-sm tracking-widest text-white uppercase -top-8 font-doc-display"
      >
        {closeLabel} ✕
      </button>
      {videoId && <VideoIframe videoId={videoId} controls />}
    </dialog>
  );
};

VideoDialog.propTypes = {
  videoId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  closeLabel: PropTypes.string.isRequired,
};

const Documentary = () => {
  const { t } = useTranslation('documental');
  const { config } = useSite();
  const [video, setVideo] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const galleryAlts = t('photos.images', {}, { returnObjects: true });
  const sponsors = t('sponsors.items', {}, { returnObjects: true });
  const soon = t('video.soon');
  const slides = [
    { src: '/documental/fotografo.jpg', alt: t('photos.portrait_alt') },
    ...GALLERY.map((img, i) => ({ src: img.src, alt: galleryAlts[i] })),
  ];

  return (
    <Layout
      title={t('seo.title')}
      description={t('seo.description')}
      image="/documental/hero.jpg"
      imageWidth={2400}
      imageHeight={1600}
      ogType="video.movie"
      noChrome
      className={`${display.variable} ${body.variable} ${serif.variable} font-doc-body text-doc-cream`}
    >
      <header className="sticky top-0 z-30 border-b border-white/10 bg-doc-navy/95 backdrop-blur">
        <div className="flex items-center gap-4 px-4 py-3 mx-auto max-w-screen-2xl md:px-8">
          <Link href="/" className="shrink-0">
            <Image
              src={config.logo.src}
              alt={config.name}
              width={56}
              height={27}
            />
          </Link>
          <span className="hidden h-8 border-l lg:block border-white/30" />
          <span className="hidden text-sm font-bold tracking-wide uppercase lg:block font-doc-display">
            {t('nav.title')}
          </span>
          <nav className="hidden gap-6 ml-auto xl:flex">
            {NAV.map(([key, href]) => (
              <a
                key={key}
                href={href}
                className="text-xs font-medium tracking-wider uppercase transition font-doc-display hover:text-doc-sky"
              >
                {t(`nav.${key}`)}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 ml-auto xl:ml-4">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setVideo(VIDEOS.documentary)}
              disabled={!VIDEOS.documentary}
              title={VIDEOS.documentary ? undefined : soon}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-wider uppercase transition border rounded border-doc-cream font-doc-display hover:bg-doc-cream hover:text-doc-navy disabled:cursor-not-allowed"
            >
              <FaPlay className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">{t('nav.cta')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="documental"
        className="relative flex items-end overflow-hidden scroll-mt-16 min-h-[85vh] lg:min-h-[30vh] xl:min-h[500px]"
      >
        <Image
          src="/documental/hero.jpg"
          alt={t('hero.image_alt')}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="relative w-full px-4 py-16 mx-auto max-w-screen-2xl md:px-8 md:py-24">
          <FadeIn className="max-w-xl">
            <Label className="mb-4">{t('hero.kicker')}</Label>
            <Image
              src="/documental/titulo.webp"
              alt={t('hero.title_alt')}
              width={1520}
              height={485}
              priority
              className="w-full h-auto"
            />
            <p className="mt-10 font-doc-serif text-lg md:text-xl">
              {t('hero.tagline')}
            </p>
            <button
              type="button"
              onClick={() => setVideo(VIDEOS.documentary)}
              disabled={!VIDEOS.documentary}
              title={VIDEOS.documentary ? undefined : soon}
              className="flex items-center gap-4 px-6 py-3 mt-6 text-sm font-bold tracking-widest uppercase transition border rounded font-doc-display border-doc-cream hover:bg-doc-cream hover:text-doc-navy disabled:cursor-not-allowed"
            >
              <FaPlay className="w-3 h-3" />
              {t('hero.cta')}
              <span className="font-medium">({t('hero.duration')})</span>
            </button>
          </FadeIn>
        </div>
      </section>

      {/* La mirada del director */}
      <section
        id="mirada"
        className="grid scroll-mt-16 lg:grid-cols-[1fr_1.15fr] border-y border-white/20"
      >
        <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-[420px]">
          <Image
            src="/documental/director.jpg"
            alt={t('director.image_alt')}
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="px-6 py-12 bg-doc-cream text-doc-navy md:px-12 lg:py-16 lg:flex lg:flex-col lg:justify-center">
          <FadeIn>
            <Label className="font-bold">{t('director.label')}</Label>
            <blockquote className="mt-4 text-3xl italic leading-tight font-doc-serif md:text-4xl">
              “{t('director.quote')}”
            </blockquote>
            <p className="max-w-xl mt-4 md:text-lg">{t('director.body')}</p>
            <div className="flex flex-wrap items-center justify-between gap-6 mt-8">
              <p className="pl-4 leading-tight border-l border-doc-navy/40">
                {t('director.name')}
                <br />
                <span className="text-doc-navy/70">{t('director.role')}</span>
              </p>
              <PlayButton
                videoId={VIDEOS.director}
                onPlay={setVideo}
                label={t('director.cta')}
                duration={t('director.duration')}
                soon={soon}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Ensayo fotográfico */}
      <section
        id="fotografias"
        className="w-full px-4 py-12 mx-auto scroll-mt-16 max-w-screen-2xl md:px-8 md:py-16"
      >
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
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] uppercase md:ml-auto font-doc-display hover:text-doc-sky"
          >
            <span className="border-b border-current">{t('photos.cta')}</span>
            <HiArrowLongRight className="w-6 h-6" />
          </button>
        </FadeIn>
        <FadeIn className="grid grid-cols-2 gap-3 md:grid-cols-[1.3fr_1fr_1fr_0.65fr] md:grid-rows-2 md:h-[540px]">
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="relative col-span-2 overflow-hidden border rounded md:col-span-1 md:row-span-2 aspect-[4/3] md:aspect-auto border-white/30"
          >
            <Image
              src={slides[0].src}
              alt={slides[0].alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </button>
          {GALLERY.map((img, i) => (
            <button
              type="button"
              key={img.src}
              onClick={() => setLightboxIndex(i + 1)}
              className={`relative overflow-hidden border rounded aspect-square md:aspect-auto border-white/30 ${img.className}`}
            >
              <Image
                src={img.src}
                alt={galleryAlts[i]}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </button>
          ))}
        </FadeIn>
        <Lightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={slides}
        />
      </section>

      {/* La filial */}
      <section
        id="filial"
        className="grid scroll-mt-16 lg:grid-cols-[1fr_1.6fr] border-y border-white/20"
      >
        <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-[400px]">
          <Image
            src="/documental/diego-justo.jpg"
            alt={t('filial.image_alt')}
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover object-[35%_center]"
          />
        </div>
        <FadeIn className="grid gap-8 px-6 py-12 bg-doc-cream text-doc-navy md:px-12 lg:py-16 md:grid-cols-[1.6fr_1fr] md:items-center">
          <div>
            <Label className="font-bold">{t('filial.label')}</Label>
            <h2 className="mt-2 text-5xl italic font-extrabold uppercase font-doc-display md:text-6xl">
              {t('filial.name')}
            </h2>
            <Label className="mt-1">{t('filial.org')}</Label>
            <blockquote className="mt-6 text-lg italic font-doc-serif md:text-xl">
              “{t('filial.quote')}”
            </blockquote>
          </div>
          <div className="md:pl-8 md:border-l border-doc-navy/40">
            <p>{t('filial.body')}</p>
            <div className="mt-6">
              <PlayButton
                videoId={VIDEOS.filial}
                onPlay={setVideo}
                label={t('filial.cta')}
                duration={t('filial.duration')}
                soon={soon}
              />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Marcas */}
      <section
        id="sponsors"
        className="grid w-full gap-8 px-4 py-12 mx-auto scroll-mt-16 max-w-screen-2xl md:px-8 md:py-16 lg:grid-cols-[1fr_3.5fr] lg:items-center"
      >
        <FadeIn>
          <Label>{t('sponsors.label')}</Label>
          <h2 className="mt-1 text-4xl font-bold uppercase font-doc-display">
            {t('sponsors.title')}
          </h2>
          <p className="max-w-xs mt-4">{t('sponsors.body')}</p>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-3">
          {sponsors.map((item, i) => (
            <FadeIn
              key={item.name}
              delay={i * 0.1}
              className="relative flex flex-col justify-between p-5 overflow-hidden border rounded aspect-[16/9] sm:aspect-[4/3] border-white/30 bg-gradient-to-br from-white/10 to-transparent"
            >
              <p className="text-4xl italic font-extrabold leading-none uppercase font-doc-display">
                {item.name}
              </p>
              <div className="flex items-center gap-3">
                <PlayButton
                  videoId={VIDEOS.sponsors[i]}
                  onPlay={setVideo}
                  label={item.name}
                  duration={item.duration}
                  soon={soon}
                />
                <span className="text-sm text-doc-cream/70">{item.by}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <footer id="creditos" className="border-t scroll-mt-16 border-white/20">
        <div className="flex flex-col items-center gap-6 px-4 py-8 mx-auto text-xs tracking-widest text-center uppercase md:flex-row max-w-screen-2xl md:px-8 font-doc-display">
          <Image
            src={config.logo.src}
            alt={config.name}
            width={56}
            height={27}
          />
          <span className="hidden h-8 border-l md:block border-white/30" />
          <p className="md:mx-auto">
            {t('footer.title')}
            <span className="mx-3 text-white/40">|</span>
            {t('footer.by')}
            <span className="mx-3 text-white/40">|</span>
            {t('footer.place')} · {t('footer.year')}
          </p>
          <a
            href={config.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-doc-sky"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </footer>

      <VideoDialog
        videoId={video}
        onClose={() => setVideo(null)}
        closeLabel={t('video.close')}
      />
    </Layout>
  );
};

export default Documentary;
