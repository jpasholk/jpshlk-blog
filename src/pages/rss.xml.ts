import rss from '@astrojs/rss';
import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getImage } from 'astro:assets';
import { loadRenderers } from 'astro:container';
import { render } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '@/config';
import { getPublishedPosts } from '@/lib/posts';

// Feed readers never load this site's CSS, so on-site chrome must not
// ship in feed HTML: the external-link arrow icon (tagged
// data-feed-strip in Link.astro) would render at full width, and the
// autolink heading anchors would show as a literal '#' after every
// heading. Social icon SVGs stay: they size themselves with inline
// styles and some posts use them as real content (store badges).
function stripFeedChrome(html: string): string {
  return html
    .replace(/\s*<svg\b[^>]*\bdata-feed-strip\b[^>]*>[\s\S]*?<\/svg>/g, '')
    .replace(/\s*<a\b[^>]*\bclass="[^"]*\bheading-anchor\b[^"]*"[^>]*>#<\/a>/g, '');
}

function escapeAttr(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

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
    html = stripFeedChrome(html)
      .replace(/^<!DOCTYPE html>/i, '')
      .replaceAll('src="/', `src="${site}/`)
      .replaceAll('href="/', `href="${site}/`);

    // The site shows the hero image above the post body (PostLayout),
    // so the feed does too. Same 1400px pipeline, never upscaled, and
    // built absolute so it skips the rewrite above.
    const { featureImage } = post.data;
    if (featureImage) {
      const hero = await getImage({
        src: featureImage.src,
        width: Math.min(1400, featureImage.src.width),
      });
      const heroUrl = new URL(hero.src, context.site).href;
      html =
        `<img src="${heroUrl}" alt="${escapeAttr(featureImage.alt ?? post.data.title)}" ` +
        `width="${hero.attributes.width}" height="${hero.attributes.height}">` +
        html;
    }

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
