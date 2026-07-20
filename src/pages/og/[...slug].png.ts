import fs from 'node:fs';
import type { APIRoute, GetStaticPaths } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { getPublishedPosts, type Post } from '@/lib/posts';

// Satori cannot read the variable woff2 files from
// @fontsource-variable/inter, hence the static-weight package.
const inter400 = fs.readFileSync(
  'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff',
);
const inter700 = fs.readFileSync(
  'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff',
);

// Only posts with no image of their own get a generated card; posts
// with a featureImage/seo.image keep the resize pipeline in PostLayout.
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
  // timeZone UTC matches FormattedDate.astro; without it a date-only
  // frontmatter date renders one day early in US timezones.
  const date = post.data.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const fontSize = title.length <= 40 ? 72 : title.length <= 70 ? 60 : 52;

  // Satori quirks: every div with multiple children needs an explicit
  // display: flex, and a .ts endpoint means object trees, not JSX.
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
  // asPng() returns a Node Buffer, which the DOM Response type does not
  // accept as BodyInit; a plain Uint8Array does.
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
