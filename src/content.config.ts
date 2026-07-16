import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { imageSchema, seoSchema } from '@jdevalk/astro-seo-graph';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(reference('tags')).default([]),
      lastmod: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      comments: z.boolean().default(true),
      summary: z.string().optional(),
      canonicalUrl: z.string().optional(),
      related: z.array(reference('blog')).default([]),
      featureImage: imageSchema(image).optional(),
      seo: seoSchema(image).optional(),
    }),
});

const tags = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tags' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      url: z.url(),
      linkLabel: z.string(),
      repo: z.url().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

export const collections = { blog, tags, projects };
