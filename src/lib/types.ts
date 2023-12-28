import type firebase from "firebase/compat/app";

export type serverTimestampType = firebase.firestore.Timestamp;
export type Subscription={
    // userID: string;
	startDate: Date;
	endDate: Date;
	planType: 'basic' | 'ownAPI' | '20credits/day' | '60credits/day' | '120credits/day' | 'month';
	isActive: boolean;
	totalCredits:number;
	availableCredits:number;
}
export type User={
    username: string;
	email: string;
	phoneNumber: string;
	dateOfBirth: Date;
	profilePictureUrl: string;
	createdAt: Date;
	isPremium: boolean;
	subscriptionId:string;
	stripeCustomerId:string;
}