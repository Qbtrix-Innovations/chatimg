import type { serverTimestampType } from '../../types.js';
export class Chat {
	id: string;
	participants: string[];
	createdAt: serverTimestampType;
	lastMessage: serverTimestampType;
	isArchived: boolean;
	lastMessagePreview: string;
	constructor({
		id,
		participants,
		createdAt,
		lastMessage,
		isArchived = false,
		lastMessagePreview = ''
	}: {
		id: string;
		participants: string[];
		createdAt: serverTimestampType;
		lastMessage: serverTimestampType;
		isArchived?: boolean;
		lastMessagePreview: string;
	}) {
		this.id = id;
		this.participants = participants;
		this.createdAt = createdAt;
		this.lastMessage = lastMessage;
		this.isArchived = isArchived;
		this.lastMessagePreview = lastMessagePreview;
	}
}
