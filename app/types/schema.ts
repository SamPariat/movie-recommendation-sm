import * as z from 'zod';

const formFieldSchema = z.object({
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

export { formFieldSchema };
