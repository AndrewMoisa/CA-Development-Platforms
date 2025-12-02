import { z } from "zod";

const userCore = {
  username: z
    .string({
      message: "Username must be a string",
    })
    .min(1, "Username cannot be empty"),
  email: z.email({ message: "Invalid email address" }),
};

export const createUserSchema = z.object({
  body: z.object({
    ...userCore,
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "User ID must be a number"),
  }),
  body: z.object({
    ...userCore,
  }),
});

export const patchUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "User ID must be a number"),
  }),
  body: z
    .object({
      username: userCore.username.optional(),
      email: userCore.email.optional(),
    })
    .refine((data) => data.username || data.email, {
      message: "At least one field (username or email) is required",
    }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "User ID must be a number"),
  }),
});
