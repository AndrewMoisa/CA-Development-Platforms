import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must not exceed 50 characters"),
    email: z.email("Email must be a valid email"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character"
      ),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Email must be a valid email"),
    password: z.string(),
  }),
});
