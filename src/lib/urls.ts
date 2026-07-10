import { SITE } from '@/config';

/**
 * Base URL for fetched assets like share images. Canonical URLs always
 * use SITE.url, but og:image must resolve on the host actually serving
 * this build: on Netlify branch deploys and previews the canonical
 * domain still serves the old site, so scrapers would 404 on it.
 * CONTEXT is 'production' | 'branch-deploy' | 'deploy-preview' on
 * Netlify builds and unset locally.
 */
export const assetBase =
  process.env.CONTEXT && process.env.CONTEXT !== 'production'
    ? (process.env.DEPLOY_PRIME_URL ?? SITE.url)
    : SITE.url;
