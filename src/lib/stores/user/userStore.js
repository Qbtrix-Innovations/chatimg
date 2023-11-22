// import type { Timestamp } from "firebase/firestore";
import { writable } from "svelte/store";

export const userData = writable({
    /**
     * @type {string}
     */
    id:'',
    /**
     * @type {string}
     */
    userName: '',
    /**
     * @type {string}
     */
    email: '',
    /**
     * @type {string}
     */
    phoneNumber: '',
    /**
     * @type null|Date|import('firebase/firestore').Timestamp
     */
    dateOfBirth: null,
    /**
     * @type {string}
     */
    profilePictureUrl: '',
    /**
     * @type null|Date|import('firebase/firestore').Timestamp
     */
    createdAt: null,
    /**
     * @type null|Date|import('firebase/firestore').Timestamp
     */
    lastLogin: null,
    /**
     * @type {boolean}
     */
    isPremium: false,

    subscriptionDetails: {
        /**
         * @type {null|Date|import('firebase/firestore').Timestamp}
         */
        startDate: null,
        /**
         * @type {null|Date|import('firebase/firestore').Timestamp}
         */
        endDate: null,
        /**
         * @type {"basic"|"premium"}
         */
        planType: "basic",
    }
});
