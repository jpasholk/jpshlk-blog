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
  { href: '/tags/', title: 'Tags' },
] as const;

export const POSTS_PER_PAGE = 5;
