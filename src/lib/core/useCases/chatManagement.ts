import type { serverTimestampType } from '../../../types';
import { Chat } from '../entities/Chat';
import type { ChatRepository } from '../repositories/chatRepository';

export class AddNewChat {
    private chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    async execute(participants: string[]): Promise<Chat> {
        const chat = new Chat({
            id: '', // ID should be generated by the repository or database
            participants: participants,
            createdAt: {} as serverTimestampType,
            lastMessage: {} as serverTimestampType,
            lastMessagePreview:'',
        });

        return await this.chatRepository.addChat(chat);
    }
}

export class GetUserChats{
    private chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    async execute(participant: string): Promise<Chat[]> {
        return await this.chatRepository.getChatsByParticipant(participant);
    }
}

export class UpdateLastMessagePreview {
    private chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    async execute(chatId:string,lastMessage: string): Promise<Chat> {
        // const chat = new Chat({
        //     id: '', // ID should be generated by the repository or database
        //     participants: participants,
        //     createdAt: new Date(),
        //     lastMessage: new Date(),
        //     lastMessagePreview:'',
        // });
        
        return await this.chatRepository.updateLastMessagePreviewOfChat(chatId,lastMessage);;
    }
}