# AI Instructions

**Check first**: active-context.md → quick-reference.md → this file

## Never
- App Router (`app/`, RSC, `use client`)
- TypeScript
- Custom CSS/`<style>`/inline styles
- `<img>` (use `next/image`)
- npm/yarn (use pnpm)
- Direct GraphCMS queries (use `@/utils/lib/api.js`)

## Always

**Pages Router**: `getStaticProps` + ISR (revalidate: 100) + error handling (notFound: true)
**PropTypes**: Add to all components
**Tailwind**: Only Tailwind classes (no CSS/inline styles)
**Images**: `next/image` with `priority` for LCP
**i18n**: `useTranslation('common')` + `t('key')`
**Imports**: `@/` alias (not relative)
**Structure**: `components/{Atoms,Molecules,Templates}`

## Before Starting
1. Read `active-context.md`
2. Check `.agents/specs/` for any spec matching the feature/component you're building
3. Verify component doesn't exist in Atomic Design structure
4. Use pnpm (not npm/yarn)

## When Stuck
Check troubleshooting/ → tech-stack.md → api-patterns.md → ask user. Never guess.
