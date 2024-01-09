import Stripe from 'stripe';

export async function POST({ request }) {
	const YOUR_DOMAIN = import.meta.env.VITE_SITE_DOMAIN;
	const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

	const inputData = await request.formData();
	// @ts-ignore
	const userInformation = JSON.parse(inputData.get('userInfo'));
	// @ts-ignore
	const type = inputData.get('type');
	let priceString = '';
	if (type === '20credits/day') {
		priceString = 'price_1OOKHRSDHqx7TTmQgblGHvWq';
	} else if (type === '60credits/day') {
		priceString = 'price_1OOKHuSDHqx7TTmQFchT3wDe';
	} else if (type === '120credits/day') {
		priceString = 'price_1OOKIJSDHqx7TTmQz2ClE7SZ';
	}
	const price = await stripe.prices.retrieve(priceString);
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
	// @ts-ignore
	throw redirect(303, session.url);
}
