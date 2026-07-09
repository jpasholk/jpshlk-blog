import { createMarkdownEndpoint } from '@jdevalk/astro-seo-graph';
import { AUTHOR } from '@/config';
import { getPublishedPosts } from '@/lib/posts';
import { postUrl } from '@/lib/schema';

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ params: { slug: post.id } }));
}

export const GET = createMarkdownEndpoint({
  entries: () => getPublishedPosts(),
  // The slug-match guard is required: without it the first entry
  // would be served for every URL.
  mapper: (post, slug) =>
    post.id !== slug
      ? null
      : {
          frontmatter: {
            title: post.data.title,
            canonical: postUrl(post),
            pubDate: post.data.date,
            author: AUTHOR.name,
            description: post.data.summary,
            tags: post.data.tags.map((tag) => tag.id),
          },
          body: post.body ?? '',
        },
});
