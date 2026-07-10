# jpshlk.com Blog Plan

Last updated: 2026-07-11. Living document; update as posts publish.

## Where things stand

- The rebuilt site is live on a Netlify **branch deploy**. Merging `claude/astro-website-refactor-1truey` into `main` is the launch action.
- **15 draft posts** are written and verified (`draft: true`), all dated 2026-07-09/10 as placeholders. Re-date each at publish time.
- Every code snippet in every draft is real, tested code from this repo.

## Draft inventory

### The rebuild series (10 parts, tag: `rebuild`)

| # | Slug | Status |
|---|------|--------|
| 1 | `rebuilding-my-blog-with-ai` | Ready to edit and publish |
| 2 | `back-up-your-site-with-a-git-branch` | Ready |
| 3 | `starting-clean-with-astro-7-and-tailwind-4` | Ready |
| 4 | `a-tiny-design-system-and-dark-mode-that-works` | Ready |
| 5 | `turning-my-homepage-into-a-landing-page` | Ready |
| 6 | `migrating-22-posts-without-editing-a-single-one` | Ready |
| 7 | `agent-ready-seo-with-the-yoast-founders-tools` | Ready |
| 8 | `launching-with-netlify-branch-deploys` | **Has TODOs**: add real merge-day details after launch |
| 9 | `teaching-my-ai-to-write-like-me` | Ready (quotes em dashes on purpose; grep exception documented in CLAUDE.md) |
| 10 | `mcp-servers-that-level-up-ai-web-dev` | **Has TODO**: swap in real impressions after using the MCP servers |

### Standalone quick-win posts (evergreen, tags: `astro` / `web-development`)

| Slug | Feature it documents |
|------|----------------------|
| `give-every-post-its-own-share-image` | featureImage frontmatter on 20 posts |
| `related-posts-with-no-database` | Tag-scored Keep Reading section |
| `adding-reading-time-to-an-astro-blog` | readingTime helper |
| `a-copy-button-for-every-code-block` | CodeCopy component |
| `shipping-full-posts-in-my-rss-feed` | Container-API full-content feed |
| `a-uses-page-built-from-my-own-posts` | The /uses page (tags: `astro` / `apps`) |
| `privacy-friendly-analytics-with-goatcounter` | GoatCounter analytics, production-gated |

## Publishing order and cadence

Suggested rhythm: **1 to 2 posts per week**. Fast enough to build momentum, slow enough that 15 drafts last 2 to 3 months.

1. **Launch first, then part 1** within a few days, while the story is fresh and the site it describes is what visitors actually see.
2. **Publish the series in order** (parts 2 through 10). Each post's intro links the previous part, so order matters.
3. **Interleave the standalones** starting after part 4 or so, or hold them as buffer weeks when life gets busy. They are evergreen and self-contained, so timing is flexible.
4. Parts 8 and 10 need their TODOs resolved before publishing. Part 8 unblocks the day you launch; part 10 unblocks once you have used the MCP servers enough to have opinions.

## Pre-publish checklist (per post)

1. Read it once out loud-ish. Fix anything that does not sound like you.
2. Resolve or delete any `{/* TODO */}` markers.
3. Re-date the frontmatter `date` to the actual publish date.
4. Flip `draft: true` to `draft: false`.
5. `npm run check` and `npm run build` (CLAUDE.md rule; also runs the SEO validators).
6. Push, wait for the deploy, then paste the post URL into Discord or iMessage to spot-check the share card.
7. Optional: run the post through validator.schema.org once in a while.

## Launch interlock (one-time)

1. Merge the branch to `main` on GitHub (base repository must be `jpasholk/jpshlk-blog`, not the upstream fork). Netlify rebuilds production; the domain serves the new site.
2. Run the smoke test from series post 8: robots.txt, sitemap, llms.txt, a `.md` alternate, the `/about` redirect, the fuzzy 404, the Ice post's GitHub buttons.
3. Update post 8's TODOs with what actually happened; screenshots if you took any.
4. Google Search Console: submit the sitemap.
5. IndexNow, strictly in order: set `INDEXNOW_KEY`, deploy, confirm `/<key>.txt` loads, then set `INDEXNOW_SUBMIT=true`.
6. Publish series part 1.

## Backlog (future features, each doubles as a post)

- ~~**`/uses` page**~~: DONE 2026-07-10. Live at `/uses/`; hardware section still needs real models and desk gear.
- **`/now` page**: what you are into lately; pairs with the Obsidian habit.
- **`/shortcuts` collection**: your RoutineHub shortcuts as first-class content on your own site.
- **Pagefind search**: static site search, worth it as the post count grows.
- ~~**Privacy-friendly analytics**~~: DONE 2026-07-10, GoatCounter, gated to production deploys. One manual step left before launch: create the account at goatcounter.com and set `GOATCOUNTER.code` in `src/config.ts`.
- **Mastodon-powered comments**: replies to a post's Mastodon thread shown as comments.
- **Per-post generated OG images**: build-time cards with the post title (the deluxe version of featureImage).
- **Dark mode refinements** (parked by choice): smart reset to auto, live sunset switching.

## House rules reminder

Style and workflow rules live in `CLAUDE.md` (no em dashes, title and summary length limits, never touch `main` without asking). New AI sessions read it automatically; humans should too. 🤙
