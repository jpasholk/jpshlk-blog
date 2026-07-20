import rss from '@astrojs/rss';
import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { render } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '@/config';
import { getPublishedPosts } from '@/lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  const site = context.site!.href.replace(/\/$/, '');

  // A container renders MDX to HTML outside a page, so the feed can
  // carry full post bodies instead of just summaries.
  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const items = [];
  for (const post of posts) {
    const { Content } = await render(post);
    let html = await container.renderToString(Content);
    // Feed readers need absolute URLs; strip any doctype the container adds.
    html = html
      .replace(/^<!DOCTYPE html>/i, '')
      .replaceAll('src="/', `src="${site}/`)
      .replaceAll('href="/', `href="${site}/`);

    items.push({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags.map((tag) => tag.id),
      content: html,
    });
  }

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items,
  });
}
