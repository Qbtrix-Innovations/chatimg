import type { Chat } from '../entities/Chat';

export interface ChatRepository {
    addChat(chat: Chat): Promise<Chat>;
    // Other methods like getChat, updateChat, deleteChat can be defined here
}
