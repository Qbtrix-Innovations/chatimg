import {z} from 'zod';
// import { ToDoItem } from '../../core/TS/TSentities/ToDoItem';
import type { User } from '$lib/core/entities/User';
const UserSchema = z.object({
    username: z.string().min(1,"Username is required"),
	email: z.string().email(),
	phoneNumber: z.string().min(10).max(10),
	dateOfBirth: z.date(),
	profilePictureUrl: z.string(),
	createdAt: z.date(),
	isPremium:z.boolean().default(false),
	subscriptionDetails:z.object({
		startDate: z.date(),
		planType:  z.enum(['basic', 'ownAPI', '20credits/day', '60credits/day', '120credits/day', 'month']),
		endDate: z.date(),
	}),
});

export function validateToDoItem(data: any): User {
  return UserSchema.parse(data);
}
