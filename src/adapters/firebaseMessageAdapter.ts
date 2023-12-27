import { db } from '$lib/firebase/firebase';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	where
} from 'firebase/firestore';
import type { MessageRepository } from '$lib/core/repositories/messageRepository';
import type { Message } from '$lib/core/entities/Message';
export class FirebaseMessageAdapter implements MessageRepository {
	async addNewMessage(message: Message,chatId:string): Promise<Message> {
		const messagesRef = await addDoc(collection(db, `chats/${chatId}/messages`), {
			isDeleted: message.isDeleted,
			isEdited: message.isEdited,
			sentAt: serverTimestamp(),
			sentBy: message.sentBy,
			text: message.text
		});
        const messageRef2 = (await getDoc(doc(db, `chats/${chatId}/messages/${messagesRef.id}`))).data();
        return messageRef2 as Message;
	}
	async getMessagesDataAsArrayInSortedOrder(chatId:string):Promise<Array<Message>>{
		const querySnap = query(collection(db, `chats/${chatId}/messages`), orderBy('sentAt', 'asc'));
		const querySnapshotMsg = await getDocs(querySnap);
		// Extract data from query snapshot
		const MessagesData = querySnapshotMsg.docs.map((doc) => doc.data());
		return MessagesData as Array<Message>;
	}
}
