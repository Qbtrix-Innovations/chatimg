import { db } from '$lib/firebase/firebase';
import type { RequestHandler } from '@sveltejs/kit';
import { addDoc, collection } from 'firebase/firestore';
import Stripe from 'stripe';
import { getUserByStripeId } from '../../services/userService';
import { Subscription } from '$lib/core/entities/Subscription';
// @ts-ignore
export const post: RequestHandler = async ({request}) => {
  const stripeSignature = request.headers.get('stripe-signature');
  const endpointSecret = import.meta.env.VITE_STRIPE_WEBHOOKS_ENDPOINT_SECRET;
  // const endpointSecret="";
  const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY,{apiVersion:"2023-10-16",typescript:true});
  if (!request.body || !stripeSignature || !endpointSecret) {
    return{status:400};
  }

  let event;
  const body = Buffer.from(await request.arrayBuffer());
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      endpointSecret
    );
    console.log(event);
    switch (event.type) {
      case 'checkout.session.async_payment_failed':
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        break;
      case 'checkout.session.async_payment_succeeded':
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;

        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        break;
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        if (event.data.object.payment_status==="paid") {
          // @ts-ignore
          const curuser = await getUserByStripeId(event.data.object.customer);
          await addDoc(collection(db,'users',curuser.id,'subscriptionDetails'),{
            startDate:new Date(),
            endDate:new Date(new Date().getTime()+1*30*24*60*60*1000),
            planType:"month",
            isActive:true,
            totalCredits:500,
          });
        }
        console.log("event.type: ",event.type);
        console.log("event.data: ",event.data);
        console.log("event.data.object: ",checkoutSessionCompleted);
        // Then define and call a function to handle the event checkout.session.completed
        break;
      case 'checkout.session.expired':
        const checkoutSessionExpired = event.data.object;
        // Then define and call a function to handle the event checkout.session.expired
        break;
      case 'customer.created':
        const customerCreated = event.data.object;
        console.log(event.type);
        console.log(customerCreated);
        // Then define and call a function to handle the event customer.created
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return{status:200};
  } catch (err) {
    // @ts-ignore
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    // @ts-ignore
    return {status:400};
  }
};
