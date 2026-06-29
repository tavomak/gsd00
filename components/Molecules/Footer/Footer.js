import Link from 'next/link';
import PropTypes from 'prop-types';
import Button from '@/components/Atoms/Button/Button';
import useTranslation from 'next-translate/useTranslation';
import { FaInstagram } from 'react-icons/fa6';
import { useSite } from '@/contexts/SiteContext';
import BrandIcon from '@/components/Atoms/BrandIcon/BrandIcon';

const Footer = ({ noPreFooter, noContact }) => {
  const { t } = useTranslation('common');
  const { config } = useSite();
  return (
    <footer className="text-white uppercase">
      <section className="px-4 py-16 mx-auto md:container sm:px-6 lg:px-8">
        <div
          className={`${noPreFooter ? 'hidden' : 'flex'}  flex-col items-center gap-4 mb-16 `}
        >
          <h2 className="text-[4vw] md:text-[40px] lg:text-[40px]">
            <span>Free Style </span>
            <span className="text-primary-color">Branded Content</span>
          </h2>
          <p className="text-[10px] md:text-[20px] lg:text-[30px]">
            Let&apos;s | Work
          </p>
        </div>
        <div
          className={`${noContact ? 'hidden' : 'flex'} flex-col items-center gap-12 text-white`}
        >
          <Link href="/contact">
            <Button className="btn btn-primary group">
              {t('nav_contact_title')}
            </Button>
          </Link>

          <BrandIcon />
        </div>
        <div className="pt-4">
          <div className="text-center">
            <ul className="flex justify-center gap-4 py-4 text-2xl">
              <li>
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${config.name} Instagram`}
                  className="transition hover:opacity-75"
                >
                  <FaInstagram />
                </a>
              </li>
            </ul>
            <p className="text-base text-white">
              &copy; {new Date().getFullYear()} {config.copyrightName}.{' '}
              {t('footer_copyright')}
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
};

Footer.propTypes = {
  noPreFooter: PropTypes.bool,
  noContact: PropTypes.bool,
};

export default Footer;
