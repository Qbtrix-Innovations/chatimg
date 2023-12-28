// import type { Timestamp } from "firebase/firestore";
import { writable } from 'svelte/store';
export const userData = writable(
	{
		/**
		 * @type {string}
		 */
		id: '',
		/**
		 * @type {string}
		 */
		stripeCustomerId: '',
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
		 * @type null|Date|import('firebase/firestore').Timestamp|string
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
			startDate:new Date(),
			/**
			 * @type {null|Date|import('firebase/firestore').Timestamp}
			 */
			endDate: new Date(),
			/**
			 * @type {"basic"|"ownAPI"|"20credits/day"|"60credits/day"|"120credits/day"|"month"}
			 */
			planType: 'basic',
			/**
			 * @type{boolean}
			 */
			isActive: true,
			/**
			 * @type{number}
			 */
			totalCredits: 3,
			/**
			 * @type{number}
			 */
			availableCredits: 3
		}
	}
);
