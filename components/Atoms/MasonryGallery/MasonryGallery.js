import Image from 'next/image';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';

const MasonryGallery = ({ images, onImageClick }) => (
  <div className="gap-4 columns-1 md:columns-2 lg:columns-3">
    {images &&
      images.map((image, index) => (
        <motion.button
          key={image.id}
          type="button"
          onClick={() => onImageClick(index)}
          className="block w-full mb-4 overflow-hidden transition-transform duration-300 border border-neutral-800 break-inside-avoid hover:scale-105"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.3,
            delay: 0.1,
            ease: 'easeOut',
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={800}
            height={600}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.button>
      ))}
  </div>
);

MasonryGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      position: PropTypes.string,
    })
  ).isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default MasonryGallery;
