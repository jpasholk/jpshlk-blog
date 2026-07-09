import { createSchemaMap } from '@jdevalk/astro-seo-graph';
import { SITE } from '@/config';
import { getPublishedPosts } from '@/lib/posts';
import { postDateModified } from '@/lib/schema';

const posts = await getPublishedPosts();
const lastModified = new Date(
  Math.max(...posts.map((post) => (postDateModified(post) ?? post.data.date).getTime())),
);

export const GET = createSchemaMap({
  siteUrl: SITE.url,
  entries: [
    { path: '/schema/post.json', lastModified },
    { path: '/schema/page.json', lastModified },
  ],
});
