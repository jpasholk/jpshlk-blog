# Part 22: Generated share images (NOT yet built)

Ready-to-execute plan. Important status note: what shipped in part 11 is the RESIZE pipeline (existing `featureImage`/`seo.image` capped at 1200px, forced PNG/JPEG, in `src/layouts/PostLayout.astro` lines ~22-32). Posts WITHOUT a feature image still fall back to the static `public/og-default.png`. Part 22 is generating a per-post title card at build time for exactly those posts.

## Design

Generate cards with **satori** (JSX-ish object tree to SVG) + **@resvg/resvg-js** (SVG to PNG), the standard static-Astro approach. Alternative if dependency weight matters: `astro-og-canvas`.

1. **Endpoint route** `src/pages/og/[...slug].png.ts`:
   - `getStaticPaths` over `getPublishedPosts()` FILTERED to posts lacking `seo?.image` and `featureImage` (no wasted generation for posts with real images).
   - GET handler builds the card and returns `new Response(pngBuffer, { headers: { 'Content-Type': 'image/png' } })`. Astro static builds write it to `dist/og/<slug>.png`.

2. **Card template** (keep it simple, match the site):
   - 1200x630, white background (or zinc-950; pick one, do not theme-switch), sky accent bar or the "Jpshlk." wordmark with the primary-colored dot, post title large (wrap at ~2-3 lines, clamp with ellipsis beyond that), date + "jpshlk.com" small at the bottom.
   - Fonts: satori needs raw font buffers. Inter files ship in `node_modules/@fontsource-variable/inter/files/`; satori wants static weights, so read the woff2/ttf for 400 and 700 (if only variable files exist, add `@fontsource/inter` as a devDependency for static weights). Load with `fs.readFileSync` at module scope.
   - Emoji in titles: satori cannot render color emoji without an emoji font. Current titles are emoji-free; strip non-BMP characters defensively anyway.

3. **Wire the fallback** in `src/layouts/PostLayout.astro`: where `ogImage` is currently `undefined` for imageless posts, use `new URL(`/og/${post.id}.png`, assetBase).href` with width 1200 / height 630 and alt = post title. Keep the existing resize path untouched for posts WITH images.

4. **Do not** generate for drafts (getPublishedPosts already excludes them in prod) or non-post pages (og-default.png stays for those).

## Gotchas (learned this session)

- Both deploy targets run plain `npm run build`; satori/resvg are pure-JS/native-binary npm deps that work on Netlify's image; add as devDependencies and confirm the build passes there via a PR deploy preview before merging.
- Build time: ~50ms+ per card; only imageless posts get one, so cost is trivial today.
- The seoGraph validators check og:image presence/URLs; verify meta tags in built HTML, not just that files exist.
- No em dashes in template text, code comments, or the companion post.

## Verification

1. `npm run build`: dist/og/ contains one PNG per imageless published post; spot-open two (Read tool renders images) to eyeball the layout, long-title wrapping, and short-title centering.
2. Built post HTML for an imageless post has `og:image` pointing at /og/<slug>.png with 1200x630 dims; a post WITH a feature image still uses the resized original.
3. Deploy preview: paste a post URL into a link-preview checker (or curl the og:image URL) to confirm it serves.

## Companion post

Part 22 post: the roadmap's "Generated share images, built per post at build time." Material: the resize-vs-generate distinction, satori in one sentence for beginners, and a before/after of a link preview.
