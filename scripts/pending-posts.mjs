#!/usr/bin/env node
/**
 * Lists publish-eligible posts (no draft flag, frontmatter date reached)
 * that are missing from the live RSS feed. The scheduled-publish
 * workflow triggers a production rebuild only when at least one slug is
 * pending; comparing against the live feed instead of "dated today"
 * means a missed cron run self-heals on the next one.
 */
import { readdir, readFile, appendFile } from 'node:fs/promises';

const BLOG_DIR = new URL('../src/content/blog/', import.meta.url);
const FEED_URL = 'https://jpshlk.com/rss.xml';

const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.mdx'));
const eligible = [];
for (const file of files) {
  const source = await readFile(new URL(file, BLOG_DIR), 'utf8');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1];
  if (!frontmatter) continue;
  if (/^draft:\s*true\s*$/m.test(frontmatter)) continue;
  // Old posts use non-padded dates like 2016-3-25, so 1-2 digit parts.
  const date = frontmatter.match(/^date:\s*['"]?(\d{4}-\d{1,2}-\d{1,2})/m)?.[1];
  if (!date) continue;
  if (new Date(date).valueOf() <= Date.now()) {
    eligible.push(file.replace(/\.mdx$/, ''));
  }
}

// Live URLs lowercase the slug (e.g. ice-macOS-menu-bar-manager), so
// compare case-insensitively.
const feed = (await (await fetch(FEED_URL)).text()).toLowerCase();
const pending = eligible.filter(
  (slug) => !feed.includes(`/blog/${slug.toLowerCase()}/`),
);

if (pending.length === 0) {
  console.log(`Nothing pending: ${eligible.length} eligible posts, all in the live feed.`);
} else {
  console.log(`Pending publish: ${pending.join(', ')}`);
}

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `pending=${pending.length}\n`);
}
