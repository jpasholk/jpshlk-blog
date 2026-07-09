import { createSchemaEndpoint } from '@jdevalk/astro-seo-graph';
import { getPublishedPosts } from '@/lib/posts';
import { person, postPieces, website } from '@/lib/schema';

export const GET = createSchemaEndpoint({
  entries: () => getPublishedPosts(),
  mapper: (post) => [...postPieces(post), person, website],
});
