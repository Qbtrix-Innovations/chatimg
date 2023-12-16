import { Chat } from '../entities/Chat';
import type { ChatRepository } from '../repositories/chatRepository';

export class StartChat {
    private chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    async execute(participants: string[]): Promise<Chat> {
        const chat = new Chat({
            id: '', // ID should be generated by the repository or database
            participants: participants,
            createdAt: new Date(),
            lastMessage: null
        });

        return await this.chatRepository.addChat(chat);
    }
}
