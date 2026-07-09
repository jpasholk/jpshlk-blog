# jpshlk.com

Personal site and blog of Josh Pasholk — a custom-built [Astro](https://astro.build) site.

## Stack

- **Astro 7** (static output) with the content layer (`src/content.config.ts`) and `<ClientRouter />` view transitions
- **Tailwind CSS v4** (CSS-first config in `src/styles/global.css`), self-hosted Space Grotesk
- **TypeScript + vanilla JS** — no UI framework
- **SEO**: [`@jdevalk/astro-seo-graph`](https://github.com/jdevalk/seo-graph) — `<Seo>` head component, schema.org JSON-LD graph, llms.txt, markdown alternates (`/blog/<slug>.md`), schema endpoints (`/schema/*.json`, `/schemamap.xml`, `/.well-known/api-catalog`), IndexNow, fuzzy 404 redirects

## Structure

- `src/pages/` — landing page, `/blog` (paginated), `/blog/<slug>`, `/tags`, `/projects`, agent endpoints
- `src/content/` — blog posts (MDX), tags, projects
- `src/components/` — design-system components; `/styleguide` previews them
- `src/config.ts` — site metadata, author, socials, navigation

## Commands

| Command           | Action                       |
| ----------------- | ---------------------------- |
| `npm run dev`     | Dev server                   |
| `npm run build`   | Build to `./dist/`           |
| `npm run preview` | Preview the production build |
| `npm run check`   | Type-check                   |

## Deploying

Fully static output — currently deployed on **Netlify** (`netlify.toml`; Node 22 required). Redirects live in `public/_redirects`, which Netlify and Cloudflare both understand. A `wrangler.jsonc` is included for a possible future move to Cloudflare Workers/Pages.

IndexNow (two-step, in this order):

1. Set `INDEXNOW_KEY` in the build environment and deploy — this ships the key file at `/<key>.txt`. Confirm it resolves over HTTPS.
2. Set `INDEXNOW_SUBMIT=true` and redeploy — submission stays gated to the production branch.

Submitting before the key file is live gets the key rejected permanently (HTTP 403) — that's why the flag exists.

## Credits

- [Quotes in JSON](https://gist.github.com/nasrulhazim/54b659e43b1035215cd0ba1d4577ee80)
