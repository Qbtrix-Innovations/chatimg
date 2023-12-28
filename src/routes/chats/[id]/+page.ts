import { getMessagesOfIndividualChatOrdered } from '../../../services/messageServices';
import {getImagesOfIndividualChatOrdered} from '../../../services/imageService';
import type { Image } from '$lib/core/entities/Image';
import type { Message } from '$lib/core/entities/Message';
export const load:import('./$types').PageLoad = async({params})=>{
    let imagesData:Image[] = [];
    let MessagesData:Message[] = [];
    try {
        imagesData = await getImagesOfIndividualChatOrdered(params.id);
        MessagesData = await getMessagesOfIndividualChatOrdered(params.id);
        return {
            uid:params.id,
            imagesDataArray:imagesData,
            MessagesDataArray:MessagesData
        };
    } catch (error) {
        console.log(error);
    }
    console.log({
        uid:params.id,
        imagesDataArray:imagesData,
        MessagesDataArray:MessagesData
    });
    return {
        uid:params.id,
        imagesDataArray:imagesData,
        MessagesDataArray:MessagesData
    };
}