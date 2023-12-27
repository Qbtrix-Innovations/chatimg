import { db } from '$lib/firebase/firebase';
import { error } from '@sveltejs/kit';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { getMessagesOfIndividualChatOrdered } from '../../../services/messageServices';
import {getImagesOfIndividualChatOrdered} from '../../../services/imageService';
// /** 
//  * @type {import('./$types').PageLoad} 
//  * */
export const load = async({params})=>{
    /**
     * @type {import("../../../lib/core/entities/Image").Image[]}
     */
    let imagesData = [];
    
    /**
     * @type {import("../../../lib/core/entities/Message").Message[]}
     */
    let MessagesData = [];
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