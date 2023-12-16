export class Subscription {
	userID: string;
	startDate: Date;
	endDate: Date;
	planType: 'basic' | 'ownAPI' | '20credits/day' | '60credits/day' | '120credits/day' | 'month';
	isActive: boolean;

	constructor({
		userID,
		startDate,
		endDate,
		planType,
		isActive
	}: {
		userID: string;
		startDate: Date;
		endDate: Date;
		planType: 'basic' | 'ownAPI' | '20credits/day' | '60credits/day' | '120credits/day' | 'month';
		isActive: boolean;
	}) {
		this.userID = userID;
		this.startDate = startDate || new Date();
		this.endDate = endDate || new Date(new Date().getTime() + 1 * 30 * 24 * 60 * 60 * 1000); //set default expiration date to 3 months from now
		this.planType = planType || 'basic';
		if (typeof isActive === 'undefined') {
			this.isActive = true;
		} else {
			this.isActive = isActive;
		}
	}
}
