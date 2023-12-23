import * as z from 'zod';

const authFormSchema = z.object({
  email: z.string().email({
    message: 'Email must be valid',
  }),
  password: z.string().min(7, {
    message: 'Password must be at least 7 characters',
  }),
});

type AuthFormData = z.infer<typeof authFormSchema>;

const registerFormSchema = z
  .object({
    email: z.string().email({
      message: 'Email must be valid',
    }),
    password: z.string().min(7, {
      message: 'Password must be at least 7 characters',
    }),
    confirmPassword: z.string().min(7, {
      message: 'Confirmed password must be at least 7 characters',
    }),
    name: z.string().min(3, {
      message: 'Name must be at least 3 characters',
    }),
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    {
      message: 'Confirmed password and password must match',
      path: ['confirmPassword'],
    }
  );

type RegisterFormData = z.infer<typeof registerFormSchema>;

const reviewFormSchema = z.object({
  review: z.string().min(25, {
    message: 'Review must be at least 25 characters',
  }),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export { authFormSchema, registerFormSchema, reviewFormSchema };
export type { AuthFormData, RegisterFormData, ReviewFormData };
