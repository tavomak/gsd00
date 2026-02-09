import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';

const setTranslateOffset = (index) => {
  if (index === 1) return 20;
  if (index > 20) return 40;
  return index * 2;
};

const ScrollTriggered = ({ src, alt, width, height, position, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);
  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    [20, setTranslateOffset(index)]
  );

  return (
    <div ref={ref} className="sticky mb-10 top-20 xl:mb-20">
      <motion.div
        style={{
          scale,
          translateY,
          transition: 'ease-in-out',
        }}
        className="overflow-hidden border border-neutral-800 max-h-[50vh]"
      >
        <Image
          src={src}
          alt={alt}
          width={width || 1440}
          height={height || 810}
          priority
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: position || 'top',
            overflow: 'hidden',
            maxHeight: '50vh',
          }}
          className="shadow-xl"
        />
      </motion.div>
    </div>
  );
};

export default ScrollTriggered;
