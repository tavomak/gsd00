# Components

## Atomic Design
```
components/
├── Atoms/      Button, Input, Spinner, Hamburger, BrandIcon, LanguageSwitcher,
│               MasonryGallery, ScrollTriggered, RichContent, VideoIframe,
│               GalleryScrollIndicator
├── Molecules/  Card, ContactForm, BioDetail, Navbar, DesktopNavigation,
│               MobileNavigation, Footer, GoToTopButton, Marquee, ProjectCard
└── Templates/  Layout, Modal, terms-conditions, about
```

## Props
```
Layout:               children, title, description, schema(JSON-LD), className,
                      image, noPreFooter, noContact
Modal:                children, onClick, showModal, size(sm|md|lg|xl), bgColor, noPadding
Card:                 item{id,name,position,email,linkedin,officeTag,image}, handleClick
BioDetail:            item{name,position,image,linkedin,officeTag,biography}
RichContent:          content (GraphCMS rich text object)
VideoIframe:          videoId(Vimeo ID), controls, muted
Input:                name*, placeholder*, type, register, rules, errors, phone(bool)
Button:               children|text, loading, loadingType, submit(bool), onClick, disabled
MasonryGallery:       images[{id,src,alt}], onImageClick
Footer:               noPreFooter(bool)
Marquee:              children, speed(default:180), autoFill(default:true)
ProjectCard:          project{id,slug,title,featuredImage,proyectosBackground}, lang
GalleryScrollIndicator: totalItems, targetRef
```

## Imports
`Image` from `next/image` (add `priority` for LCP)
`Link` from `next/link`
`useTranslation` from `next-translate/useTranslation`
