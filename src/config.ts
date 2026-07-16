/**
 * Site-wide constants. The single source of truth for identity,
 * navigation, and social links across pages, feeds, and schema.
 */
export const SITE = {
  title: 'jpshlk.com',
  headerTitle: 'Jpshlk',
  description: 'A blog about things I find useful, and want to remember.',
  url: 'https://jpshlk.com',
  repo: 'https://github.com/jpasholk/jpshlk-blog',
  locale: 'en-US',
} as const;

export const AUTHOR = {
  name: 'Josh Pasholk',
  occupation: 'Digital Duct Tape',
  company: 'Plantonix',
} as const;

export const SOCIALS = {
  mastodon: 'https://mastodon.social/@jpasholk',
  github: 'https://github.com/jpasholk',
  linkedin: 'https://www.linkedin.com/in/joshpasholk',
  instagram: 'https://www.instagram.com/joshpasholk/',
  buymeacoffee: 'https://buymeacoffee.com/jpasholk',
  routinehub: 'https://routinehub.co/user/jpasholk',
} as const;

export const NAVIGATION = [
  { href: '/', title: 'Home' },
  { href: '/blog/', title: 'Blog' },
  { href: '/projects/', title: 'Projects' },
  { href: '/about/', title: 'About' },
  { href: '/tags/', title: 'Tags' },
] as const;

/**
 * GoatCounter analytics. The code is public (it only names the
 * dashboard), so it lives here instead of an env var. Scripts only
 * render on Netlify production deploys (CONTEXT=production), never
 * on branch deploys or local dev. An empty code disables it entirely.
 */
export const GOATCOUNTER = {
  code: 'jpshlk', // counter name — account created 2026-07-10
  enabled: process.env.CONTEXT === 'production',
} as const;

/**
 * Giscus comments (GitHub Discussions). Both IDs are public: they only
 * name the repo and discussion category, so they live here instead of
 * env vars. Values come from https://giscus.app after picking the repo
 * and the announcements category. The Comments component renders
 * nothing when categoryId is empty, so clearing it disables the
 * feature entirely.
 */
export const GISCUS = {
  repo: 'jpasholk/jpshlk-blog',
  repoId: 'R_kgDOKxOpVw',
  category: 'Blog Post Comments',
  categoryId: 'DIC_kwDOKxOpV84Celqg',
} as const;

export const POSTS_PER_PAGE = 5;
