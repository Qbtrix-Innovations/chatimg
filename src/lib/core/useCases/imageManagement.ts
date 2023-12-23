// import { Chat } from '../entities/Chat';
// import type { ChatRepository } from '../repositories/chatRepository';
import type { Image } from '../entities/Image';
import type { ImageRepository } from '../repositories/imageRepository';
export class SaveImageForIndividualChat {
    private imageRepository: ImageRepository;

    constructor(imageRepository:ImageRepository) {
        this.imageRepository = imageRepository;
    }
    async execute(image:Image,chatId:string):Promise<void>{
        await this.imageRepository.saveImageForChat(image,chatId);
    }
}
export class GetImagesForIndChat{
    private imageRepository: ImageRepository;

    constructor(imageRepository:ImageRepository) {
        this.imageRepository = imageRepository;
    }
    
    async execute(chatId:string):Promise<Image[]>{
        return await this.imageRepository.getImagesByChatId(chatId);
    }
}
// export class UploadImage{
//     private imageRepository: ImageRepository;

//     constructor(imageRepository:ImageRepository) {
//         this.imageRepository = imageRepository;
//     }
    
//     async execute(email:string,file:File,uid:string,):Promise<Image>{
//         return await this.imageRepository.uploadImages(email,file,uid);
//     }
// }

export class SaveIndividualImageForIndividualChat{
    private imageRepository: ImageRepository;

    constructor(imageRepository:ImageRepository) {
        this.imageRepository = imageRepository;
    }
    
    async execute(image:Image,chatId:string):Promise<string>{
        return await this.imageRepository.saveIndividualImageAndReturnId(chatId,image);
    }
}

export class GetImageById{
    private imageRepository: ImageRepository;

    constructor(imageRepository:ImageRepository) {
        this.imageRepository = imageRepository;
    }
    
    async execute(imageId:string,chatId:string):Promise<Image>{
        return await this.imageRepository.getImageById(imageId,chatId);
    }
}


