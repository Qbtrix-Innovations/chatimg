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
import { db } from '$lib/firebase/firebase';
import { goto } from '$app/navigation';
import toast from "svelte-french-toast";
import { userData } from "./userStore";
import { authStore } from "../userauth/authStore";
import type { User } from "$lib/core/entities/User";
import type { Chat } from "$lib/core/entities/Chat";
import { getChatsFromParticipantId } from "../../../services/chatService";
import { getUserById } from "../../../services/userService";

// Function to check the user's application status
async function checkStatus() {
  const currentUser = get(authStore); // Get the current value of the user store
  if (currentUser.currentUser!==null) {
    // const userDoc = await getDoc(doc(db, 'users', currentUser.currentUser.uid));
    // userData.set(userDoc.data() as User);
    // userData.subscribe((l)=>{console.log(l);})
    const userDoc = await getUserById(currentUser.currentUser.uid);

    userData.set(userDoc);
  }

  const userDataInstance = get(userData);
  if (currentUser.currentUser?.uid !== undefined) {
    // const chatsRef = collection(db, "chats");
    // const actualQuery = query(chatsRef, where('participants', 'array-contains', currentUser.currentUser.uid),orderBy('lastMessage'));

    // const querySnapshot = await getDocs(actualQuery);
    // const chats: import("@firebase/firestore").DocumentData[] = [];
    // querySnapshot.forEach((doc) => {
    //   // Get each chat document's data
    //   const data = doc.data();
    //   // Add the document ID to the data object
    //   data.id = doc.id;
    //   // Add the data to the chats array
    //   chats.push(data);
    // });
    // chats.forEach((chat)=>{
    //   console.log(chat);
    // })
    const chats:Chat[] = await getChatsFromParticipantId(currentUser.currentUser.uid);
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