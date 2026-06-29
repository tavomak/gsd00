# gsd-site — AI instructions

Next.js 15 Pages Router • Hygraph (GraphCMS) + WordPress • Tailwind • i18n (en/es) • pnpm

## Session protocol

**Auto-loading tools** (Claude Code, Cursor, Windsurf, Zed): this file loads automatically — no action needed.
**Manual tools** (OpenCode, Codex, others): paste this at the start of every session:

> Read AGENTS.md and .agents/docs/active-context.md before we begin.

Read `.agents/docs/active-context.md` at session start. Update it when starting or completing significant work.

## NEVER DO

- App Router (`app/`, RSC, `use client`) — this project is Pages Router only
- TypeScript — plain JS with PropTypes
- Custom CSS, `<style>`, or inline styles — Tailwind classes only
- `<img>` — always `next/image`
- npm or yarn — pnpm only
- Inline GraphQL queries in pages — import from `utils/queries/hygraph/` or `utils/queries/wordpress/`
- Fetch projects from Hygraph — projects come from WordPress (`proyectos` CPT)
- Commit `.env.local` or secrets

## ALWAYS DO

- `getStaticProps` + ISR (`revalidate: 100`) + catch block returning empty props
- `await rateLimit()` at the start of `getStaticProps`/`getStaticPaths` on WordPress routes
- PropTypes on all components
- `next/image` with `priority` for the LCP image
- `useTranslation('common')` + `t('key')` for all user-facing text
- `@/` import alias (not relative paths)
- Atomic Design: `components/{Atoms,Molecules,Templates}`
- New page routes under `pages/[site]/...` — `getStaticPaths` enumerates `Object.keys(sites)` × locales, `getStaticProps` reads `params.site` and passes `siteKey` through `pageProps`
- Site-aware components consume `const { config } = useSite()` from `@/contexts/SiteContext` — never hardcode brand names, domains, or asset paths
- Per-site assets live under `public/favicons/{siteKey}/`
- Check `.agents/specs/` for a matching spec before building; create one from the template if missing
- Verify a component doesn't already exist before creating it

## ASK FIRST

- Adding new dependencies
- Upgrading Next.js or React
- Changing routing or data-source strategy (Hygraph vs WordPress split)
- Modifying CI/CD or semantic-release config
- Adding new environment variables

## Data sources

| Source    | Provides                              |
| --------- | ------------------------------------- |
| Hygraph   | Page SEO/metadata only                |
| WordPress | All project content (`proyectos` CPT) |

## Commands

| Command      | Purpose                |
| ------------ | ---------------------- |
| `pnpm dev`   | Start dev server       |
| `pnpm build` | Production build       |
| `pnpm lint`  | Run ESLint             |
| `pnpm start` | Serve production build |

## MCPs

| Server    | Purpose                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------- |
| `hygraph` | CMS schema, entries, GraphQL execution (config: `.mcp.json`, token via `HYGRAPH_MCP_TOKEN` env var) |

## Skills & agents

Installed in `.agents/skills/` (pinned in `skills-lock.json`): next-best-practices, react-doctor, tailwind-css-patterns, accessibility, seo, frontend-design, and more.

## Reference files

Consult based on task context — don't load all at once:

| File                              | When to read                                       |
| --------------------------------- | -------------------------------------------------- |
| `.agents/docs/active-context.md`  | Current work state — read every session            |
| `.agents/docs/quick-reference.md` | Commands, routes, file paths, key patterns         |
| `.agents/docs/api-patterns.md`    | GraphCMS/WordPress query patterns                  |
| `.agents/docs/components.md`      | Atomic Design structure                            |
| `.agents/docs/environment.md`     | Env var names and usage                            |
| `.agents/docs/tech-stack.md`      | Dependencies                                       |
| `.agents/docs/troubleshooting/`   | When stuck — check before guessing                 |
| `.agents/specs/`                  | Feature/component specs — read before implementing |
| `.agents/MAINTENANCE.md`          | How and when to update these docs                  |
