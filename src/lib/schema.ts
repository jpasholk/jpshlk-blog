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
  type BreadcrumbItem,
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
 * Crumb trails feed two outputs from one derivation: the BreadcrumbList
 * in the JSON-LD graph below, and the visible trail Breadcrumbs.astro
 * renders. Pages must pass the same inputs to both so they can't drift.
 */
export function postCrumbs(post: Post): BreadcrumbItem[] {
  const url = postUrl(post);
  return breadcrumbsFromUrl({ url, siteUrl: SITE.url, pageName: post.data.title });
}

/**
 * Crumb trail for a non-post page. `names` maps path segments to
 * display names (e.g. { ios: 'iOS' }) for intermediate crumbs that
 * would otherwise be title-cased from their slug.
 */
export function pageCrumbs(
  name: string,
  path: string,
  names?: Record<string, string>,
): BreadcrumbItem[] {
  const url = new URL(path, SITE.url).href;
  return breadcrumbsFromUrl({ url, siteUrl: SITE.url, pageName: name, names });
}

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
    buildBreadcrumbList({ url, items: postCrumbs(post) }, ids),
  ];
}

/** Full head graph for a post page. */
export function postGraph(post: Post) {
  return assembleGraph([...postPieces(post), person, website], {
    warnOnDanglingReferences: import.meta.env.DEV,
  });
}

/** WebPage piece for a static page (landing, blog index, tags, …). */
export function pagePieces(
  name: string,
  path: string,
  description?: string,
  names?: Record<string, string>,
) {
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
    pieces.push(buildBreadcrumbList({ url, items: pageCrumbs(name, path, names) }, ids));
  }
  return pieces;
}

/** Full head graph for a static page. */
export function pageGraph(
  name: string,
  path: string,
  description?: string,
  names?: Record<string, string>,
) {
  return assembleGraph([...pagePieces(name, path, description, names), person, website], {
    warnOnDanglingReferences: import.meta.env.DEV,
  });
}

/** ProfilePage graph for identity hub pages like /links/. */
export function profileGraph(name: string, path: string, description?: string) {
  const url = new URL(path, SITE.url).href;
  return assembleGraph(
    [
      buildWebPage(
        {
          url,
          name,
          description,
          isPartOf: { '@id': ids.website },
          breadcrumb: { '@id': ids.breadcrumb(url) },
          mainEntity: { '@id': ids.person },
          inLanguage: SITE.locale,
        },
        ids,
        'ProfilePage',
      ),
      buildBreadcrumbList({ url, items: pageCrumbs(name, path) }, ids),
      person,
      website,
    ],
    { warnOnDanglingReferences: import.meta.env.DEV },
  );
}
