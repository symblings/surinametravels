import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(120),
      description: z.string().min(40).max(200),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('Suriname Travels redactie'),
      heroImage: image().or(z.string().url()),
      heroAlt: z.string().min(3),
      tags: z.array(z.string()).default([]),
      category: z.enum(['natuur', 'cultuur', 'praktisch', 'avontuur']),
      featured: z.boolean().default(false),
      lang: z.enum(['nl', 'en']),
      translationKey: z.string().optional(),
      faqs: z
        .array(z.object({ q: z.string(), a: z.string() }))
        .optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
