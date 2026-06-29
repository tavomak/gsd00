import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import LanguageSwitcher from '@/components/Atoms/LanguageSwitcher';
import SiteLogo from '@/components/Atoms/SiteLogo';
import { AnimatePresence, motion } from 'motion/react';

const DesktopNavigation = ({
  navItems,
  showSubMenu,
  setShowSubMenu,
  handleClick,
}) => {
  const { t } = useTranslation('common');
  return (
    <nav
      className="container relative flex items-center justify-between max-w-screen-xl mx-auto text-black md:px-4"
      aria-label="Global"
    >
      <div className="flex w-1/3">
        <Link href="/">
          <SiteLogo variant="desktop" />
        </Link>
      </div>
      <ul className="flex justify-around gap-5">
        {navItems
          .filter((item) => item.visible)
          .map((item) => (
            <li
              key={item.label}
              onMouseEnter={() => setShowSubMenu(item.label)}
              onMouseLeave={() => setShowSubMenu(null)}
            >
              <Link
                href={item.path}
                className="links text-sm font-bold uppercase"
                {...(item.external && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
              >
                {t(item.label)}
              </Link>
              {item.children?.length > 1 && (
                <AnimatePresence>
                  {item.label === showSubMenu && (
                    <motion.div
                      initial={{ opacity: 1, transform: 'translateY(-5px)' }}
                      animate={{ opacity: 1, transform: 'translateY(15px)' }}
                      exit={{ opacity: 0, transform: 'translateY(-5px)' }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="absolute p-5 bg-transparent rounded-lg backdrop-blur-sm top-8 "
                    >
                      <ul className="flex flex-col gap-4">
                        {item.children.map((subItem) => (
                          <li key={subItem.path}>
                            <a
                              href={subItem.path}
                              onClick={(e) => handleClick(e, subItem.path)}
                              className="py-2 text-white hover:text-primary-color"
                            >
                              {t(subItem.label)}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          ))}
        <li>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
};

export default DesktopNavigation;
