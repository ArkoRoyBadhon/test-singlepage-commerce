import { z } from 'zod'

export const adminCreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(11, 'Phone must be at least 11 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN']),
})

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>
