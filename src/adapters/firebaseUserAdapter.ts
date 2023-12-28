import { db } from '$lib/firebase/firebase';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	where,
	type DocumentData
} from 'firebase/firestore';
import type { UserRepository } from '$lib/core/repositories/userRepository';
import type { User } from '$lib/core/entities/User';
import type { Subscription } from '$lib/core/entities/Subscription';
import type { serverTimestampType } from '../types';
export class FirebaseUserAdapter implements UserRepository {
	async addNewUser(user: User): Promise<void> {
		try {
			const userRef = await setDoc(doc(db, 'users', user.id), {
				id: user.id,
				stripeCustomerId: user.stripeCustomerId,
				userName: user.userName,
				email: user.email,
				phoneNumber: user.phoneNumber,
				dateOfBirth: user.dateOfBirth,
				profilePictureUrl: user.profilePictureUrl,
				createdAt: serverTimestamp(),
				lastLogin: serverTimestamp(),
				isPremium: false
			});
			const subRef = await addDoc(collection(db, `users/${user.id}/subscriptionDetails`), {
				startDate: user.subscriptionDetails.startDate,
				endDate: user.subscriptionDetails.endDate,
				planType: user.subscriptionDetails.planType,
				isActive: user.subscriptionDetails.isActive,
				totalCredits: user.subscriptionDetails.totalCredits,
				availableCredits: user.subscriptionDetails.availableCredits
			});
		} catch (error) {
			throw error;
		}
	}
	async getUserById(userId: string): Promise<User> {
		try {
			const userDoc = (await getDoc(doc(db, 'users', userId))).data() ;
			// console.log(userDoc);
			
			const subDocs = await getDocs(
				query(
					collection(db, 'users', userId, 'subscriptionDetails'),
					where('endDate', '>', new Date()),
					where('isActive', '==', true),
					orderBy('endDate'),
					orderBy('startDate', 'asc')
				)
			);
			const subs: Subscription[] = [];
			subDocs.forEach((doc) => {
				const data: Subscription = doc.data() as Subscription;
				subs.push(data);
			});
			if (subs.length===0) {
				subs.push({
					startDate: new Date(),
					endDate: new Date(new Date().getTime() + 1 * 30 * 24 * 60 * 60 * 1000),
					planType: 'basic',
					isActive: true,
					totalCredits: 3,
					availableCredits:3
				});
			}
			console.log(userDoc?.createdAt);
			
			const newUser: User = {
				id: userId,
				userName: userDoc?.userName,
				email: userDoc?.email,
				phoneNumber: userDoc?.phoneNumber,
				dateOfBirth: userDoc?.dateOfBirth,
				profilePictureUrl: userDoc?.profilePictureUrl,
				createdAt: new Date(userDoc?.createdAt.seconds * 1000),
				lastLogin: new Date(userDoc?.lastLogin.seconds * 1000),
				isPremium: userDoc?.isPremium,
				stripeCustomerId: userDoc?.stripeCustomerId,
				subscriptionDetails: {
					startDate: subs[0].startDate,
					endDate: subs[0].endDate,
					planType: subs[0].planType,
					isActive: subs[0].isActive,
					totalCredits: subs[0].totalCredits,
					availableCredits: subs[0].availableCredits
				}
			};
			console.log(newUser);
			return newUser;
		} catch (error) {
			throw error;
		}
	}
}
