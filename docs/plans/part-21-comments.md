# Part 21: Comments (the decision IS the post)

Ready-to-execute plan. The roadmap frames this as an open decision between Giscus, Bluesky replies, and Mastodon replies. This doc lays out the tradeoffs grounded in this repo so Josh can decide, then a smaller-model session implements the winner.

## The three options

### A. Giscus (GitHub Discussions)

The old site ran this. Comments live in a GitHub Discussion per post, rendered in an iframe.

- Pros: threaded replies, markdown, reactions, moderation via GitHub, zero server, revives a known-good setup. Auto-creates the discussion on first comment.
- Cons: commenters need a GitHub account (filters to devs); third-party iframe and script weight on every post; visual theme sync takes work.
- Repo integration: enable Discussions on jpasholk/jpshlk-blog, configure at giscus.app, add a `Comments.astro` component at the bottom of `src/layouts/PostLayout.astro` (below prev/next nav). Load the script with `is:inline data-astro-rerun` OR mount via `astro:page-load` (the Header.astro pattern); under ClientRouter the naive install renders once and dies on swap, exactly like GoatCounter did (see the analytics wrinkle in how-this-site-works section 11). Theme sync: giscus accepts a `theme` message via postMessage; hook the existing theme scripts (BaseLayout apply() and ThemeToggle click) where `data-pf-theme` is already stamped.

### B. Mastodon replies

A post's comments are the replies to a linked Mastodon toot, fetched read-only in the browser.

- Pros: Josh's Mastodon identity is already wired site-wide (`SOCIALS.mastodon`, `rel="me"` in BaseLayout); no login wall to read; fits the privacy-first story (no tracking, public API); POSSE-adjacent: posting the toot doubles as promotion.
- Cons: every post needs a manual `mastodonPostId` in frontmatter after tooting; no replies until Josh toots; mastodon.social API rate limits (fine at this scale); rendering sanitized HTML from the API needs care.
- Repo integration: add `mastodon: z.string().optional()` (toot ID) to the blog schema in `src/content.config.ts`; a `MastodonComments.astro` component fetches `https://mastodon.social/api/v1/statuses/{id}/context` on `astro:page-load`, renders replies (sanitize: strip to text + safe tags), links "Reply on Mastodon" as the call to action. Posts without the field show nothing or a "reply on Mastodon" link only.

### C. Bluesky replies

Same shape as B but against Bluesky's public AppView API.

- Pros: livelier network lately; public read API without auth.
- Cons: NO Bluesky identity exists anywhere in the site config today (would need a new SOCIALS entry, footer icon, and an account decision first); same manual per-post linking as B; API surface younger and churns more.

## Recommendation to present to Josh

B (Mastodon) fits this site best: identity already integrated, privacy story consistent with the GoatCounter section, no login wall, and the per-post toot doubles as distribution. A is the fallback if he wants zero per-post work and accepts the GitHub-account wall. C only if he is building a Bluesky presence anyway.

## Whichever wins

- Component goes in PostLayout below the post nav, lazy (nothing loads until scrolled into view or on page-load; keep the zero-JS-by-default ethos).
- how-this-site-works gets a short addition (browser-layer or its own subsection).
- The part 21 blog post writes up the decision and tradeoffs; the drafts of this doc are raw material.
- No em dashes; validators need any new page/description within bounds.
