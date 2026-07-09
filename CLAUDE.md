# jpshlk.com

Josh Pasholk's personal site: Astro 7, Tailwind CSS v4 (CSS-first config), TypeScript, no UI framework. See README.md for the stack and deploy details.

## Writing style (applies to ALL generated text)

- **Never use em dashes (—) or en dashes (–).** Not in blog posts, page copy, summaries, README, comments, or commit messages. Use a comma, period, colon, semicolon, parentheses, or a plain hyphen instead. The only allowed em dash is the quote-attribution dash inside the RandomQuote component's display output.
- Blog posts are casual and first-person, in Josh's voice: short paragraphs, plain words, occasional emoji (🤙 😜). Explain jargon in one sentence the first time it appears.
- Post titles must be 52 characters or fewer (the layout appends " | jpshlk.com" and the SEO validator caps titles at 65). Summaries must be 40 to 200 characters.
- Post bodies use `##` and below (the title is the page's only H1) and internal links always have trailing slashes (`/blog/my-post/`).

Check for violations before committing content: `grep -rn '—' src/content/blog/*.mdx` (posts `ice-macOS-menu-bar-manager`, `new-scam-bank-notification`, and `settapp-apps-for-power-users` contain pre-existing em dashes in Josh's original writing; leave those alone).

## Workflow

- Development happens on feature branches. `main` is the live site; never push or merge to it without explicit permission.
- Run `npm run check` and `npm run build` before committing. Draft posts (`draft: true`) only render in `npm run dev`.
