import type { Image } from '$lib/core/entities/Image';
import {
	GetImageById,
	GetImagesForIndChat,
	SaveImageForIndividualChat,
	SaveIndividualImageForIndividualChat,
} from '$lib/core/useCases/imageManagement';
import { FirebaseImageAdapter } from '../adapters/firebaseImageAdapter';

const firebaseAdapter = new FirebaseImageAdapter();

const SaveImageForIndividualChatUseCase = new SaveImageForIndividualChat(firebaseAdapter);
const GetImagesForIndChatUseCase = new GetImagesForIndChat(firebaseAdapter);
// const uploadImageForIndividualChat = new UploadImage(firebaseAdapter);
const GetIndividualImageUseCase = new GetImageById(firebaseAdapter);
const SaveIndividualImageForIndividualChatUseCase= new SaveIndividualImageForIndividualChat(firebaseAdapter);

export const addImageToChatService = async (image: Image, chatId: string): Promise<Image[]> => {
	await SaveImageForIndividualChatUseCase.execute(image, chatId);
	return await GetImagesForIndChatUseCase.execute(chatId);
};

// export const uploadImages = async (email: string,file: File,uid: string): Promise<Image> => {
// 	return await uploadImageForIndividualChat.execute(email,file,uid);
// };

export const getImagesOfIndividualChatOrdered = async (chatId:string):Promise<Array<Image>>=>{
	return await GetImagesForIndChatUseCase.execute(chatId);
}
export const addIndividualImageToChatService = async (image:Image,chatId:string):Promise<Image>=>{
	const imageId = await SaveIndividualImageForIndividualChatUseCase.execute(image, chatId);
	return await GetIndividualImageUseCase.execute(imageId,chatId);
}