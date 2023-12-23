import type { Message } from "../entities/Message";
export interface MessageRepository {
    addNewMessage(message:Message,chatId:string): Promise<Message>;
    getMessagesDataAsArrayInSortedOrder(chatId:string):Promise<Array<Message>>;
    // getMessage(id:string):Promise<Message>;
    // Other methods like getChat, updateChat, deleteChat can be defined here
}
