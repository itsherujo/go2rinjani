import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const legal = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    section: z.string().optional(),
    author: z.string().optional(),
    authorLink: z.string().optional(),
    wordCount: z.number().optional(),
    lastUpdated: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    date: z.string().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
  }),
});

export const collections = { legal, blog };
