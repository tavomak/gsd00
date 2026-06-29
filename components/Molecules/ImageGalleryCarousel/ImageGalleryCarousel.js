import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'motion/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/Atoms/Button';

// Positions defined as CSS values — no scale transforms, so no image distortion.
const POSITIONS = {
  offLeft: { left: '-15%', top: '13%', width: '15%', height: '74%' },
  prev: { left: '0%', top: '13%', width: '15%', height: '74%' },
  active: { left: '15%', top: '10%', width: '70%', height: '80%' },
  next: { left: '85%', top: '13%', width: '15%', height: '74%' },
  offRight: { left: '100%', top: '13%', width: '15%', height: '74%' },
};

// New items enter from off-screen in the navigation direction.
// Exiting items leave in the same direction (everything pushes together).
const slideVariants = {
  initial: (dir) => ({
    ...POSITIONS[dir > 0 ? 'offRight' : 'offLeft'],
    opacity: 0,
  }),
  exit: (dir) => ({
    ...POSITIONS[dir > 0 ? 'offLeft' : 'offRight'],
    opacity: 0,
  }),
};

const getAnimate = (role) => ({ ...POSITIONS[role], opacity: 1 });

const transition = { duration: 0.55, ease: [0.4, 0, 0.2, 1] };

const ImageGalleryCarousel = ({
  items,
  autoplay = false,
  autoplayInterval = 5000,
  showArrows = true,
  showDots = true,
  loop = true,
  onSlideChange,
  onImageClick,
  ariaLabel = 'Gallery',
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const touchStart = useRef(null);
  const directionRef = useRef(1);

  useEffect(() => {
    setHovered(false);
  }, [current]);

  const goTo = useCallback(
    (index) => {
      setCurrent(index);
      onSlideChange?.(index);
    },
    [onSlideChange]
  );

  const next = useCallback(() => {
    if (!loop && current === items.length - 1) return;
    directionRef.current = 1;
    goTo((current + 1) % items.length);
  }, [current, items.length, loop, goTo]);

  const prev = useCallback(() => {
    if (!loop && current === 0) return;
    directionRef.current = -1;
    goTo((current - 1 + items.length) % items.length);
  }, [current, items.length, loop, goTo]);

  useEffect(() => {
    if (!autoplay || paused || items.length <= 1) return undefined;
    const id = setInterval(next, autoplayInterval);
    return () => clearInterval(id);
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

  const visibleSlides = [
    hasPrev && { id: items[prevIndex].id, index: prevIndex, role: 'prev' },
    { id: items[current].id, index: current, role: 'active' },
    hasNext && { id: items[nextIndex].id, index: nextIndex, role: 'next' },
  ].filter(Boolean);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative overflow-hidden aspect-video"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence custom={directionRef.current}>
          {visibleSlides.map(({ id, index, role }) => {
            const item = items[index];
            const isActive = role === 'active';
            return (
              <motion.div
                key={id}
                custom={directionRef.current}
                variants={slideVariants}
                initial="initial"
                animate={getAnimate(role)}
                exit="exit"
                transition={transition}
                className={`absolute overflow-hidden aspect-video ${
                  isActive
                    ? `z-10 border border-neutral-800${item.href || onImageClick ? ' cursor-pointer' : ''}`
                    : 'z-0 cursor-pointer'
                }`}
                onClick={() => {
                  if (role === 'prev') {
                    prev();
                    return;
                  }
                  if (role === 'next') {
                    next();
                    return;
                  }
                  if (onImageClick) {
                    onImageClick(index);
                    return;
                  }
                  if (item.href) router.push(item.href);
                }}
              >
                <Image
                  src={item.src}
                  alt={isActive ? item.alt : ''}
                  fill
                  className={`object-cover${role === 'prev' ? ' object-right' : ''} ${role === 'next' ? 'object-left' : ''}`}
                  sizes={isActive ? '(max-width: 1280px) 70vw, 896px' : '15vw'}
                  priority={index === 0}
                  aria-hidden={!isActive}
                />
                {!isActive && <div className="absolute inset-0 bg-black/60" />}
                {isActive && (item.title || item.href) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.55 }}
                    className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {hovered && item.href ? (
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
                              router.push(item.href);
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
                          className="text-base text-white uppercase"
                        >
                          {item.title}
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Arrows */}
        {showArrows && items.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={atStart}
              aria-label="Previous slide"
              className="absolute left-0 z-20 flex items-center justify-center w-[15%] text-white transition-colors duration-200 top-[13%] bottom-[13%] hover:bg-gradient-to-r hover:from-black/50 hover:to-transparent disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={atEnd}
              aria-label="Next slide"
              className="absolute right-0 z-20 flex items-center justify-center w-[15%] text-white transition-colors duration-200 top-[13%] bottom-[13%] hover:bg-gradient-to-l hover:from-black/50 hover:to-transparent disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronRight size={14} />
            </button>
          </>
        )}
      </div>

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
  onImageClick: PropTypes.func,
  ariaLabel: PropTypes.string,
};

export default ImageGalleryCarousel;
