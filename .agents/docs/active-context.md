# Active Context

**Updated**: 2026-06-29

## Status
**In Progress**: Multi-domain (gsd00 + 83s) wired end-to-end; 83s favicon assets still pending drop-in
**Recently Completed**:
- Per-site metadata: `useSite()` in `components/Templates/Layout/Layout.js` reads `name`, `themeColor`, `msTileColor`, `icons`, `seo` from `config/sites.js`
- Per-site favicons under `public/favicons/{site}/`; gsd00 assets migrated, 83s scaffolded (`public/favicons/83s/README.md` lists required files)
- Dynamic per-host `pages/sitemap.xml.js` + `pages/robots.txt.js`; legacy `pages/api/{pages,projects}-sitemap.js` + `public/robots.txt` removed; `middleware.js` matcher excludes these
- SSR-safe canonical + `og:url` (built from `config.domain` + locale + `router.asPath`), absolute `og:image`, hreflang per locale + `x-default`, `og:image:width/height/alt`, `og:locale:alternate`, Twitter card fields, configurable `ogType` (`article` on project detail)
- JSON-LD `Organization` baseline on home templates via `utils/seo.js` (`buildOrganizationSchema`, `buildWebSiteSchema`) piped through Layout's `schema` prop
- Layout title dedupes when page title equals site name

**Blockers**: None

## Notes
- Projects currently fetched from Hygraph (`getProjects` + `GET_PROJECTS`) filtered by `siteConfig.category` — WordPress migration noted in spec is not yet active for project routes
- Page-level Hygraph entries shared per slug across sites (no `site` filter); fallback to site-config defaults for empty SEO fields
- `config.twitter` field present but unset for both sites — set when handles exist
- 83s `themeColor`/`msTileColor` defaulted to `#000000` — adjust to brand palette
- `og-default.jpg` (1200x630) must be dropped per site for OG image fallback
