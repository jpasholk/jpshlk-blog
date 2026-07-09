import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '@/config';
import { getPublishedPosts } from '@/lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags.map((tag) => tag.id),
    })),
  });
}
