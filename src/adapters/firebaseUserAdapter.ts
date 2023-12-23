import { db } from '$lib/services/firebase/firebase';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	where
} from 'firebase/firestore';
import type { UserRepository } from '$lib/core/repositories/userRepository';
import type { User } from '$lib/core/entities/User';
export class FirebaseUserAdapter implements UserRepository  {
    async addNewUser(user: User): Promise<User> {

        throw new Error('Method not implemented.');
    }
    async getUserById(userId: string): Promise<User> {
        
        throw new Error('Method not implemented.');
    }
	
}
