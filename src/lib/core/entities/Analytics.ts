export class Analytics {
	userID: string;
	date: Date;
	dailyChatsCount: number;
	hourlyApiCllsCount: number;

	constructor({
		userID,
		date,
		dailyChatsCount,
		hourlyApiCllsCount
	}: {
		userID: string;
		date: Date;
		dailyChatsCount: number;
		hourlyApiCllsCount: number;
	}) {
		this.userID = userID;
		this.date = date;
		this.dailyChatsCount = dailyChatsCount;
		this.hourlyApiCllsCount = hourlyApiCllsCount;
	}
}
