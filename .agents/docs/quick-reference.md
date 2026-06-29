# Quick Reference

## Commands

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Routes

All page routes live under `pages/[site]/...` and are served per-host by `middleware.js`.

```
/                       # Home (per site: HomeGsd00 or Home83s template)
/gallery                # Gallery (gsd00 only — not in 83s navKeys)
/about                  # About
/contact                # Contact
/projects               # Projects listing (filtered by site category)
/projects/[slug]        # Project detail (filtered by site category)
/api/register           # Contact form submission
/sitemap.xml            # Dynamic per-host (pages/sitemap.xml.js)
/robots.txt             # Dynamic per-host (pages/robots.txt.js)
```

## Local development hosts

- `http://gsd00.localhost:3000` — gsd00 site
- `http://83s.localhost:3000` — 83s site
- `http://localhost:3000` — falls back to `DEFAULT_SITE` (`gsd00`)

## Key Patterns

- **Site detection**: `siteFromHost(host)` in `config/sites.js`; middleware rewrites `/<path>` → `/<siteKey>/<path>` for migrated routes
- **Active site (client/SSR)**: `const { config } = useSite()` from `@/contexts/SiteContext`
- **Data Fetching**: `getStaticProps` + ISR (`revalidate: 100`); `getStaticPaths` enumerates `Object.keys(sites)` × locales
- **Filtering by site**: `project.categories?.includes(siteConfig.category)`
- **i18n**: `useTranslation('common')` + `t('key')`
- **Images**: `next/image` + `priority` for LCP
- **Font**: IBM Plex Mono (`utils/fonts.js`)
- **Rate limiting**: `await rateLimit()` in `getStaticProps` / `getStaticPaths` for Hygraph (WordPress documented but not active for project routes)
- **Queries**: import from `@/utils/queries/hygraph` (no inline GraphQL)
- **SEO schema**: `buildOrganizationSchema(config)` from `@/utils` → pass via Layout `schema` prop

## File Paths

- Pages: `pages/[site]/*` (per-site tree), `pages/_app.js`, `pages/_document.js`, `pages/sitemap.xml.js`, `pages/robots.txt.js`, `pages/api/*`
- Middleware: `middleware.js`
- Components: `components/{Atoms,Molecules,Templates}/*`
- Site config: `config/sites.js`
- Site context: `contexts/SiteContext.js`
- Utils: `utils/lib/api.js` (API clients), `utils/seo.js` (JSON-LD helpers), `utils/constants/index.js`, `utils/helpers.js`
- Queries: `utils/queries/hygraph/*.js`
- Translations: `locales/{en,es}/common.json`
- Favicons: `public/favicons/{siteKey}/*` (per-site)

## Component Structure

```
components/
├── Atoms/        # Button, Input, Spinner, FadeIn, SiteLogo, etc.
├── Molecules/    # ProjectCard, ContactForm, Navbar, Footer, etc.
└── Templates/    # Layout, HomeGsd00, Home83s, ProjectDetailGsd00, ProjectDetail83s
```
