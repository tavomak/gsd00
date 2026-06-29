import Link from 'next/link';
import Hamburger from '@/components/Atoms/Hamburger';
import useTranslation from 'next-translate/useTranslation';
import LanguageSwitcher from '@/components/Atoms/LanguageSwitcher';
import SiteLogo from '@/components/Atoms/SiteLogo';

const MobileNavigation = ({
  menuOpen = false,
  setMenuOpen,
  navItems,
  handleClick,
}) => {
  const { t } = useTranslation('common');
  return (
    <nav
      className="container relative flex items-center justify-between mx-auto md:px-4"
      aria-label="Global"
    >
      <Link href="/">
        <SiteLogo variant="mobile" />
      </Link>
      <Hamburger open={menuOpen} setOpen={setMenuOpen} />
      <ul
        className={`ps-8 flex flex-col gap-1 justify-center fixed w-screen h-screen left-0 top-0 transition-all bg-black bg-opacity-95 ${menuOpen ? 'top-0' : 'top-[-120%]'}`}
      >
        {navItems
          .filter((item) => item.visible)
          .map((item) => (
            <li className="text-xl font-bold" key={item.label}>
              {!item.children && (
                <Link
                  href={item.path}
                  {...(item.external && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                >
                  {t(item.label)}
                </Link>
              )}
              {item.children &&
                item.children.map((subItem) => (
                  <a
                    key={subItem.path}
                    href={subItem.path}
                    onClick={(e) => {
                      setMenuOpen(false);
                      handleClick(e, subItem.path);
                    }}
                  >
                    <p className="mb-1">{t(subItem.label)}</p>
                  </a>
                ))}
            </li>
          ))}
        <li>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavigation;
