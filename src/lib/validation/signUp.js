import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits long" }).optional(),
  agreedToTerms: z.boolean().refine(val => val, { message: "You must agree to the terms and conditions" })
});