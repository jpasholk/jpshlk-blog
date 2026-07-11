import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import seoGraph, { indexNowOnBranch } from '@jdevalk/astro-seo-graph/integration';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const SITE_URL = 'https://jpshlk.com';

// Deploy-platform branch var (Netlify, or Cloudflare Pages / Workers
// Builds if the site moves there later).
const branch =
  process.env.BRANCH ?? process.env.CF_PAGES_BRANCH ?? process.env.WORKERS_CI_BRANCH ?? '';

// IndexNow bricks its key if URLs are submitted before /<key>.txt is
// live (403), so submission requires an explicit second opt-in:
// deploy once with INDEXNOW_KEY set, confirm the key file resolves,
// then set INDEXNOW_SUBMIT=true.
const indexNow =
  process.env.INDEXNOW_KEY && process.env.INDEXNOW_SUBMIT === 'true'
    ? indexNowOnBranch(branch, {
        key: process.env.INDEXNOW_KEY,
        host: 'jpshlk.com',
        siteUrl: SITE_URL,
        incremental: true,
        // Paginated archives churn without new content.
        filter: (url) => !/^\/(?:blog|tags\/[^/]+)\/\d+\/$/.test(new URL(url).pathname),
      })
    : undefined;

export default defineConfig({
  site: SITE_URL,
  prefetch: true,
  // The landing page absorbed the old About page; /aboutme is linked
  // from an old post body. Mirrored in public/_redirects for Cloudflare.
  redirects: {
    '/about': '/',
    '/aboutme': '/',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/styleguide'),
    }),
    seoGraph({
      validateH1: true,
      validateUniqueMetadata: true,
      validateImageAlt: true,
      // Defaults (30–65 / 70–200) flag legitimately short post titles
      // and summaries; keep the max bounds, loosen the mins.
      validateMetadataLength: {
        title: { min: 15, max: 65 },
        description: { min: 40, max: 200 },
      },
      validateInternalLinks: true,
      markdownAlternate: true,
      llmsTxt: {
        title: 'jpshlk.com',
        siteUrl: SITE_URL,
        summary:
          "Josh Pasholk's personal site and blog: iPhone and Mac apps, iOS Shortcuts, e-commerce, marketing, and web development.",
        filter: (url) => {
          const path = new URL(url).pathname;
          return (
            !/^\/(?:blog|tags\/[^/]+)\/\d+\/$/.test(path) &&
            !path.startsWith('/styleguide') &&
            // Redirect stubs, the 404 page, and the search page: not content.
            path !== '/about/' &&
            path !== '/aboutme/' &&
            path !== '/404' &&
            path !== '/search/'
          );
        },
      },
      indexNow,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
