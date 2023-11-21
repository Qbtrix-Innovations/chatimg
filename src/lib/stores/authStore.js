import { writable } from 'svelte/store';
import { auth, db, googleProvider } from '../services/firebase/firebase';
import { collection, doc, setDoc, getDoc, addDoc, Timestamp } from 'firebase/firestore';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, signOut, updatePassword, updateProfile } from 'firebase/auth';
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
    /**
     * @type {{
     *          userName:string,
     *          email:string,
     *          phoneNumber:string|null,
     *          dateOfBirth:Date|null,
     *          profilePictureUrl:string|null,
     *          createdAt:Date|null,
     *          lastLogin:Date|null, 
     *          isPremium:boolean,
     *          subscriptionDetails:{
     *                                  startDate:Date|null,
     *                                  endDate:Date|null,
     *                                  planType:'basic'|'premium'
     *                               }
     *          }}
     */
    userInfo: {
        userName: '',
        email: '',
        phoneNumber: null,
        dateOfBirth: null,
        profilePictureUrl: null,
        createdAt: null,
        lastLogin: null,
        isPremium: false,
        subscriptionDetails: {
            startDate: null,
            endDate: null,
            planType: 'basic',
        }
    }
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
        userData
    ) => {
        try {
            let userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            let finalDay = new Date();
            finalDay.setMonth(finalDay.getMonth() + 6);
            // set the user doc
            await setDoc(doc(db, 'users', userCredentials.user.uid), {
                username: userData.username,
                email: userData.email,
                phoneNumber: userData.phoneNumber || null,
                dateOfBirth: userData.dateOfBirth!==null ? Timestamp.fromDate(userData.dateOfBirth) : null,
                profilePictureUrl: userData.profilePictureUrl || null,
                createdAt: Timestamp.fromDate(new Date()),
                lastLogin: Timestamp.fromDate(new Date()),
                isPremium: false,
                subscriptionDetails: {
                    startDate: Timestamp.fromDate(new Date()),
                    endDate: Timestamp.fromDate(finalDay),
                    planType: 'basic',
                },
            });
            // get the user doc
            const userDoc = await getDoc(doc(db, 'users', userCredentials.user.uid));
            console.log(userDoc.data());
            // update it in the store
            // @ts-ignore
            authStore.update((currState) => ({ ...currState, userInfo: userDoc.data() ,currentUser:userCredentials.user}));
            /**
             * DON'T under any circumstances move the updateProfile function above . 
             * If it runs before setDoc and get Doc and authstore.update
             * then the onMount function which subscribes to auth(from firebase getAuth) store only when auth's state changes will run 
             * and this will then trigger the if condition present in handleAuth function present at Auth route 
             * which will open a new page of NewChat before the user is created in firestore database . 
             * because of this a new user is created in firebase authentication but not in firestore.
             */
            // update the profile to include userName
            await updateProfile(userCredentials.user, { displayName: name });
            // reload the user to get updated user
            await userCredentials.user.reload();
            return userCredentials;
        } catch (error) {
            console.log(error);
        }
    },
    login: async (/** @type {string} */ email, /** @type {string} */ password) => {
        try {
            let userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, 'users', userCredentials.user.uid));
            // @ts-ignore
            authStore.update((currState) => ({ ...currState, userInfo: userDoc.data() ,currentUser:userCredentials.user}));
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