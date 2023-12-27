import { FirebaseChatAdapter } from "../adapters/firebaseChatAdapter";
import {AddNewChat, GetUserChats, UpdateLastMessagePreview,getChatAsIdMessageImageFormat} from "$lib/core/useCases/chatManagement"
import type { Chat } from "$lib/core/entities/Chat";
import type { Image } from "$lib/core/entities/Image";
const firebaseAdapter = new FirebaseChatAdapter();
const addNewChatUseCase = new AddNewChat(firebaseAdapter);
const getAllChatsBasedOnParticipantIdUseCase = new GetUserChats(firebaseAdapter);
const UpdateLastMessagePreviewUseCase = new UpdateLastMessagePreview(firebaseAdapter);
const getChatFormattedAsIdDataImageUseCase = new getChatAsIdMessageImageFormat(firebaseAdapter)
export const addNewChatService = async (participants:Array<string>): Promise<Chat> => {
    return await addNewChatUseCase.execute(participants);
};

export const getChatsFromParticipantId = async (participant:string):Promise<Chat[]>=>{
    return await getAllChatsBasedOnParticipantIdUseCase.execute(participant);
}

export const updateLastMessagePreviewByChatById = async(chatId:string,lastMessage:string):Promise<Chat>=>{
    return await UpdateLastMessagePreviewUseCase.execute(chatId,lastMessage);
}

export const getChatAsIdDataImageInSortedOrder = async (participantId:string):Promise<Array<{id:string,data:Chat,images:Array<Image>}>>=>{
    return await getChatFormattedAsIdDataImageUseCase.execute(participantId);
}