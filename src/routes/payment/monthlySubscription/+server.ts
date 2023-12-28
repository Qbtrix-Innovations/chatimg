import { json, redirect } from "@sveltejs/kit";
import Stripe from "stripe";

export async function POST({ request }) {
    const YOUR_DOMAIN = import.meta.env.VITE_SITE_DOMAIN;
    const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
    const userInformation = await request.json()

    // console.log(userInformation);
    // const inputData = await request.formData();
    // @ts-ignore
    // const userInformation = JSON.parse(inputData.get('userInfo'));
    // @ts-ignore
    // const lookup_key = inputData.get('lookup_key').toString();

    const price = await stripe.prices.retrieve(import.meta.env.VITE_STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID)
    const session = await stripe.checkout.sessions.create({
        customer: userInformation.stripeCustomerId,
        billing_address_collection: 'auto',
        line_items: [
            {
                price: price.id,
                // For metered billing, do not pass quantity
                quantity: 1
            }
        ],
        mode: 'subscription',
        success_url: `${YOUR_DOMAIN}/payment/success`,
        cancel_url: `${YOUR_DOMAIN}/payment/cancel`
    });
    // await fetch('payment/monthlySubscription', {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',

    //     }
    // });
    // @ts-ignore
    return json({ url: session.url }, { status: 201, headers: { location: session.url } });
    // throw redirect(303,session.url);
    // const resp = JSON.stringify({ status:303,url:session.url });
    // return {
    //     status:303,
    //     headers:{
    //         // @ts-ignore
    //         location:session.url,
    //     },
    // }
    // @ts-ignore
    // return redirect(303,session.url);
}