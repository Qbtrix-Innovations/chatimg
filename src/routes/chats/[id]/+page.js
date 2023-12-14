import { db } from '$lib/services/firebase/firebase';
import { error } from '@sveltejs/kit';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
// /** 
//  * @type {import('./$types').PageLoad} 
//  * */
export const load = async({params})=>{
    /**
     * @type {import("@firebase/firestore").DocumentData[]}
     */
    let imagesData = [];
    /**
     * @type {import("@firebase/firestore").DocumentData[]}
     */
    let MessagesData = [];
    try {
        console.log(params.id);
        const querySnapshot = await getDocs(collection(db, `chats/${params.id}/images`));
        // Extract data from query snapshot
        imagesData = querySnapshot.docs.map((doc) => doc.data());
        const querySnapshotMsg = await getDocs(collection(db, `chats/${params.id}/messages`));
        // Extract data from query snapshot
        MessagesData = querySnapshotMsg.docs.map((doc) => doc.data());
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