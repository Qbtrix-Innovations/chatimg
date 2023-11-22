import { writable } from 'svelte/store';
import { auth, db, googleProvider } from '../../services/firebase/firebase';
import { collection, doc, setDoc, getDoc, addDoc, Timestamp } from 'firebase/firestore';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, signOut, updatePassword, updateProfile } from 'firebase/auth';
import { userData } from '../user/userStore';
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
            *          dateOfBirth:Date|null|Timestamp,
            *          profilePictureUrl:string,
            *          createdAt:Date|null|Timestamp,
            *          lastLogin:Date|null|Timestamp, 
            *          isPremium:boolean,
            *          subscriptionDetails:{
            *                                  startDate:Date|null|Timestamp,
            *                                  endDate:Date|null|Timestamp,
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
                createdAt: Timestamp.fromDate(new Date()),
                lastLogin: Timestamp.fromDate(new Date()),
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
            console.log(userDoc);
            // update it in the store
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
            authStore.update((currState) => ({ ...currState,currentUser: userCredentials.user }));
        } catch (error) {
            console.log(error);
        }
    },
    logout: async () => {
        try {
            await signOut(auth);
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
    }
}