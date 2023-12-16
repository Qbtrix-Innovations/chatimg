export class Chat {
    id: string;
    participants: string[];
    createdAt: Date;
    lastMessage: Date | null;
    isArchived: boolean;

    constructor({id, participants, createdAt, lastMessage, isArchived = false}:
                {id: string, participants: string[], createdAt: Date, lastMessage: Date | null, isArchived?: boolean}) {
        this.id = id;
        this.participants = participants;
        this.createdAt = createdAt;
        this.lastMessage = lastMessage;
        this.isArchived = isArchived;
    }
}
