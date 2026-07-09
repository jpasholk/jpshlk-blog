import { createApiCatalog } from '@jdevalk/astro-seo-graph';
import { SITE } from '@/config';

export const GET = createApiCatalog({
  siteUrl: SITE.url,
  schemaEndpoints: [
    { path: '/schema/post.json', schemaType: 'BlogPosting' },
    { path: '/schema/page.json', schemaType: 'WebPage' },
  ],
  schemaMap: { path: '/schemamap.xml' },
});
