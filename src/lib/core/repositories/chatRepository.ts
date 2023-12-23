import type { Chat } from '../entities/Chat';

export interface ChatRepository {
    addChat(chat: Chat): Promise<Chat>;
    getChats():Promise<Array<Chat>>;
    getChatById(id:String):Promise<Chat>;
    getChatsByParticipants(participants:Array<String>):Promise<Array<Chat>>;
    updateLastMessagePreviewOfChat(chatId:string,lastMessage:string):Promise<Chat>;
    // Other methods like getChat, updateChat, deleteChat can be defined here
}
