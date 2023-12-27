import { writable } from 'svelte/store';
import { auth, db, googleProvider } from '../../services/firebase/firebase';
// import { collection, doc, setDoc, getDoc, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, signOut, updatePassword, updateProfile } from 'firebase/auth';
import { userData } from '../user/userStore';
import { goto } from '$app/navigation';
import Stripe from 'stripe';
import { addNewUser, getUserById } from '../../../services/userService';
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
            const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
            let customer;
            if (userInfoData.phoneNumber) {
                customer = await stripe.customers.create({
                name: userInfoData.username,
                email: userInfoData.email,
                phone:userInfoData.phoneNumber,
              });                
            }else{
                customer = await stripe.customers.create({
                    name: userInfoData.username,
                    email: userInfoData.email,
                });                
            }
            await addNewUser({
                id: userCredentials.user.uid,
                stripeCustomerId:customer.id,
                userName: userInfoData.username,
                email: userInfoData.email,
                phoneNumber: userInfoData.phoneNumber !== null ? userInfoData.phoneNumber : '',
                // @ts-ignore
                dateOfBirth: userInfoData.dateOfBirth !== null ? userInfoData.dateOfBirth : '',
                profilePictureUrl: userInfoData.profilePictureUrl !== null ? userInfoData.profilePictureUrl : '',
                createdAt: new Date(),
                lastLogin: new Date(),
                isPremium: false,
                subscriptionDetails: {
                    startDate: new Date(),
                    endDate: finalDay,
                    planType: "basic",
                    isActive:true,
                    totalCredits:3,
                    availableCredits:3,
                },
            });
            const userDoc = await getUserById(userCredentials.user.uid);
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
            let userDoc;
            if (userCredentials.user.uid) {
                userDoc = await getUserById(userCredentials.user.uid);
            }
            // @ts-ignore
            userData.set(userDoc.data());
            authStore.update((currState) => ({ ...currState, currentUser: userCredentials.user }));
        } catch (error) {
            console.log(error);
        }
    },
    logout: async () => {
        try {
            // console.log(auth.currentUser);
            await signOut(auth);
            // console.log(auth.currentUser);
            userData.set({
                    id: '',
                    stripeCustomerId:'',
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
                        isActive:false,
                        availableCredits:0,
                        totalCredits:0,
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
            const userCredentials = await result.user;
            console.log(userCredentials);
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential?.accessToken;
            // console.log(result.user.uid);
            // console.log(user);
            // console.log(credential);
            // console.log(token);
            let finalDay = new Date();
            finalDay.setMonth(finalDay.getMonth() + 6);
            const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
            let customer;
            if (userCredentials.phoneNumber) {
                customer = await stripe.customers.create({
                // @ts-ignore
                name: userCredentials.displayName,
                email: userCredentials.email,
                phone:userCredentials.phoneNumber,
              });                
            }else{
                customer = await stripe.customers.create({
                    // @ts-ignore
                    name: userCredentials.displayName,
                    email: userCredentials.email,
                });                
            }
            await addNewUser({
                id: userCredentials.uid,
                stripeCustomerId:customer.id,
                // @ts-ignore
                userName: userCredentials.displayName,
                // @ts-ignore
                email: userCredentials.email,
                phoneNumber: userCredentials.phoneNumber !== null ? userCredentials.phoneNumber : '',
                // @ts-ignore
                dateOfBirth: '',
                profilePictureUrl: userCredentials.photoURL !== null ? userCredentials.photoURL : '',
                createdAt: new Date(),
                lastLogin: new Date(),
                isPremium: false,
                subscriptionDetails: {
                    startDate: new Date(),
                    endDate: finalDay,
                    planType: "basic",
                    isActive:true,
                    totalCredits:3,
                    availableCredits:3,
                },
            });
            const userDoc = await getUserById(userCredentials.uid);
            userData.set(userDoc);
            authStore.update((currState) => ({ ...currState, currentUser: userCredentials }));
            // update the profile to include userName
            // await updateProfile(userCredentials, { displayName: name });
            // reload the user to get updated user
            // await userCredentials.user.reload();
            return userDoc;
        } catch (/**@type{any}*/error) {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // const email = error.customData.email;
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // console.log(errorCode);
            console.log(error);
        }
    },
    changePassword: async (/** @type {string} */ newPassword) => {
        try {
            let user;
            let unsubscribe = authStore.subscribe((state) => {
                user = state.currentUser;
                // console.log(user);
            });
            // Check if the user is signed in
            if (user) {
                // console.log(newPassword);
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