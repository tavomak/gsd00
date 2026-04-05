import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'motion/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/Atoms/Button';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '75%' : '-75%',
    rotateY: direction > 0 ? -10 : 10,
    scale: 0.9,
    opacity: 0,
  }),
  center: {
    x: 0,
    rotateY: 0,
    scale: 1,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? '-75%' : '75%',
    rotateY: direction > 0 ? 10 : -10,
    scale: 0.9,
    opacity: 0,
  }),
};

const transition = { duration: 0.55, ease: [0.4, 0, 0.2, 1] };

const ImageGalleryCarousel = ({
  items,
  autoplay,
  autoplayInterval,
  showArrows,
  showDots,
  loop,
  onSlideChange,
  ariaLabel,
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const touchStart = useRef(null);

  useEffect(() => {
    setHovered(false);
  }, [current]);

  const goTo = useCallback(
    (index, dir) => {
      const resolvedDir = dir ?? (index > current ? 1 : -1);
      setDirection(resolvedDir);
      setCurrent(index);
      onSlideChange?.(index);
    },
    [current, onSlideChange]
  );

  const next = useCallback(() => {
    if (!loop && current === items.length - 1) return;
    goTo((current + 1) % items.length, 1);
  }, [current, items.length, loop, goTo]);

  const prev = useCallback(() => {
    if (!loop && current === 0) return;
    goTo((current - 1 + items.length) % items.length, -1);
  }, [current, items.length, loop, goTo]);

  useEffect(() => {
    if (!autoplay || paused || items.length <= 1) return undefined;
    const id = setInterval(next, autoplayInterval);
    return () => {
      clearInterval(id);
    };
  }, [autoplay, paused, autoplayInterval, next, items.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  if (!items || items.length === 0) return null;

  const hasPrev = loop ? items.length > 1 : current > 0;
  const hasNext = loop ? items.length > 1 : current < items.length - 1;
  const prevIndex = (current - 1 + items.length) % items.length;
  const nextIndex = (current + 1) % items.length;
  const atStart = !loop && current === 0;
  const atEnd = !loop && current === items.length - 1;

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Slide container — overflow-hidden clips the animation, dots are outside */}
      <div
        className="relative overflow-hidden aspect-video"
        style={{ perspective: '1200px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Prev peek — vertically inset to appear smaller than main slide */}
        {hasPrev && (
          <div className="absolute left-0 z-0 w-10 overflow-hidden top-8 bottom-8">
            <Image
              src={items[prevIndex].src}
              alt=""
              fill
              aria-hidden="true"
              className="object-cover object-right"
              sizes="40px"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}

        {/* Next peek — vertically inset to appear smaller than main slide */}
        {hasNext && (
          <div className="absolute right-0 z-0 w-10 overflow-hidden top-8 bottom-8">
            <Image
              src={items[nextIndex].src}
              alt=""
              fill
              aria-hidden="true"
              className="object-cover object-left"
              sizes="40px"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}

        {/* Current slide */}
        <AnimatePresence mode="sync" custom={direction} initial={false}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            style={{ transformPerspective: 1200 }}
            className={`absolute inset-y-0 z-10 overflow-hidden border border-neutral-800 ${items[current].href ? 'cursor-pointer' : ''} ${hasPrev ? 'left-10' : 'left-0'} ${hasNext ? 'right-10' : 'right-0'}`}
            onClick={() =>
              items[current].href && router.push(items[current].href)
            }
          >
            <Image
              src={items[current].src}
              alt={items[current].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority={current === 0}
            />

            {/* Overlay — always visible; title swaps for button on hover */}
            {(items[current].title || items[current].href) && (
              <div
                className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {hovered && items[current].href ? (
                    <motion.div
                      key="cta"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        className="btn btn-primary w-fit"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(items[current].href);
                        }}
                      >
                        {t('view_project')}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.h3
                      key="title"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="text-xl font-bold text-white"
                    >
                      {items[current].title}
                    </motion.h3>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {showArrows && items.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={atStart}
              aria-label="Previous slide"
              className="absolute left-0 z-20 flex items-center justify-center w-10 text-white transition-colors duration-200 top-8 bottom-8 hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={atEnd}
              aria-label="Next slide"
              className="absolute right-0 z-20 flex items-center justify-center w-10 text-white transition-colors duration-200 top-8 bottom-8 hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronRight size={14} />
            </button>
          </>
        )}
      </div>

      {/* Dots — outside the bordered container */}
      {showDots && items.length > 1 && (
        <div
          className="flex justify-center gap-2 mt-3"
          role="tablist"
          aria-label="Slides"
        >
          {items.map((item, i) => (
            <button
              type="button"
              role="tab"
              key={item.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}${item.title ? `: ${item.title}` : ''}`}
              aria-selected={i === current}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-primary-color'
                  : 'w-2 bg-neutral-600 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

ImageGalleryCarousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      title: PropTypes.string,
      href: PropTypes.string,
    })
  ).isRequired,
  autoplay: PropTypes.bool,
  autoplayInterval: PropTypes.number,
  showArrows: PropTypes.bool,
  showDots: PropTypes.bool,
  loop: PropTypes.bool,
  onSlideChange: PropTypes.func,
  ariaLabel: PropTypes.string,
};

ImageGalleryCarousel.defaultProps = {
  autoplay: false,
  autoplayInterval: 5000,
  showArrows: true,
  showDots: true,
  loop: true,
  onSlideChange: undefined,
  ariaLabel: 'Gallery',
};

export default ImageGalleryCarousel;
