import { getCollection, getEntries, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts are excluded outside dev. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.DEV ? true : !data.draft,
  );
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
  const picked = (await getEntries(post.data.related)).filter(
    (entry) => !entry.data.draft,
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
