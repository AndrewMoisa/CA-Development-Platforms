import { z } from "zod";

const articleCore = {
  title: z
    .string({ message: "Title must be a string" })
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be less than 100 characters"),
  body: z
    .string({ message: "Body must be a string" })
    .min(10, "Body must be at least 10 characters long"),
  category: z
    .string({ message: "Category must be a string" })
    .min(3, "Category must be at least 3 characters"),
};

export const createArticleSchema = z.object({
  body: z.object(articleCore),
});

export const updateArticleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Article ID must be a number"),
  }),
  body: z.object(articleCore),
});

export const patchArticleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Article ID must be a number"),
  }),
  body: z.object(articleCore).partial(),
});

export const articleIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Article ID must be a number"),
  }),
});
