import type { Chat } from '../entities/Chat';
import type { Image } from '../entities/Image';

export interface ChatRepository {
    addChat(chat: Chat): Promise<Chat>;
    getChats():Promise<Array<Chat>>;
    getChatById(id:String):Promise<Chat>;
    getChatsByParticipant(participants:String):Promise<Array<Chat>>;
    getChatWithIdMessageImageFormat(participantId:string):Promise<Array<{id:string,data:Chat,images:Array<Image>}>>;
    updateLastMessagePreviewOfChat(chatId:string,lastMessage:string):Promise<Chat>;
    // Other methods like getChat, updateChat, deleteChat can be defined here
}
