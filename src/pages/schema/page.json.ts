import { createSchemaEndpoint } from '@jdevalk/astro-seo-graph';
import { SITE } from '@/config';
import { pagePieces, person, website } from '@/lib/schema';

const pages = [
  { name: SITE.title, path: '/', description: SITE.description },
  { name: 'Blog', path: '/blog/', description: 'All posts, newest first.' },
  { name: 'Projects', path: '/projects/', description: "Things I've built and work I do." },
  { name: 'Tags', path: '/tags/', description: 'Browse posts by topic.' },
];

export const GET = createSchemaEndpoint({
  entries: async () => pages,
  mapper: (page) => [...pagePieces(page.name, page.path, page.description), person, website],
});
