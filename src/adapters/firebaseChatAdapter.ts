import type { ChatRepository } from '$lib/core/repositories/chatRepository';
import type { Chat } from '$lib/core/entities/Chat';
import { db } from '$lib/services/firebase/firebase';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
export class FirebaseChatAdapter implements ChatRepository {
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
		const actualQuery = query(
			chatsRef,
			orderBy('lastMessage')
		);
		const querySnapshot = await getDocs(actualQuery);
		let chats: Chat[]=[];
		querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
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
		let chats: Chat[]=[];
		querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
			const data = doc.data();
			data.id = doc.id;
			chats.push(data);
		});
        return chats;
	}
    
	async updateLastMessagePreviewOfChat(chatId: string,lastMessage:string): Promise<Chat> {
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
