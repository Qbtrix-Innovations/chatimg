// import type { Timestamp } from "firebase/firestore";
import { writable } from 'svelte/store';
const initialData: {
	id: string;
	stripeCustomerId: string;
	userName: string;
	email: string;
	phoneNumber: string;
	dateOfBirth: null | Date | import('firebase/firestore').Timestamp | string;
	profilePictureUrl: string;
	createdAt: null | Date | import('firebase/firestore').Timestamp;
	lastLogin: null | Date | import('firebase/firestore').Timestamp;
	isPremium: false;
	subscriptionDetails: {
		sid:string|null;
		startDate: null | Date | import('firebase/firestore').Timestamp;
		endDate: null | Date | import('firebase/firestore').Timestamp;
		planType: 'basic' | 'ownAPI' | '20credits/day' | '60credits/day' | '120credits/day' | 'month';
		isActive: boolean;
		totalCredits: number;
		availableCredits: number;
	};
} = {
	id: '',
	stripeCustomerId: '',
	userName: '',
	email: '',
	phoneNumber: '',
	dateOfBirth: null,
	profilePictureUrl: '',
	createdAt: null,
	lastLogin: null,
	isPremium: false,
	subscriptionDetails: {
		sid:null,
		startDate: null,
		endDate: null,
		planType: 'basic',
		isActive: true,
		totalCredits: 3,
		availableCredits: 3
	}
};
export const userData = writable(initialData);
