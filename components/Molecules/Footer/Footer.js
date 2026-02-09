import Link from 'next/link';
import Button from '@/components/Atoms/Button/Button';
import useTranslation from 'next-translate/useTranslation';
import { FaInstagram } from 'react-icons/fa6';
import { siteName, socialMedia } from '@/utils/constants';
import BrandIcon from '@/components/Atoms/BrandIcon/BrandIcon';

const Footer = ({ noPreFooter }) => {
  const { t } = useTranslation('common');
  return (
    <footer className="text-white">
      <section className="px-4 py-16 mx-auto md:container sm:px-6 lg:px-8">
        <div
          className={`${noPreFooter ? 'hidden' : 'flex'}  flex-col items-center gap-4 mb-16 `}
        >
          <h2 className="text-[6vw] md:text-[40px] lg:text-[50px] font-bold">
            <span>Free Style </span>
            <span className="text-primary-color">Photography</span>
          </h2>
          <p className="text-[20px] md:text-[30px] lg:text-[40px] font-bold">
            Let&apos;s | Work
          </p>
        </div>
        <div className="flex flex-col items-center gap-12 text-white">
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
                  href={socialMedia.instagram}
                  target="_blank"
                  className="transition hover:opacity-75"
                >
                  <FaInstagram />
                </a>
              </li>
            </ul>
            <p className="text-base text-white">
              &copy; {new Date().getFullYear()} {siteName}.{' '}
              {t('footer_copyright')}
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
