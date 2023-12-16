import { db } from "$lib/services/firebase/firebase";
import { userData } from "$lib/stores/user/userStore";
import { error, redirect } from "@sveltejs/kit";
import { doc, updateDoc } from "firebase/firestore";
import Stripe from "stripe"
const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY,{apiVersion:"2023-10-16"});
export const actions={
    monthlySubscription: async({request})=>{
        let url;
        try {
            const session = await stripe.checkout.sessions.create({
                line_items:[
                    {
                        price:"price_1ONInMSDHqx7TTmQOJhgVNyN",
                        quantity:1
                    }
                ],
                mode:"payment",
                success_url:`${request.headers.get("origin")}/userProfile?success=true`,
                cancel_url:`${request.headers.get("origin")}/userProfile?cancelled=true`,
            })
            url=session.url;
            if(url?.includes('success')){
                let finalDay = new Date();
                finalDay.setMonth(finalDay.getMonth() + 1);
                const startDate = new Date();
                let ud = userData.subscribe(async (state)=>{
                    await updateDoc(doc(db, `users`,state.id), {
                        subscriptionDetails: {
                            startDate: startDate,
                            endDate: finalDay,
                            planType: 'month'
                        }
                    });
                });
                userData.update((state)=>{
                    return{
                        id:state.id,
                        email:state.email,
                        createdAt:state.createdAt,
                        dateOfBirth:state.dateOfBirth,
                        isPremium:state.isPremium,
                        lastLogin:state.lastLogin,
                        phoneNumber:state.phoneNumber,
                        profilePictureUrl:state.profilePictureUrl,
                        userName:state.userName,
                        subscriptionDetails:{
                            startDate:startDate,
                            planType:"month",
                            endDate:finalDay
                        }
                    };
                })
                await updateDoc(doc(db, `users`, ), {
                    subscriptionDetails: {
                        startDate: startDate,
                        endDate: finalDay,
                        planType: 'month'
                    }
                });

                // $userData.subscriptionDetails.startDate = startDate;
                // $userData.subscriptionDetails.endDate = finalDay;
                // $userData.subscriptionDetails.planType = 'month';
            }
        } catch (errorObj) {
            throw error(500,"Unknown error Occured.")
        }
        if (url) {
            console.log(url);
            throw redirect(303,url);
        }
    }
}