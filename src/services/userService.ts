import type { User } from '$lib/core/entities/User';
import { AddNewUser, GetUserFromId,GetUserByStripeId } from '$lib/core/useCases/userManagement';
import { FirebaseUserAdapter } from '../adapters/firebaseUserAdapter';

const firebaseAdapter = new FirebaseUserAdapter();
const addUser = new AddNewUser(firebaseAdapter);
const getUserUseCase = new GetUserFromId(firebaseAdapter);
const getUserByStripeCustomerIdUseCase = new GetUserByStripeId(firebaseAdapter);

export const addNewUser = async (user: User): Promise<void> => {
	return await addUser.execute(user);
};
export const getUserById = async (userId: string): Promise<User> => {
	return await getUserUseCase.execute(userId);
};
export const getUserByStripeId = async (stripeId: string): Promise<User> => {
	return await getUserByStripeCustomerIdUseCase.execute(stripeId);
};
