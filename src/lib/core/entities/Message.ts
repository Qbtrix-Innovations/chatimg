import type { serverTimestamp } from '../../../../types.ts';

export class Message {
    sentBy:string;
    sentAt:serverTimestamp;
    text:string;
    isEdited:boolean;
    isDeleted:boolean;
    
    constructor({sentBy,sentAt,text,isEdited,isDeleted}:{    
        sentBy:string;
        sentAt:serverTimestamp,
        text:string,
        isEdited:boolean,
        isDeleted:boolean,}){
            this.sentBy=sentBy;
            this.sentAt=sentAt;
            this.text=text;
            this.isEdited=isEdited || false;
            this.isDeleted=isDeleted || false;

    }
}
