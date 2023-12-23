import type { Message } from "$lib/core/entities/Message";
import { AddNewMessage, getMessagesDataAsArrayInSortedOrder } from "$lib/core/useCases/messageManagement";
import { FirebaseMessageAdapter } from "../adapters/firebaseMessageAdapter";
const firebaseAdapter = new FirebaseMessageAdapter;
// const addNewChatUseCase = new AddNewChat(firebaseAdapter);
// const getAllChatsWithUserAsParticipant = new getUserChats(firebaseAdapter);
const addInitialMessageUseCase = new AddNewMessage(firebaseAdapter);
const getMessagesOfIndividualChatInOrder = new getMessagesDataAsArrayInSortedOrder(firebaseAdapter);

export const addMessageToChat = async (message:Message,chatId:string):Promise<Message>=>{
    return await addInitialMessageUseCase.execute(message,chatId);
}

export const getMessagesOfIndividualChatOrdered = async (chatId:string):Promise<Array<Message>>=>{
    return await getMessagesOfIndividualChatInOrder.execute(chatId);
}