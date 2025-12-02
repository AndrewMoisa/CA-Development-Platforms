import { z } from "zod";

export const createArticleSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" } as any)
      .min(5, "Title must be at least 5 characters long")
      .max(100, "Title must be less than 100 characters"),
    body: z
      .string({ required_error: "Body is required" } as any)
      .min(10, "Body must be at least 10 characters long"),
    category: z
      .string({ required_error: "Category is required" } as any)
      .min(3, "Category must be at least 3 characters"),
  }),
});

export const updateArticleSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters long")
      .max(100, "Title must be less than 100 characters"),
    body: z
      .string()
      .min(10, "Body must be at least 10 characters long"),
    category: z
      .string()
      .min(3, "Category must be at least 3 characters"),
  }),
});

export const patchArticleSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters long")
      .max(100, "Title must be less than 100 characters")
      .optional(),
    body: z
      .string()
      .min(10, "Body must be at least 10 characters long")
      .optional(),
    category: z
      .string()
      .min(3, "Category must be at least 3 characters")
      .optional(),
  }),
});
