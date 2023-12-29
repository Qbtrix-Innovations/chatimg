import {z} from 'zod';
// import { ToDoItem } from '../../core/TS/TSentities/ToDoItem';
import type { User } from '$lib/core/entities/User';
const UserSchema = z.object({
	id:z.string(),
    userName: z.string().min(1,"Username is required"),
	email: z.string().email(),
	phoneNumber: z.string().min(10).max(10),
	dateOfBirth: z.date(),
	profilePictureUrl: z.string(),
	createdAt: z.date(),
	lastLogin:z.date(),
	isPremium:z.boolean().default(false),
	stripeCustomerId:z.string(),
	subscriptionDetails:z.object({
		sid:z.string(),
		startDate: z.date(),
		planType:  z.enum(['basic', 'ownAPI', '20credits/day', '60credits/day', '140credits/day', 'month']),
		endDate: z.date(),
		isActive:z.boolean(),
		totalCredits:z.number(),
		availableCredits:z.number(),
	}),
});

export function validateToDoItem(data: any): User {
  return UserSchema.parse(data);
}
