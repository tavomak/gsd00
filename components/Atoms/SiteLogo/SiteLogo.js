import Image from 'next/image';
import PropTypes from 'prop-types';
import { useSite } from '@/contexts/SiteContext';

const VARIANT_CLASSES = {
  desktop: 'object-contain object-left w-auto h-9',
  mobile: 'object-contain w-auto h-9',
};

const SiteLogo = ({ variant = 'desktop' }) => {
  const { config } = useSite();
  if (!config?.logo) return null;
  return (
    <Image
      src={config.logo.src}
      alt={`${config.name} logo`}
      width={config.logo.width}
      height={config.logo.height}
      className={VARIANT_CLASSES[variant]}
      priority
    />
  );
};

SiteLogo.propTypes = {
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

export default SiteLogo;
