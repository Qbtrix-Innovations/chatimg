export class User {
	username: string;
	email: string;
	phoneNumber: string;
	dateOfBirth: Date;
	profilePictureUrl: string;
	createdAt: Date;
	isPremium: boolean;
	subscriptionDetails: {
		startDate: Date;
		planType: 'basic' | 'ownAPI' | '20credits/day' | '60credits/day' | '120credits/day' | 'month';
		endDate: Date;
	};
	constructor({
		username,
		email,
		phoneNumber,
		dateOfBirth,
		profilePictureUrl,
		createdAt,
		isPremium,
		startDate,
		planType,
		endDate
	}: {
		username: string;
		email: string;
		phoneNumber: string;
		dateOfBirth: Date;
		profilePictureUrl: string;
		createdAt: Date;
		isPremium: boolean;
		startDate: Date;
		planType: 'basic' | 'ownAPI' | '20credits/day' | '60credits/day' | '120credits/day' | 'month';
		endDate: Date;
	}){
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.profilePictureUrl = profilePictureUrl || '';
        this.createdAt = createdAt || new Date();
        this.isPremium = isPremium;
        this.subscriptionDetails={
            startDate: startDate,
            planType:planType,
            endDate:endDate
        }
    };
}
