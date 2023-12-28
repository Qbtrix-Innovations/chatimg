// src/lib/checkStatus.js
import { get } from "svelte/store"
import { goto } from '$app/navigation';
import toast from "svelte-french-toast";
import { userData } from "./userStore";
import { authStore } from "../userauth/authStore";
import type { Chat } from "$lib/core/entities/Chat";
import { getChatsFromParticipantId } from "../../../services/chatService";
import { getUserById } from "../../../services/userService";

// Function to check the user's application status
async function checkStatus() {
  // Get the current value of the user store
  const currentUser = get(authStore); 
  if (currentUser.currentUser!==null) {
    const userDoc = await getUserById(currentUser.currentUser.uid);
    // @ts-ignore
    userData.set(userDoc);
  }

  // const userDataInstance = get(userData);
  if (currentUser.currentUser?.uid !== undefined) {
    const chats:Chat[] = await getChatsFromParticipantId(currentUser.currentUser.uid);
    // if the user has previous chats then we go to chats page where his chat history will be displayed.
    // otherwise the user will go to new chat page.
    if (chats.length > 0) {
      goto('/home');
    } else {
      goto('/');
    }
  } else {
    toast(`Signup/Login failed`, {
      icon: '❌',
    });
    goto('/auth')
  }
}

export default checkStatus;