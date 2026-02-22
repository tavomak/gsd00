# Quick Reference

## Commands

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Routes

```
/                    # Home page
/contact             # Contact page
/api/register        # Contact form submission
/api/pages-sitemap   # Pages sitemap
/api/projects-sitemap # Projects sitemap
```

## Key Patterns

- **Data Fetching**: `getStaticProps` + ISR (`revalidate: 100`)
- **i18n**: `useTranslation('common')` + `t('key')`
- **Images**: `next/image` + `priority` for LCP
- **Font**: `next/font/google` (Poppins)

## File Paths

- Pages: `pages/*.js`
- Components: `components/{Atoms,Molecules,Templates}/*`
- Utils: `utils/lib/api.js` (GraphCMS)
- Translations: `locales/{en,es}/common.json`

## Component Structure

```
components/
├── Atoms/        # Button, Input, Spinner, Image, etc.
├── Molecules/    # Card, ContactForm, Navbar, Footer
└── Templates/    # Layout, about, team, projects
```
