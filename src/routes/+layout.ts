import { authStore } from "$lib/stores/userauth/authStore.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "$lib/firebase/firebase";
import { get } from "svelte/store"
import { userData } from "$lib/stores/user/userStore";
import checkStatus from "$lib/stores/user/initialNavigation";

export async function load({ }) {
    try {
        onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                authStore.update((currState)=>{
                    return {...currState,isLoading:false,currentUser:authUser}
                });
                checkStatus()
            } else {
                authStore.update((currState)=>{
                    return {...currState,isLoading:false}
                });
            }
        });
        return {
            status: "success",
            user: get(userData),
        }

    } catch (error) {
        return {
            status: `something went wrong ${error}`,
        };
    }
}