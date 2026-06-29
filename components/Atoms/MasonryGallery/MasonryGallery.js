import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';

const getColumnCount = () => {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
};

const MasonryGallery = ({ images, onImageClick }) => {
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const update = () => setColumnCount(getColumnCount());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const colKeys = ['left', 'center', 'right'];
  const cols = colKeys.slice(0, columnCount).map((key) => ({ key, items: [] }));
  (images || []).forEach((img, i) =>
    cols[i % columnCount].items.push({ img, originalIndex: i })
  );

  return (
    <div className="flex gap-4">
      {cols.map(({ key, items }) => (
        <div key={key} className="flex flex-col flex-1 gap-4">
          {items.map(({ img, originalIndex }) => (
            <motion.button
              key={img.id}
              type="button"
              onClick={() => onImageClick(originalIndex)}
              className="block w-full overflow-hidden transition-transform duration-300 border rounded-xl border-neutral-800 hover:scale-105"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
              />
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
};

MasonryGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default MasonryGallery;
