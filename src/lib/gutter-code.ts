/**
 * Shared pieces of the decorative code-in-the-margins effect: real (lightly
 * trimmed) excerpts of this site's own source, plus the tiny highlighter
 * that colors them. Used by CodeGutters.astro (desktop side columns),
 * CodeBand.astro (mobile horizontal bands), and the Hero side strips.
 *
 * The highlighter is deliberately minimal instead of Shiki: for these
 * short, repeated snippets it produces a fraction of the DOM nodes and raw
 * HTML (Shiki emits a dual-color inline style on nearly every token, which
 * balloons the invisible markup shipped to phones). It only wraps keywords,
 * strings, comments, and numbers; everything else stays plain text.
 *
 * If the excerpted files change meaningfully, refresh these so the margins
 * keep telling the truth about how the site works.
 */

export const SNIPPETS = {
  /** Blog collection schema from src/content.config.ts. */
  schema: `const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(reference('tags')).default([]),
      draft: z.boolean().default(false),
      summary: z.string().optional(),
      related: z.array(reference('blog')).default([]),
    }),
});`,

  /** Post helpers from src/lib/posts.ts. */
  posts: `export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.DEV ? true : !data.draft,
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Whole minutes at ~200 words per minute, never less than 1. */
export function readingTime(post: Post): number {
  const words = (post.body ?? '').split(/\\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}`,

  /** The pre-paint theme script from src/layouts/BaseLayout.astro. */
  theme: `// Apply the theme before first paint, and again after every
// ClientRouter swap (the new document arrives without the class).
const apply = () => {
  const stored = localStorage.getItem('theme');
  const dark = stored
    ? stored === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
};
apply();
document.addEventListener('astro:after-swap', apply);`,

  /** Schema graph pieces from src/lib/schema.ts. */
  graph: `export const person = buildPiece({
  '@id': ids.person,
  '@type': 'Person',
  name: AUTHOR.name,
  url: \`\${SITE.url}/\`,
  jobTitle: AUTHOR.occupation,
  sameAs: Object.values(SOCIALS),
});

export const postUrl = (post: Post) =>
  \`\${SITE.url}/blog/\${post.id}/\`;`,
} as const;

const KEYWORDS =
  'const|let|var|export|import|from|function|return|async|await|new|typeof|instanceof|if|else|for|of|in|default|class|extends|interface|type|true|false|null|undefined|void|this|Promise|Array|Math|Object|Boolean|String|Number';

const TOKENS = new RegExp(
  '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' + // 1: comment
    '|(`(?:\\\\.|[^`\\\\])*`|\'(?:\\\\.|[^\'\\\\])*\'|"(?:\\\\.|[^"\\\\])*")' + // 2: string
    '|\\b(' +
    KEYWORDS +
    ')\\b' + // 3: keyword
    '|\\b(\\d+(?:\\.\\d+)?)\\b', // 4: number
  'g',
);

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Minimal JS/TS highlighter. Escapes first, then wraps a few token kinds. */
export function highlight(code: string): string {
  return escapeHtml(code).replace(TOKENS, (m, comment, str, kw, num) => {
    if (comment) return `<i class=c>${comment}</i>`;
    if (str) return `<i class=s>${str}</i>`;
    if (kw) return `<i class=k>${kw}</i>`;
    if (num) return `<i class=n>${num}</i>`;
    return m;
  });
}
