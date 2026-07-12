# jpshlk.com

Josh Pasholk's personal site: Astro 7, Tailwind CSS v4 (CSS-first config), TypeScript, no UI framework. See README.md for the stack and deploy details.

## Writing style (applies to ALL generated text)

- **Never use em dashes (—) or en dashes (–).** Not in blog posts, page copy, summaries, README, comments, or commit messages. Use a comma, period, colon, semicolon, parentheses, or a plain hyphen instead. The only allowed em dash is the quote-attribution dash in the RandomQuote display output, written by the quote script in `src/layouts/BaseLayout.astro`.
- Blog posts are casual and first-person, in Josh's voice: short paragraphs, plain words, occasional emoji (🤙 😜). Explain jargon in one sentence the first time it appears.
- Post titles must be 52 characters or fewer (the layout appends " | jpshlk.com" and the SEO validator caps titles at 65). Summaries must be 40 to 200 characters.
- Post bodies use `##` and below (the title is the page's only H1) and internal links always have trailing slashes (`/blog/my-post/`).

Check for violations before committing content: `grep -rn '—' src/content/blog/*.mdx` (posts `ice-macOS-menu-bar-manager`, `new-scam-bank-notification`, `settapp-apps-for-power-users`, and `web-development-am-i-an-imposter` contain pre-existing em dashes in Josh's original writing, and `teaching-my-ai-to-write-like-me` quotes em dashes as examples, and `turning-my-homepage-into-a-landing-page` quotes the RandomQuote attribution dash in a code snippet; leave those alone).

## Workflow

- Development happens on feature branches. `main` is the live site; never push or merge to it without explicit permission.
- Run `npm run check` and `npm run build` before committing. Draft posts (`draft: true`) only render in `npm run dev`.
- Ready-to-execute plans for the remaining roadmap features live in `docs/plans/` (RoutineHub shortcuts, comments, generated share images). Start there before re-deriving a design.
- `src/pages/how-this-site-works.astro` is living documentation; update it alongside structural changes.

## Gotchas (hard-won, do not relearn)

- Pagefind's Component UI keeps a registry on `window` that never drops removed elements; the prune-on-`astro:page-load` script in `BaseLayout.astro` is what keeps the search modal working across view transitions. Do not remove it.
- Third-party CSS is unlayered and beats anything inside a Tailwind `@layer`; the Pagefind and heading-anchor styles in `global.css` are unlayered on purpose.
- `rehypeHeadingIds` must run before `rehype-autolink-headings` in `astro.config.ts` (Astro otherwise adds heading ids after user plugins).
- Astro collapses whitespace at template line boundaries; keep inline links on the same line as surrounding text or use `{' '}`.
- On this view-transitions site, any page-touching JavaScript must run on `astro:page-load`, not once at startup.
- Verify UI changes with a real browser against `npm run preview` (playwright-core; in the CCR sandbox use `executablePath: '/opt/pw-browsers/chromium'`). The build passing is not the same as the feature working.
