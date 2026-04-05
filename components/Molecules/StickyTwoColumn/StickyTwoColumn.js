import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'motion/react';
import Button from '@/components/Atoms/Button';

const ScrollItem = ({ item, index, onInView }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-40% 0px -40% 0px' });
  const [hovered, setHovered] = useState(false);

  const prevInView = useRef(false);
  if (isInView && !prevInView.current) {
    onInView(index);
  }
  prevInView.current = isInView;

  return (
    <div ref={ref} className="mb-6 last:mb-0">
      <a
        href={item.href || '#'}
        className="block overflow-hidden border group border-neutral-800 rounded-xl"
        target="_blank"
      >
        <div
          className="relative w-full aspect-video"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Image
            src={item.src}
            alt={item.alt || item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <AnimatePresence mode="wait" initial={false}>
              {hovered && item.href ? (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button className="btn btn-primary w-fit">
                    View project
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="title"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xs font-bold tracking-widest uppercase text-primary-color">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    {item.title}
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </a>
    </div>
  );
};

const StickyTwoColumn = ({ items = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleInView = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  return (
    <div className="flex gap-6 lg:gap-10">
      {/* Left: sticky panel */}
      <div className="sticky self-start hidden aspect-video md:flex md:w-1/2 top-24">
        <div className="flex flex-col w-full h-full gap-6 py-4">
          {/* Counter */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.span
                key={`counter-${activeIndex}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="text-4xl font-bold text-primary-color tabular-nums"
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-neutral-500">
              / {String(items.length).padStart(2, '0')}
            </span>
          </div>

          {/* Image */}
          <div className="relative flex-1 w-full min-h-0">
            <Image
              src="/isotipoweb-83s.svg"
              alt="83s Web"
              width={199}
              height={139}
              className="object-contain"
            />
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.id || item.title}
                type="button"
                aria-label={`Go to item ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-8 bg-primary-color'
                    : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right: scrollable items */}
      <div className="w-full md:w-1/2">
        {items.map((item, index) => (
          <ScrollItem
            key={item.id || item.title}
            item={item}
            index={index}
            onInView={handleInView}
          />
        ))}
      </div>
    </div>
  );
};

export default StickyTwoColumn;
