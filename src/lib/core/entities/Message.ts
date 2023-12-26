import type { serverTimestampType } from '../../../types.js';

export class Message {
    sentBy:string;
    sentAt:serverTimestampType;
    text:string;
    isEdited:boolean;
    isDeleted:boolean;
    
    constructor({sentBy,sentAt,text,isEdited,isDeleted}:{    
        sentBy:string;
        sentAt:serverTimestampType,
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
