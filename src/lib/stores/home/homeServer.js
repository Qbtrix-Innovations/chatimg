// // src/lib/checkStatus.js
// import { get } from "svelte/store"
// // import { applicationUnderReviewModal, user } from "./userStore"
// import {
//     addDoc,
//     arrayRemove,
//     arrayUnion,
//     collection,
//     deleteDoc,
//     doc,
//     getDoc,
//     getDocs,
//     onSnapshot,
//     orderBy,
//     limit,
//     query,
//     serverTimestamp,
//     setDoc,
//     updateDoc,
//     where,
// } from "firebase/firestore";
// import { db } from '$lib/services/firebase/firebase';
// // import { showApplyModal } from '../globalStore';
// // import { goto } from '$app/navigation';
// // import toast from "svelte-french-toast";
// // import { getUser } from "./userServer";
// // import { userData } from "../user/userStore";
// import { authStore } from "../userauth/authStore";

// export const getChats = async () => {
//     const currentUser = get(authStore); // Get the current value of the user store
//     // const exxtUser = get(userData)
//     if (currentUser.currentUser?.uid !== undefined) {
//         // console.log('uid', currentUser.currentUser.uid)
//         // console.log(userDataInstance);
//         const chatsRef = collection(db, "chats");
//         const actualQuery = query(chatsRef, where('participants', 'array-contains', currentUser.currentUser.uid));
//         /**
//          * to implement orderBy for timestamp we have to set firebase indexes further discussion required in this aspect.
//          */
//         // ,orderBy('lastMessage', 'desc')
//         const querySnapshot = await getDocs(actualQuery);
//         /**
//          * @type {any[]}
//          */
//         let chatsData = [];
//         querySnapshot.forEach((doc) => {
//             // Get each chat document's data
//             // const data = doc.data();
//             // Add the document ID to the data object
//             // data.id = doc.id;
//             // Add the data to the chats array
//             // chats.push(data);
//             const chatInfo = {
//                 id: doc.id,
//                 data: doc.data(),
//             };

//             // Update the chatData array
//             chatsData = [...chatsData, chatInfo];
//         });

//     }
// }