// src/lib/checkStatus.js
import { get } from "svelte/store"
// import { applicationUnderReviewModal, user } from "./userStore"
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from '$lib/services/firebase/firebase';
// import { showApplyModal } from '../globalStore';
import { goto } from '$app/navigation';
import toast from "svelte-french-toast";
// import { getUser } from "./userServer";
import { userData } from "./userStore";
import { authStore } from "../userauth/authStore";

// Function to check the user's application status
async function checkStatus() {
  // console.log('Cheking status...')
  // await getUser(get(userData).id)
  const currentUser = get(authStore); // Get the current value of the user store
  if (currentUser.currentUser!==null) {
    const userDoc = await getDoc(doc(db, 'users', currentUser.currentUser.uid));
    // @ts-ignore
    userData.set(userDoc.data());
    console.log(userData);
  }
  
  const userDataInstance = get(userData);
  if (currentUser.currentUser?.uid !== undefined) {
    // console.log('uid', currentUser.currentUser.uid)
    // console.log(userDataInstance);
    const chatsRef = collection(db, "chats");
    const actualQuery = query(chatsRef, where('participants', 'array-contains', currentUser.currentUser.uid),orderBy('lastMessage'));
    /**
     * to implement orderBy for timestamp we have to set firebase indexes further discussion required in this aspect.
     */
    // ,orderBy('lastMessage', 'desc')
    const querySnapshot = await getDocs(actualQuery);
    /**
     * @type {import("@firebase/firestore").DocumentData[]}
     */
    const chats = [];
    querySnapshot.forEach((doc) => {
      // Get each chat document's data
      const data = doc.data();
      // Add the document ID to the data object
      data.id = doc.id;
      // Add the data to the chats array
      chats.push(data);
    });
    chats.forEach((chat)=>{
      console.log(chat);
    })
/**
 * To do set chats store asap.
 */

    // if the user has previous chats then we go to chats page where his chat history will be displayed.
    // otherwise the user will go to new chat page.
    if (chats.length > 0) {
      // goto('/payment/cancel')
      goto('/home');
    } else {
      goto('/newChat');
    }
  } else {
    toast(`Signup/Login failed`, {
      icon: '❌',
    });
    goto('/auth')
  }
}

export default checkStatus;