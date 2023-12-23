import { json, error, redirect } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

// @ts-ignore
export async function POST({ request }) {
  // const { userInformation } = await request.json();

  //   const subscription = await stripe.subscriptions.create({
  //     customer: userInformation.stripeCustomerId,
  //     items: [
  //       {
  //         price: 'price_1OOMG1SDHqx7TTmQXveDfUBJ',
  //       },
  //     ],
  //     payment_settings:{
  //       payment_method_types: ['card'],
  //     },
  //   });
  //   console.log(subscription);
  //   console.log(subscription.status);
  // return json({ paymentStatus:true }, { status: 201 });
  let event;
  const body = Buffer.from(await request.arrayBuffer());
  console.log(body);
  // Replace this endpoint secret with your endpoint's unique secret
  // If you are testing with the CLI, find the secret by running 'stripe listen'
  // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
  // at https://dashboard.stripe.com/webhooks
  const endpointSecret = import.meta.env.VITE_STRIPE_WEBHOOKS_ENDPOINT_SECRET;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  // if (endpointSecret) {
  // Get the signature sent by Stripe
  const signature = request.headers.get('stripe-signature');
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );
    console.log(event);
  } catch (err) {
    // @ts-ignore
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    // @ts-ignore
    throw error(400, err.message);
  }
  // }
  let subscription;
  let status;
  // Handle the event

  switch (event.type) {
    case "checkout.session.completed":
      console.log(' checkout.session.completed');
      break;
    case "invoice.paid":
      console.log("invoice.paid");
      break;
    case 'customer.subscription.trial_will_end':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break;
    case 'customer.subscription.deleted':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break;
    case 'customer.subscription.created':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break;
    case 'customer.subscription.updated':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription update.
      // handleSubscriptionUpdated(subscription);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  // response.send();
  // throw error(200);
}
