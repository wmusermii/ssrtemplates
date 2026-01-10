import { z } from 'zod';
export const loginValidatorSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/), // Alphanum + underscore, tolak number/injection
  password: z.string().min(8)
});
export type LoginInput = z.infer<typeof loginValidatorSchema>; // Type inference otomatis
