import * as z from 'zod';

const authFormSchema = z.object({
  email: z.string().email({
    message: 'Email must be valid',
  }),
  password: z.string().min(7, {
    message: 'Password must be at least 7 characters',
  }),
  name: z
    .union([
      z.string().length(0),
      z.string().min(3, {
        message: 'Name must be at least 3 characters',
      }),
    ])
    .optional(),
});

type AuthFormData = z.infer<typeof authFormSchema>;

const reviewFormSchema = z.object({
  review: z.string().min(25, {
    message: 'Review must be at least 25 characters',
  }),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export { authFormSchema, reviewFormSchema };
export type { AuthFormData, ReviewFormData };
