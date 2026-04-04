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
/gallery             # Full gallery page
/about               # About page
/contact             # Contact page
/projects            # Projects listing (WordPress data)
/projects/[slug]     # Project detail (WordPress data)
/api/register        # Contact form submission
/api/pages-sitemap   # Pages sitemap
/api/projects-sitemap # Projects sitemap
```

## Key Patterns

- **Data Fetching**: `getStaticProps` + ISR (`revalidate: 100`)
- **i18n**: `useTranslation('common')` + `t('key')`
- **Images**: `next/image` + `priority` for LCP
- **Font**: `next/font/google` (Poppins)
- **Rate limiting**: `await rateLimit()` at top of `getStaticProps`/`getStaticPaths` for WP routes
- **Queries**: import from `@/utils/queries/hygraph` or `@/utils/queries/wordpress`

## File Paths

- Pages: `pages/*.js`
- Components: `components/{Atoms,Molecules,Templates}/*`
- Utils: `utils/lib/api.js` (API clients)
- Queries: `utils/queries/hygraph/*.js` • `utils/queries/wordpress/*.js`
- Translations: `locales/{en,es}/common.json`

## Component Structure

```
components/
├── Atoms/        # Button, Input, Spinner, Image, etc.
├── Molecules/    # Card, ContactForm, Navbar, Footer
└── Templates/    # Layout, about, team, projects
```
