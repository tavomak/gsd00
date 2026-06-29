# Components

## Atomic Design
```
components/
├── Atoms/      Button, Input, Spinner, Hamburger, BrandIcon, SiteLogo,
│               LanguageSwitcher, MasonryGallery, ScrollTriggered, RichContent,
│               VideoIframe, GalleryScrollIndicator, FadeIn
├── Molecules/  Card, ContactForm, BioDetail, Navbar, DesktopNavigation,
│               MobileNavigation, Footer, GoToTopButton, Marquee, ProjectCard,
│               ImageGalleryCarousel, StickyTwoColumn
└── Templates/  Layout, Modal, HomeGsd00, Home83s, ProjectDetailGsd00,
                ProjectDetail83s
```

## Props
```
Layout:               children, title, description, schema(JSON-LD), className,
                      image, imageWidth(default 1200), imageHeight(default 630),
                      imageAlt, ogType(default 'website'), noPreFooter, noContact
                      — reads site name/icons/themeColor/seo defaults from useSite()
Modal:                children, onClick, showModal, size(sm|md|lg|xl), bgColor, noPadding
Card:                 item{id,name,position,email,linkedin,officeTag,image}, handleClick
BioDetail:            item{name,position,image,linkedin,officeTag,biography}
RichContent:          content (GraphCMS rich text object)
VideoIframe:          videoId(Vimeo ID), controls, muted
Input:                name*, placeholder*, type, register, rules, errors, phone(bool)
Button:               children|text, loading, loadingType, submit(bool), onClick, disabled
MasonryGallery:       images[{id,src,alt}], onImageClick
Footer:               noPreFooter(bool), noContact(bool)
Marquee:              children, speed(default:180), autoFill(default:true)
ProjectCard:          project{id,slug,title,featuredImage,proyectosBackground}, lang
GalleryScrollIndicator: totalItems, targetRef
SiteLogo:             reads from useSite() — config.logo {src,width,height}
ImageGalleryCarousel: items[{id,src,alt,title,href}], autoplay, loop, showArrows, showDots, onImageClick
StickyTwoColumn:      items[{id,src,alt,title,description,href}]
```

## Imports
`Image` from `next/image` (add `priority` for LCP)
`Link` from `next/link`
`useRouter` from `next/router`
`useTranslation` from `next-translate/useTranslation`
`useSite` from `@/contexts/SiteContext` (for site-aware components)

## Site-aware components
- `Layout` — title/og:site_name/favicons/theme-color from site config
- `Navbar`, `DesktopNavigation`, `MobileNavigation` — nav items from `config.navKeys`
- `Footer` — copyright + instagram from site config
- `SiteLogo` — logo from `config.logo`
- Home/ProjectDetail templates — split per site (`HomeGsd00` vs `Home83s`)

## SEO helpers
`utils/seo.js` (re-exported from `@/utils`):
- `buildOrganizationSchema(config)` → JSON-LD Organization
- `buildWebSiteSchema(config)` → JSON-LD WebSite

Pass result to `Layout` via `schema` prop.
