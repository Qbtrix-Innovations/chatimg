import { db } from "$lib/firebase/firebase";
import { userData } from "$lib/stores/user/userStore";
import { error, json, redirect } from "@sveltejs/kit";
import { doc, updateDoc } from "firebase/firestore";
import Stripe from "stripe"
export const actions = {
    // monthlySubscription: async ({ request }) => {
    //     const YOUR_DOMAIN = import.meta.env.VITE_SITE_DOMAIN;
    //     const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
    //     let url;
    //     try {
    //         const session = await stripe.checkout.sessions.create({
    //             line_items: [
    //                 {
    //                     price: "price_1ONInMSDHqx7TTmQOJhgVNyN",
    //                     quantity: 1
    //                 }
    //             ],
    //             mode: "payment",
    //             success_url: `${request.headers.get("origin")}/userProfile?success=true`,
    //             cancel_url: `${request.headers.get("origin")}/userProfile?cancelled=true`,
    //         })
    //         url = session.url;
    //         if (url?.includes('success')) {
    //             let finalDay = new Date();
    //             finalDay.setMonth(finalDay.getMonth() + 1);
    //             const startDate = new Date();
    //             let ud = userData.subscribe(async (state) => {
    //                 await updateDoc(doc(db, `users`, state.id), {
    //                     subscriptionDetails: {
    //                         startDate: startDate,
    //                         endDate: finalDay,
    //                         planType: 'month'
    //                     }
    //                 });
    //             });
    //             userData.update((state) => {
    //                 return {
    //                     id: state.id,
    //                     subscriptionId:state.subscriptionId,
    //                     stripeCustomerId: state.stripeCustomerId,
    //                     email: state.email,
    //                     createdAt: state.createdAt,
    //                     dateOfBirth: state.dateOfBirth,
    //                     isPremium: state.isPremium,
    //                     lastLogin: state.lastLogin,
    //                     phoneNumber: state.phoneNumber,
    //                     profilePictureUrl: state.profilePictureUrl,
    //                     userName: state.userName,
    //                     // subscriptionDetails: {
    //                     //     startDate: startDate,
    //                     //     planType: "month",
    //                     //     endDate: finalDay
    //                     // }
    //                 };
    //             })
    //             await updateDoc(doc(db, `users`,), {
    //                 subscriptionDetails: {
    //                     startDate: startDate,
    //                     endDate: finalDay,
    //                     planType: 'month'
    //                 }
    //             });
    //             console.log('success');
    //             // $userData.subscriptionDetails.startDate = startDate;
    //             // $userData.subscriptionDetails.endDate = finalDay;
    //             // $userData.subscriptionDetails.planType = 'month';
    //         }
    //     } catch (errorObj) {
    //         throw error(500, "Unknown error Occured.")
    //     }
    //     if (url) {
    //         console.log(url);
    //         throw redirect(303, url);
    //     }
    // },
    createCheckoutSession: async ({ request }) => {
        const YOUR_DOMAIN = import.meta.env.VITE_SITE_DOMAIN;
        const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
        const inputData = await request.formData();
        // @ts-ignore
        const userInformation = JSON.parse(inputData.get('userInfo'));
        // @ts-ignore
        const lookup_key = inputData.get('lookup_key').toString();
        const price = await stripe.prices.retrieve(import.meta.env.VITE_STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID)
        const session = await stripe.checkout.sessions.create({
            customer: userInformation.stripeCustomerId,
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: price.id,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            success_url: `${YOUR_DOMAIN}/payment/success`,
            cancel_url: `${YOUR_DOMAIN}/payment/cancel`
        });
        
        // @ts-ignore
        throw redirect(303, session.url)
    },
    createDailyCheckoutSession:async({request})=>{
        const YOUR_DOMAIN = import.meta.env.VITE_SITE_DOMAIN;
        const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
        const credits20Price = import.meta.env.VITE_STRIPE_DAILY_20CREDITS_SUBSCRIPTION_PRICE_ID;
        const credits60Price = import.meta.env.VITE_STRIPE_DAILY_60CREDITS_SUBSCRIPTION_PRICE_ID;
        const credits140Price = import.meta.env.VITE_STRIPE_DAILY_140CREDITS_SUBSCRIPTION_PRICE_ID;
        const inputData = await request.formData();
        // @ts-ignore
        const userInformation = JSON.parse(inputData.get('userInfo'));
        // @ts-ignore
        const type = inputData.get('type');
        let priceString = '';
        if (type==='20credits/day') {
            priceString=credits20Price;
        }else if (type==='60credits/day') {
            priceString=credits60Price;
        }
        else if (type==='140credits/day') {
            priceString=credits140Price;
        }
        const price = await stripe.prices.retrieve(priceString);
        const session = await stripe.checkout.sessions.create({
            customer: userInformation.stripeCustomerId,
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: price.id,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            success_url: `${YOUR_DOMAIN}/payment/success`,
            cancel_url: `${YOUR_DOMAIN}/payment/cancel`
        });
        // @ts-ignore
        throw redirect(303, session.url)
    }
}