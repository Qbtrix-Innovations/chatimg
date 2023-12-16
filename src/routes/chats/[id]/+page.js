import { db } from '$lib/services/firebase/firebase';
import { error } from '@sveltejs/kit';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
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
        const imgQuerySnap = query(collection(db, `chats/${params.id}/images`),orderBy('uploadedAt','asc'))
        const querySnapshot = await getDocs(imgQuerySnap);
        // Extract data from query snapshot
        imagesData = querySnapshot.docs.map((doc) => doc.data());
        const querySnap = query(collection(db, `chats/${params.id}/messages`),orderBy('sentAt','asc'));
        const querySnapshotMsg = await getDocs(querySnap);
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