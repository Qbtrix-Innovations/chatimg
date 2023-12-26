import type { Subscription } from "./Subscription";

export class User {
	id:string;
	userName: string;
	email: string;
	phoneNumber: string;
	dateOfBirth: Date | null |string;
	profilePictureUrl: string;
	createdAt: Date;
	lastLogin:Date;
	isPremium: boolean;
	subscriptionDetails:Subscription;
	stripeCustomerId:string;
	constructor({
		id,
		userName,
		email,
		phoneNumber,
		dateOfBirth,
		profilePictureUrl,
		createdAt,
		isPremium,
		subscriptionDetails,
		stripeCustomerId,
		lastLogin,
	}: {
		id:string;
		userName: string;
		email: string;
		phoneNumber: string;
		dateOfBirth: Date;
		profilePictureUrl: string;
		createdAt: Date;
		lastLogin:Date;
		isPremium: boolean;
		subscriptionDetails:Subscription;
		stripeCustomerId:string
	}){
		this.id=id;
        this.userName = userName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
		this.lastLogin=lastLogin;
        this.profilePictureUrl = profilePictureUrl || '';
        this.createdAt = createdAt || new Date();
        this.isPremium = isPremium;
		this.subscriptionDetails=subscriptionDetails;
		this.stripeCustomerId=stripeCustomerId;
    };
}
