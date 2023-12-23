import type { Image } from '../entities/Image';

export interface ImageRepository {
	saveImageForChat(image: Image, chatId: string): Promise<void>;
	getImagesByChatId(ChatId: string): Promise<Image[]>;
	// uploadImages(
	// 	email: string,
	// 	file: File,
	// 	uid: string
	// ): Promise<Image>;
	getImageById(imageId:string,chatId:string):Promise<Image>;
	saveIndividualImageAndReturnId(chatId:string,image:Image):Promise<string>;
	// getImages():Promise<Image>;
	// saveProfileImage(url:string):Promise<Image>;
	// getProfileImage():Promise<Image>
}
