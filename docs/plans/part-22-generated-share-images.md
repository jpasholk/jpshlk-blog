# Part 22: Generated share images (full spec, ready to implement)

Status note: what shipped in part 11 is the RESIZE pipeline (existing `featureImage`/`seo.image` capped at 1200px, forced PNG/JPEG, in `src/layouts/PostLayout.astro` lines ~22-32). Posts WITHOUT any image fall back to the static `public/og-default.png`. Part 22 generates a per-post title card at build time for exactly those posts.

Repo facts checked (2026-07-12): 3 published posts are imageless today, plus the two migrated Medium essays when they publish, plus every future post without art. Only `@fontsource-variable/inter` is installed and it ships woff2 only; satori does NOT read woff2, so a static-weight font package is required.

## Dependencies

```
npm install --save-dev satori @resvg/resvg-js @fontsource/inter
```

`@fontsource/inter` ships static-weight `.woff` files satori can read. `@resvg/resvg-js` uses prebuilt native binaries via optionalDependencies (same mechanism as Pagefind, which already works on Netlify's build image); still confirm on a PR deploy preview before merging.

## The endpoint: `src/pages/og/[...slug].png.ts` (new file)

Complete sketch; adjust only if APIs drifted:

```ts
import fs from 'node:fs';
import type { APIRoute, GetStaticPaths } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { getPublishedPosts, type Post } from '@/lib/posts';

// Static weights; satori cannot read the variable woff2 files.
const inter400 = fs.readFileSync(
  'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff',
);
const inter700 = fs.readFileSync(
  'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff',
);

// Only posts with no image of their own get a generated card.
export const getStaticPaths = (async () => {
  const posts = await getPublishedPosts();
  return posts
    .filter((post) => !post.data.featureImage && !post.data.seo?.image)
    .map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Post };
  // Satori has no color emoji font; strip pictographs defensively.
  const title = post.data.title.replace(/\p{Extended_Pictographic}/gu, '').trim();
  const date = post.data.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fontSize = title.length <= 40 ? 72 : title.length <= 70 ? 60 : 52;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#09090b', // zinc-950, matches dark theme-color
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', fontSize: '36px', fontWeight: 700, color: '#f4f4f5' },
              children: [
                { type: 'span', props: { children: 'Jpshlk' } },
                { type: 'span', props: { style: { color: '#0ea5e9' }, children: '.' } }, // sky-500
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: `${fontSize}px`,
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#f4f4f5', // zinc-100
                lineClamp: 4,
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', fontSize: '28px', color: '#a1a1aa' }, // zinc-400
              children: `${date}  ·  jpshlk.com`,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: inter400, weight: 400, style: 'normal' },
        { name: 'Inter', data: inter700, weight: 700, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
```

Satori quirks that WILL bite otherwise: every div with multiple children needs explicit `display: 'flex'`; children are the object-tree form shown (no JSX in a .ts endpoint); the middle dot in the footer is fine but em dashes are banned repo-wide.

## Wiring the fallback: `src/layouts/PostLayout.astro`

The existing resize path stays untouched. Change only the props where `ogImage` is undefined today:

```astro
ogImage={ogImage
  ? new URL(ogImage.src, assetBase).href
  : new URL(`/og/${post.id}.png`, assetBase).href}
ogImageAlt={ogSource ? (seo?.image?.alt ?? featureImage?.alt ?? title) : title}
ogImageWidth={ogImage?.attributes.width ?? 1200}
ogImageHeight={ogImage?.attributes.height ?? 630}
```

`assetBase` (src/lib/urls.ts) already resolves to the deploy-preview domain on non-production builds, so scrapers can fetch the card on previews too. `public/og-default.png` remains the fallback for non-post pages only.

## Edge cases

- Drafts: excluded automatically (`getPublishedPosts`).
- Long titles: 52px + lineClamp 4 handles the 52-char title cap comfortably; the clamp is belt and suspenders.
- Apostrophes/quotes in titles: plain text children, no escaping needed.
- Posts that later GAIN a featureImage: their /og/ file simply stops being generated and referenced together; no cleanup needed (fresh dist each build).

## Verification

1. `npm run build`: `dist/og/` contains exactly one PNG per imageless published post (3 today). No satori/resvg errors.
2. Eyeball at least two cards (short title and longest title) by opening the PNGs; check wordmark, wrapping, footer.
3. Built HTML: an imageless post's `og:image` points at `/og/<slug>.png` with 1200x630; a post WITH a feature image is unchanged (diff its meta tags against a pre-change build).
4. `npm run check` clean; no em dashes introduced.
5. PR deploy preview: fetch `https://deploy-preview-N--jpshlk.netlify.app/og/<slug>.png` and confirm 200 + image bytes (this also proves resvg's native binary works on Netlify).

## Companion post

Part 22 post material: resize vs generate distinction, satori in one beginner sentence (JSX-like layout in, SVG out, then rasterized to PNG), a before/after link preview, and the fact that the two republished Medium essays were the posts that finally forced the feature.
