export class Subscription {
	sid:string|null;
	startDate: Date;
	endDate: Date;
	planType: 'basic' | 'ownAPI' | '20credits/day' | '60credits/day' | '140credits/day' | 'month';
	isActive: boolean;
	totalCredits:number;
	availableCredits:number;

	constructor({
		sid,
		startDate,
		endDate,
		planType,
		isActive,
		totalCredits,
	}: {
		sid:string|null,
		startDate: Date;
		endDate: Date;
		planType: 'basic' | 'ownAPI' | '20credits/day' | '60credits/day' | '140credits/day' | 'month';
		isActive: boolean;
		totalCredits:number;
	}) {
		this.startDate = startDate || new Date();
		this.endDate = endDate || new Date(new Date().getTime() + 1 * 30 * 24 * 60 * 60 * 1000); //set default expiration date to 1 months from now
		this.planType = planType || 'basic';
		if (typeof isActive === 'undefined') {
			this.isActive = true;
		} else {
			this.isActive = isActive;
		}
		this.totalCredits=totalCredits;
		this.availableCredits=totalCredits;
		this.sid=sid;
	}
}
