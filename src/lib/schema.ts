/**
 * Single source of truth for the schema.org JSON-LD graph. Page heads
 * and the /schema/*.json endpoints build from the same pieces so every
 * representation agrees on entity @ids.
 */
import { breadcrumbsFromUrl, gitLastmod } from '@jdevalk/astro-seo-graph';
import {
  assembleGraph,
  buildArticle,
  buildBreadcrumbList,
  buildPiece,
  buildWebPage,
  buildWebSite,
  makeIds,
} from '@jdevalk/seo-graph-core';
import { AUTHOR, SITE, SOCIALS } from '@/config';
import type { Post } from '@/lib/posts';

export const ids = makeIds({ siteUrl: SITE.url });

export const person = buildPiece({
  '@id': ids.person,
  '@type': 'Person',
  name: AUTHOR.name,
  url: `${SITE.url}/`,
  jobTitle: AUTHOR.occupation,
  sameAs: Object.values(SOCIALS),
});

export const website = buildWebSite(
  {
    url: `${SITE.url}/`,
    name: SITE.title,
    description: SITE.description,
    publisher: { '@id': ids.person },
    inLanguage: SITE.locale,
  },
  ids,
);

export const postUrl = (post: Post) => `${SITE.url}/blog/${post.id}/`;

/**
 * Effective "updated" date: explicit lastmod wins, then the git
 * committer date when it's meaningfully (>1 day) after publish.
 * Bulk commits that rewrite posts without changing content should be
 * added to excludeCommits so they don't stamp every post.
 */
export function postDateModified(post: Post): Date | undefined {
  if (post.data.lastmod) return post.data.lastmod;
  if (!post.filePath) return undefined;
  const fromGit = gitLastmod(post.filePath, { excludeCommits: [] });
  if (!fromGit) return undefined;
  const oneDay = 24 * 60 * 60 * 1000;
  return fromGit.getTime() - post.data.date.getTime() > oneDay ? fromGit : undefined;
}

/** WebPage + BlogPosting + breadcrumbs for a single post. */
export function postPieces(post: Post) {
  const url = postUrl(post);
  return [
    buildWebPage(
      {
        url,
        name: post.data.title,
        description: post.data.summary,
        isPartOf: { '@id': ids.website },
        breadcrumb: { '@id': ids.breadcrumb(url) },
        datePublished: post.data.date,
        dateModified: postDateModified(post),
        inLanguage: SITE.locale,
      },
      ids,
    ),
    buildArticle(
      {
        url,
        isPartOf: { '@id': ids.webPage(url) },
        author: { '@id': ids.person },
        publisher: { '@id': ids.person },
        headline: post.data.title,
        description: post.data.summary ?? '',
        datePublished: post.data.date,
        dateModified: postDateModified(post),
        keywords: post.data.tags.map((tag) => tag.id).join(', ') || undefined,
        inLanguage: SITE.locale,
      },
      ids,
      'BlogPosting',
    ),
    buildBreadcrumbList(
      {
        url,
        items: breadcrumbsFromUrl({ url, siteUrl: SITE.url, pageName: post.data.title }),
      },
      ids,
    ),
  ];
}

/** Full head graph for a post page. */
export function postGraph(post: Post) {
  return assembleGraph([...postPieces(post), person, website], {
    warnOnDanglingReferences: import.meta.env.DEV,
  });
}

/** WebPage piece for a static page (landing, blog index, tags, …). */
export function pagePieces(name: string, path: string, description?: string) {
  const url = new URL(path, SITE.url).href;
  const pieces = [
    buildWebPage(
      {
        url,
        name,
        description,
        isPartOf: { '@id': ids.website },
        breadcrumb: path === '/' ? undefined : { '@id': ids.breadcrumb(url) },
        inLanguage: SITE.locale,
      },
      ids,
    ),
  ];
  if (path !== '/') {
    pieces.push(
      buildBreadcrumbList(
        { url, items: breadcrumbsFromUrl({ url, siteUrl: SITE.url, pageName: name }) },
        ids,
      ),
    );
  }
  return pieces;
}

/** Full head graph for a static page. */
export function pageGraph(name: string, path: string, description?: string) {
  return assembleGraph([...pagePieces(name, path, description), person, website], {
    warnOnDanglingReferences: import.meta.env.DEV,
  });
}
