import { z } from 'zod';
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

export const subscribeSchema = z.object({
  email: z.email(),
});

export const loginSchema = z.object({
  email: z.email('Enter a valid email.'),
  password: z.string().min(6, 'Password is required.'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.email('Enter a valid email.'),
  password: z.string().min(6, 'Use at least 6 characters.'),
});

export const newsletterSchema = z.object({
  email: z.email('Enter a valid email address.'),
});
