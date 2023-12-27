import type { ChatRepository } from '$lib/core/repositories/chatRepository';
import type { Chat } from '$lib/core/entities/Chat';
import { db } from '$lib/services/firebase/firebase';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where
} from 'firebase/firestore';
import type { Image } from '$lib/core/entities/Image';
export class FirebaseChatAdapter implements ChatRepository {
	async getChatWithIdMessageImageFormat(
		participantId: string
	): Promise<{ id: string; data: Chat; images: Image[] }[]> {
		try {
			let chatData: Array<{ id: string; data: Chat; images: Image[] }> = [];
			const chatsCollection = collection(db, 'chats');
			// Query to find chat documents where participants array contains the user ID
			const id = participantId;
			const q = query(
				chatsCollection,
				where('participants', 'array-contains', id),
				orderBy('lastMessage', 'asc')
			);
			const querySnapshot = await getDocs(q);
			// Iterate through the chat documents
			querySnapshot.forEach((chatDoc) => {
				// Extract data from the main chat document
				const chatInfo = {
					id: chatDoc.id,
					data: chatDoc.data() as Chat,
					images: []
				};
				// Update the chatData array
				chatData.push(chatInfo);
			});

			async function asyncForEach(
				array: string | any[],
				callback: { (chat: any): Promise<void>; (arg0: any, arg1: number, arg2: any): any }
			) {
				for (let index = 0; index < array.length; index++) {
					await callback(array[index], index, array);
				}
			}
			await asyncForEach(chatData, async (chat) => {
				const imagesCollectionRef = collection(chatsCollection, chat.id, 'images');
				const q2 = query(imagesCollectionRef, orderBy('uploadedAt', 'asc'));
				const imagesQuerySnapshot = await getDocs(q2);
				const imagesData = imagesQuerySnapshot.docs.map((imageDoc) => imageDoc.data());
				chat.images = imagesData;
			});
			return chatData;
		} catch (error) {
			throw error;
		}
	}
	async addChat(chat: Chat): Promise<Chat> {
		let chatsRet: Chat = chat;
		try {
			const chatsRef = await addDoc(collection(db, `chats`), {
				participants: chat.participants,
				createdAt: serverTimestamp(),
				lastMessage: serverTimestamp(),
				lastMessagePreview: chat.lastMessagePreview,
				isArchived: chat.isArchived
			});
			const docSnapshot = await getDoc(doc(db, `chats/${chatsRef.id}`));
			if (docSnapshot.exists()) {
				chatsRet = { id: docSnapshot.id, ...docSnapshot.data() } as Chat;
			} else {
				console.error('Document does not exist');
			}
		} catch (err) {
			console.log(err);
			console.log('There was an error in saving your information');
		}
		return chatsRet;
	}

	async getChatById(id: String): Promise<Chat> {
		let chatRet: Chat;
		try {
			const docSnapshot = await getDoc(doc(db, `chats/${id}`));
			if (docSnapshot.exists()) {
				chatRet = { id: docSnapshot.id, ...docSnapshot.data() } as Chat;
			} else {
				console.error('Document does not exist');
			}
		} catch (err) {
			console.log(err);
		}
		// @ts-ignore
		return chatRet as Chat;
	}

	async getChats(): Promise<Chat[]> {
		const chatsRef = collection(db, 'chats');
		const actualQuery = query(chatsRef, orderBy('lastMessage'));
		const querySnapshot = await getDocs(actualQuery);
		let chats: Chat[] = [];
		querySnapshot.forEach((doc: { data: () => any; id: any }) => {
			// Get each chat document's data
			const data = doc.data();
			// Add the document ID to the data object
			data.id = doc.id;
			// Add the data to the chats array
			chats.push(data);
		});
		return chats;
	}

	async getChatsByParticipant(participant: String): Promise<Chat[]> {
		const chatsRef = collection(db, 'chats');
		const actualQuery = query(
			chatsRef,
			where('participants', 'array-contains', participant),
			orderBy('lastMessage')
		);
		const querySnapshot = await getDocs(actualQuery);
		let chats: Chat[] = [];
		querySnapshot.forEach((doc: { data: () => any; id: any }) => {
			const data = doc.data();
			data.id = doc.id;
			chats.push(data);
		});
		return chats;
	}

	async updateLastMessagePreviewOfChat(chatId: string, lastMessage: string): Promise<Chat> {
		const retVal = await updateDoc(doc(db, `chats`, chatId), {
			lastMessagePreview: lastMessage,
			lastMessage: serverTimestamp()
		});
		let chatRet: Chat;
		try {
			const docSnapshot = await getDoc(doc(db, `chats/${chatId}`));
			if (docSnapshot.exists()) {
				chatRet = { id: docSnapshot.id, ...docSnapshot.data() } as Chat;
			} else {
				console.error('Document does not exist');
			}
		} catch (err) {
			console.log(err);
		}
		// @ts-ignore
		return chatRet;
	}
}
