import type { Message } from "../entities/Message";
import type { MessageRepository } from "../repositories/messageRepository";

export class AddNewMessage {
    private messageRepository: MessageRepository;

    constructor(messageRepository: MessageRepository) {
        this.messageRepository = messageRepository;
    }

    async execute(message:Message,chatId:string): Promise<Message> {
        return await this.messageRepository.addNewMessage(message,chatId);
    }
}

export class getMessagesDataAsArrayInSortedOrder {
    private messageRepository: MessageRepository;

    constructor(messageRepository: MessageRepository) {
        this.messageRepository = messageRepository;
    }

    async execute(chatId:string): Promise<Array<Message>> {
        return await this.messageRepository.getMessagesDataAsArrayInSortedOrder(chatId);
    }
}

