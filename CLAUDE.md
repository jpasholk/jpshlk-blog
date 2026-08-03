# jpshlk.com

Josh Pasholk's personal site: Astro 7, Tailwind CSS v4 (CSS-first config), TypeScript, no UI framework. See README.md for the stack and deploy details.

## Writing style (applies to ALL generated text)

- **Never use em dashes (—) or en dashes (–).** Not in blog posts, page copy, summaries, README, comments, or commit messages. Use a comma, period, colon, semicolon, parentheses, or a plain hyphen instead. The only allowed em dash is the quote-attribution dash in the RandomQuote display output, written by the quote script in `src/layouts/BaseLayout.astro`.
- Blog posts are casual and first-person, in Josh's voice: short paragraphs, plain words, occasional emoji (🤙 😜). Explain jargon in one sentence the first time it appears.
- Post titles must be 52 characters or fewer (the layout appends " | jpshlk.com" and the SEO validator caps titles at 65). Summaries must be 40 to 200 characters.
- Post bodies use `##` and below (the title is the page's only H1) and internal links always have trailing slashes (`/blog/my-post/`).

Check for violations before committing content: `grep -rn '—' src/content/blog/*.mdx` (posts `ice-macOS-menu-bar-manager`, `new-scam-bank-notification`, `settapp-apps-for-power-users`, and `web-development-am-i-an-imposter` contain pre-existing em dashes in Josh's original writing, and `teaching-my-ai-to-write-like-me` quotes em dashes as examples, and `turning-my-homepage-into-a-landing-page` quotes the RandomQuote attribution dash in a code snippet; leave those alone).

## Hero images (`featureImage`)

Post art lives in `src/assets/` named after the post slug. As of part 6 (tags-as-content, Aug 2026) the series style is a **flat developer-diagram look**: an abstract composition built from UI geometry (pills, panels, connector lines, nodes) that plays out the post's core argument as a diagram, like a modern devtool landing-page graphic. No characters, no landscape, no scenery. Parts 1 through 5 used a cartoon night scene (builder, cream house, crescent moon); Josh retired that on purpose, so do not reintroduce it or treat those five as the template. What carries the series now is the palette, not a recurring cast. When generating a prompt for a new one:

- **Format:** flat solid fills, crisp vector geometry, generous navy negative space, 1.91:1 landscape (all existing heroes are exactly this; pad with navy rather than shipping another ratio). No gradients, photoreal 3D, or painterly texture.
- **Palette, roughly 60/30/10:** 60% dusty navy `#3A4358` (flat background, never pure black), 30% cream `#F5E6C8` plus amber `#E8944A` (panels, connectors, warm accents), 10% sky blue `#0EA5E9` as accent only. Blue is the brand color (`--color-primary-*` is Tailwind `sky`) and warm amber is its complement; keeping both is what stops the set from going monochrome, a drift that has happened before (part 3 went photoreal neon on black).
- **Per-post variety** comes from which shapes the diagram is built from and what relationship it draws (flow, validation, mapping, before/after), plus optionally one muted fourth accent (grey-teal or sage) in small doses. Not from changing the base palette.
- **Never:** readable text, letters, or numbers baked into the art (code and labels are abstract bars and blank capsules; image models letter things unless told twice), neon glow, cyberpunk, pure black, purple, lens flare, gradients, drop shadows, or a card border framing the whole image.
- Reference example: `tags-as-content-why-i-made-each-tag-an-mdx-page.png` (tag pills wired by cream connectors to a tag file panel, one typo'd scrap cut off at an amber warning dot).
- `alt` text is a full descriptive sentence, same as the existing posts.

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
