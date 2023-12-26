import { FirebaseChatAdapter } from "../adapters/firebaseChatAdapter";
import {AddNewChat, GetUserChats, UpdateLastMessagePreview} from "$lib/core/useCases/chatManagement"
import type { Chat } from "$lib/core/entities/Chat";
const firebaseAdapter = new FirebaseChatAdapter();
const addNewChatUseCase = new AddNewChat(firebaseAdapter);
const getAllChatsWithUserAsParticipant = new GetUserChats(firebaseAdapter);
const UpdateLastMessagePreviewById = new UpdateLastMessagePreview(firebaseAdapter);

export const addNewChatService = async (participants:Array<string>): Promise<Chat> => {
    return await addNewChatUseCase.execute(participants);
};

export const getChatsFromParticipantId = async (participant:string):Promise<Chat[]>=>{
    return await getAllChatsWithUserAsParticipant.execute(participant);
}

export const updateLastMessagePreviewByChatById = async(chatId:string,lastMessage:string):Promise<Chat>=>{
    return await UpdateLastMessagePreviewById.execute(chatId,lastMessage);
}