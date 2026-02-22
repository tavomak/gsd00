import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';

const ITEMS_PER_DOT = 5;

const GalleryScrollIndicator = ({ totalItems, targetRef }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const dotCount = Math.ceil(totalItems / ITEMS_PER_DOT);
    const newIndex = Math.min(Math.floor(latest * dotCount), dotCount - 1);

    // Show indicator only when gallery is in viewport (progress > 0 and < 1)
    setIsVisible(latest > 0 && latest < 1);
    setCurrentIndex(newIndex);
  });

  const handleDotClick = (dotIndex) => {
    // Calculate the image index for this dot (first image of the group)
    const imageIndex = dotIndex * ITEMS_PER_DOT;

    // Find all buttons in the gallery container
    const galleryContainer = targetRef.current;
    if (!galleryContainer) return;

    const buttons = galleryContainer.querySelectorAll('button');
    const targetButton = buttons[imageIndex];

    if (targetButton) {
      targetButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const dotCount = Math.ceil(totalItems / ITEMS_PER_DOT);
  const dots = Array.from({ length: dotCount }, (_, i) => i);

  if (!isVisible) return null;

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
      {dots.map((index) => (
        <button
          type="button"
          key={`gallery-dot-${index}`}
          onClick={() => handleDotClick(index)}
          aria-label={`Go to images ${index * ITEMS_PER_DOT + 1}-${Math.min((index + 1) * ITEMS_PER_DOT, totalItems)}`}
          className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
            index === currentIndex
              ? 'bg-white scale-125'
              : 'bg-neutral-600 hover:bg-neutral-400'
          }`}
        />
      ))}
    </div>
  );
};

GalleryScrollIndicator.propTypes = {
  totalItems: (props, propName, componentName) => {
    if (typeof props[propName] !== 'number' || props[propName] < 1) {
      return new Error(
        `Invalid prop '${propName}' supplied to '${componentName}'. Expected a positive number.`
      );
    }
    return null;
  },
  targetRef: (props, propName, componentName) => {
    if (
      !props[propName] ||
      typeof props[propName] !== 'object' ||
      !('current' in props[propName])
    ) {
      return new Error(
        `Invalid prop '${propName}' supplied to '${componentName}'. Expected a React ref object.`
      );
    }
    return null;
  },
};

export default GalleryScrollIndicator;
