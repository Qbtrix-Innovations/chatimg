import { writable } from 'svelte/store';
import { auth, db, googleProvider } from '../../services/firebase/firebase';
import { collection, doc, setDoc, getDoc, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, signOut, updatePassword, updateProfile } from 'firebase/auth';
import { userData } from '../user/userStore';
import { goto } from '$app/navigation';
/**
 * Svelte store to hold the Authentication Information.
 */
export const authStore = writable({
    /**
     * @type {boolean}
     */
    isLoading: true,
    /**
     * @type {import('firebase/auth').User|null}
     */
    currentUser: null,
});

export const authHandlers = {
    signup: async (
        /** @type {string} */ email,
        /** @type {string} */ password,
        /** @type {any} */ name,
        /** @type {{ 
         *          username: string; 
         *          email: string; 
         *          phoneNumber: null; 
         *          dateOfBirth: Date|null; 
         *          profilePictureUrl: null; 
         * }} */
        userInfoData
    ) => {
        try {
            let userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            let finalDay = new Date();
            finalDay.setMonth(finalDay.getMonth() + 6);
            // set the user doc
            /**
            * @type {{
            *          id:string,
            *          userName:string,
            *          email:string,
            *          phoneNumber:string,
            *          dateOfBirth:Date|null|Timestamp|serverTimestamp,
            *          profilePictureUrl:string,
            *          createdAt:Date|null|Timestamp|serverTimestamp,
            *          lastLogin:Date|null|Timestamp|serverTimestamp, 
            *          isPremium:boolean,
            *          subscriptionDetails:{
            *                                  startDate:Date|null|Timestamp|serverTimestamp,
            *                                  endDate:Date|null|Timestamp|serverTimestamp,
            *                                  planType:"basic"|"premium"
            *                               }
            *          }}
            */
            const userDoc = {
                id: userCredentials.user.uid,
                userName: userInfoData.username,
                email: userInfoData.email,
                phoneNumber: userInfoData.phoneNumber !== null ? userInfoData.phoneNumber : '',
                dateOfBirth: userInfoData.dateOfBirth !== null ? Timestamp.fromDate(userInfoData.dateOfBirth) : null,
                profilePictureUrl: userInfoData.profilePictureUrl !== null ? userInfoData.profilePictureUrl : '',
                createdAt: serverTimestamp,
                lastLogin: serverTimestamp,
                isPremium: false,
                subscriptionDetails: {
                    startDate: Timestamp.fromDate(new Date()),
                    endDate: Timestamp.fromDate(finalDay),
                    planType: "basic",
                },
            };
            await setDoc(doc(db, 'users', userCredentials.user.uid), userDoc);
            // get the user doc
            // const userDoc = await getDoc(doc(db, 'users', userCredentials.user.uid));
            // console.log(userDoc);
            // update it in the store
            // @ts-ignore
            userData.set(userDoc);
            authStore.update((currState) => ({ ...currState, currentUser: userCredentials.user }));
            // update the profile to include userName
            await updateProfile(userCredentials.user, { displayName: name });
            // reload the user to get updated user
            await userCredentials.user.reload();
            return userDoc;
        } catch (error) {
            console.log(error);
        }
    },
    login: async (
        /** @type {string} */ email,
        /** @type {string} */ password,
        /** @type {any} */ name,
        /** @type {{ 
         *          username: string; 
         *          email: string; 
         *          phoneNumber: null; 
         *          dateOfBirth: Date|null; 
         *          profilePictureUrl: null; 
         * }} */
        userInfoData) => {
        try {
            let userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, 'users', userCredentials.user.uid));
            // @ts-ignore
            userData.set(userDoc.data());
            authStore.update((currState) => ({ ...currState, currentUser: userCredentials.user }));
        } catch (error) {
            console.log(error);
        }
    },
    logout: async () => {
        try {
            console.log(auth.currentUser);
            await signOut(auth);
            console.log(auth.currentUser);
            userData.set({
                    id: '',
                    userName: '',
                    email: '',
                    phoneNumber: '',
                    dateOfBirth: null,
                    profilePictureUrl: '',
                    createdAt: null,
                    lastLogin: null,
                    isPremium: false,
                    subscriptionDetails: {
                        startDate: null,
                        endDate: null,
                        planType: "basic",
                    }
                }
            );
            authStore.set({
                isLoading: false,
                currentUser: null,
            });
            goto('/auth');
        } catch (error) {
            console.log(error);
        }
    },
    resetPassword: async (/** @type {string} */ email) => {
        await sendPasswordResetEmail(auth, email);
    },
    googleLogin: async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
        } catch (/**@type{any}*/error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        }
    },
    changePassword: async (/** @type {string} */ newPassword) => {
        try {
            let user;
            let unsubscribe = authStore.subscribe((state) => {
                user = state.currentUser;
                console.log(user);
            });
            // Check if the user is signed in
            if (user) {
                console.log(newPassword);
                await updatePassword(user, newPassword);

                console.log("Password updated successfully!");
            } else {
                console.error("User not signed in.");
            }
        } catch (err) {
            // @ts-ignore
            console.error("Error updating password:", err.message);
        }
    }
}