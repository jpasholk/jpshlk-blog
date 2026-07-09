import { createIndexNowKeyRoute } from '@jdevalk/astro-seo-graph';

/**
 * Serves the IndexNow ownership file at /<key>.txt. Builds without
 * INDEXNOW_KEY simply emit no route.
 */
const key = process.env.INDEXNOW_KEY;

export function getStaticPaths() {
  return key ? [{ params: { key } }] : [];
}

// The fallback only satisfies key-format validation at module load;
// without INDEXNOW_KEY no static path is emitted so GET never runs.
export const GET = createIndexNowKeyRoute({ key: key ?? 'unset-key-000' });
