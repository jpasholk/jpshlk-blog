import { getCollection, getEntries, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/**
 * Whether a post belongs in this build. Drafts render in dev only.
 * Future-dated posts are "scheduled": they render everywhere except
 * production, where they stay hidden until their date. The daily
 * scheduled-publish workflow rebuilds production, so a scheduled post
 * appears on the first build on or after its date. CONTEXT is
 * 'production' | 'branch-deploy' | 'deploy-preview' on Netlify builds
 * and unset locally (same detection as assetBase in urls.ts).
 */
// Frontmatter dates parse as midnight UTC, which is still the previous
// evening in Pacific time, so comparing against midnight would let an
// unrelated evening deploy publish tomorrow's post early. Instead a
// post goes live at 15:30 UTC on its date, the scheduled workflow's
// cron time (8:30 AM PDT, 7:30 AM PST). Keep in sync with
// .github/workflows/scheduled-publish.yml and scripts/pending-posts.mjs.
const PUBLISH_TIME_MS = 15.5 * 60 * 60 * 1000;

export function isPublished(data: Post['data']): boolean {
  if (import.meta.env.DEV) return true;
  if (data.draft) return false;
  const isProduction = !process.env.CONTEXT || process.env.CONTEXT === 'production';
  return !isProduction || data.date.valueOf() + PUBLISH_TIME_MS <= Date.now();
}

/** Published posts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => isPublished(data));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Whole minutes at ~200 words per minute, never less than 1. */
export function readingTime(post: Post): number {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Up to `limit` related posts: hand-picked `related` frontmatter refs
 * first, topped up with the posts sharing the most tags.
 */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const picked = (await getEntries(post.data.related)).filter((entry) =>
    isPublished((entry as Post).data),
  ) as Post[];

  const all = await getPublishedPosts();
  const tagIds = new Set(post.data.tags.map((tag) => tag.id));
  const byTags = all
    .filter((p) => p.id !== post.id && !picked.some((r) => r.id === p.id))
    .map((p) => ({
      post: p,
      shared: p.data.tags.filter((tag) => tagIds.has(tag.id)).length,
    }))
    .filter((entry) => entry.shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared || b.post.data.date.valueOf() - a.post.data.date.valueOf(),
    )
    .map((entry) => entry.post);

  return [...picked, ...byTags].slice(0, limit);
}
