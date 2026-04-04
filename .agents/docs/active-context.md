# Active Context

**Updated**: 2026-04-04

## Status
**In Progress**: None
**Completed**: WordPress integration for projects • Hygraph queries extracted to `utils/queries/` • Gallery page • ProjectCard component • Marquee component • GalleryScrollIndicator • terms-conditions template • About page
**Blockers**: None

## Notes
All images use `next/image` • Pages Router only
**Dual data sources**: Hygraph = page SEO/metadata only; WordPress = all project content
**Projects**: fetched from WordPress (`proyectos` CPT), NOT Hygraph
**Queries**: never inline — always import from `@/utils/queries/hygraph` or `@/utils/queries/wordpress`
**Rate limiting**: `await rateLimit()` required in getStaticProps/getStaticPaths for WordPress routes
**About page**: uses `biography.raw` (RichContent) + `seoMetadata.seoImage` (next/image) in a two-column layout; no Marquee
