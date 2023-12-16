export class Chat {
    sentBy:string;
    sentAt:Date;
    text:string;
    isEdited:boolean;
    isDeleted:boolean;
    
    constructor({sentBy,sentAt,text,isEdited,isDeleted}:{    sentBy:string;
        sentAt:Date,
        text:string,
        isEdited:boolean,
        isDeleted:boolean,}){
            this.sentBy=sentBy;
            this.sentAt=new Date(sentAt)|| new Date();
            this.text=text;
            this.isEdited=isEdited || false;
            this.isDeleted=isDeleted || false;

    }
}
