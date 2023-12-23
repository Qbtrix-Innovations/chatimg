// import { todoStore } from '../store/todoStore';
// import { AddToDo } from '$lib/core/useCases/AddToDo';
// import { GetAllToDos } from '$lib/core/useCases/GetAllToDos';
// import { FirebaseToDoRepository } from '$lib/core/repositories/FirebaseToDoRepository';
// import type { ToDoItem } from '$lib/core/entities/ToDoItem';
// import { todoStore } from '../store/toDoStore';
// import { MarkToDoComplete } from '$lib/core/useCases/MarkToDoComplete';

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

export const getChatsFromParticipantArray = async (participants:Array<string>):Promise<Chat[]>=>{
    return await getAllChatsWithUserAsParticipant.execute(participants);
}

export const updateLastMessagePreviewByChatById = async(chatId:string,lastMessage:string):Promise<Chat>=>{
    return await UpdateLastMessagePreviewById.execute(chatId,lastMessage);
}