import type firebase from "firebase/compat/app";
export type FirestoreTimestamp = firebase.firestore.Timestamp;
export class Image {
	uploadedBy: string;
	uploadedAt: FirestoreTimestamp;
	imageUrl: string;
	thumbnailUrl: string;
	fileSize: number;
	fileType: string;
	metadata?: {
		tags: string[];
		description?: string;
		geolocation: {
			latitude: string;
			longitude: string;
		};
	};
	constructor({
		uploadedBy,
		uploadedAt,
		imageUrl,
		thumbnailUrl,
		fileSize,
		fileType,
		tags,
		description,
		latitude,
		longitude
	}: {
		uploadedBy: string;
		uploadedAt: FirestoreTimestamp;
		imageUrl: string;
		thumbnailUrl: string;
		fileSize: number;
		fileType: string;
		tags: string[];
		description?: string;
		latitude: string;
		longitude: string;
	}) {
		this.uploadedBy = uploadedBy;
		this.uploadedAt = uploadedAt;
		this.imageUrl = imageUrl;
		this.thumbnailUrl = thumbnailUrl;
		this.fileSize = fileSize;
		this.fileType = fileType;
		this.metadata = {
			tags: tags,
			description: description,
			geolocation: {
				latitude: latitude,
				longitude: longitude
			}
		};
	}
}
