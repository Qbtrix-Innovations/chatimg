<script nonce="abcxyz" lang="ts">
	import clsx from 'clsx';
	import CustomCard from './components/CustomCard.svelte';
	import CustomCard2 from './components/CustomCard2.svelte';
	import { goto } from '$app/navigation';
	import { userData } from '$lib/stores/user/userStore';
	import { ArrowLeft } from 'lucide-svelte';
	// import { loadStripe } from '@stripe/stripe-js';
	export let data;
	const EnterYourOwnApiKey = async () => {
		// let finalDay = new Date();
		// finalDay.setMonth(finalDay.getMonth() + 6);
		// const startDate = new Date();
		// await updateDoc(doc(db, `users`,$userData.id), {
		//     subscriptionDetails:{
		//         startDate: startDate,
		//         endDate:finalDay,
		//         planType:"ownAPI"
		//     }
		// });
		// $userData.subscriptionDetails.startDate=startDate;
		// $userData.subscriptionDetails.endDate=finalDay;
		// $userData.subscriptionDetails.planType="ownAPI";
		goto('/userProfile');
	};
	const buyingMonthlyPlan = async () => {
		// const checkPaymentSuccessfull = false;
		// const response = await fetch('payment/monthlySubscription', {
		//     method: 'POST',
		//     body: JSON.stringify({ $userData }),
		//     headers: {
		//         'Content-Type': 'application/json'
		//     }
		// });
		// const body =await response.json()
		// console.log(body);
		// goto(body.url);
		// const stripe = await loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
		// const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
		// console.log(stripe);
		// const paymentIntent = await stripe.paymentIntents.create({
		//     amount:25.00,
		//     currency:'usd',
		//     statement_descriptor:`Monthly subscription`,
		//     statement_descriptor_suffix:`Payee: ${$userData.userName}.`,
		//     automatic_payment_methods:{
		//         enabled:true
		//     },
		// });
		// paymentIntent.payment_method
		// // @ts-ignore
		// const retreivedPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);
		// console.log(paymentIntent);
		// console.log(retreivedPaymentIntent);
		// console.log(retreivedPaymentIntent.status);
		// const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHIBLE_KEY);
		// async function redirectToCheckout() {
		// const { sessionId } = await fetch('https://your-api.com/create-checkout-session', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({ lineItems: [{ price: 'price_123', quantity: 1 }] })
		// }).then((res) => res.json());
		// await stripe.redirectToCheckout({ sessionId });
		// }
		// const userInfo = $userData;
		// const response = await fetch('/payment/create-checkout-session', {
		//     method: 'POST',
		//     body: JSON.stringify({ userInfo, }),
		//     headers: {
		//         'Content-Type': 'application/json'
		//     }
		// });
		// const { paymentStatus } = await response.json();
		// console.log(paymentStatus);
		// if (checkPaymentSuccessfull) {
		// 	let finalDay = new Date();
		// 	finalDay.setMonth(finalDay.getMonth() + 1);
		// 	const startDate = new Date();
		// 	await updateDoc(doc(db, `users`, $userData.id), {
		// 		subscriptionDetails: {
		// 			startDate: startDate,
		// 			endDate: finalDay,
		// 			planType: 'month'
		// 		}
		// 	});
		// 	$userData.subscriptionDetails.startDate = startDate;
		// 	$userData.subscriptionDetails.endDate = finalDay;
		// 	$userData.subscriptionDetails.planType = 'month';
		// 	goto('/userProfile');
		// }
	};
</script>

<div class="flex flex-col">
	<div
		class="font-semibold text-[14px] text-[#263238] ml-2 w-full mt-1 fixed flex flex-row justify-start align-middle items-center"
	>
		<button
			on:click={() => {
				goto('/userProfile');
			}}
		>
			<ArrowLeft />
		</button>
		<div class="align-middle text-center px-3 py-2">
			Chat Img
			{#if $userData.userName}
				<span
					class="text-transparent ml-[2px] bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
				>
					Hi {$userData.userName.split(' ')[0]} !</span
				>
			{/if}
		</div>
	</div>
	<div class={clsx('flex flex-col overflow-y-scroll mt-[5vh] px-[5%] h-[95vh]')}>
		<div class="w-5/6 mx-auto mt-[2%]">
			<div class={clsx('font-semibold text-[22px] ')}>Recharge</div>
			<div class={clsx('font-semibold text-[16px] text-[#959595] w-3/5 ')}>
				For more chats please buy one of the plans
			</div>
		</div>
		<div class="w-5/6 mx-auto grid grid-cols-3 gap-8 justify-center">
			<CustomCard
				onClick={EnterYourOwnApiKey}
				h1={'Use your own API Key'}
				h2={`What You'll Get`}
				bullets={[
					{ text: '3 Chats per day', isPresent: true },
					{ text: 'Chat With Image', isPresent: true },
					{ text: 'Create Image', isPresent: false }
				]}
				price={0}
				unitTime={'day'}
				buttonText={'Start'}
			/>
			<CustomCard2
				icn={`
				<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
					<g clip-path="url(#clip0_8155_67)">
						<path d="M33.3334 20C33.3334 16.4638 31.9286 13.0724 29.4281 10.5719C26.9276 8.07142 23.5363 6.66666 20 6.66666C16.4638 6.66666 13.0724 8.07142 10.572 10.5719C8.07147 13.0724 6.66671 16.4638 6.66671 20V26.6667H11.6667C12.1087 26.6667 12.5327 26.8423 12.8452 27.1548C13.1578 27.4674 13.3334 27.8913 13.3334 28.3333V33.3333H26.6667V28.3333C26.6667 27.8913 26.8423 27.4674 27.1549 27.1548C27.4674 26.8423 27.8913 26.6667 28.3334 26.6667H33.3334V20ZM30 30V35C30 35.442 29.8244 35.8659 29.5119 36.1785C29.1993 36.4911 28.7754 36.6667 28.3334 36.6667H11.6667C11.2247 36.6667 10.8008 36.4911 10.4882 36.1785C10.1756 35.8659 10 35.442 10 35V30H5.00004C4.55801 30 4.13409 29.8244 3.82153 29.5118C3.50897 29.1993 3.33337 28.7754 3.33337 28.3333V20C3.33337 10.795 10.795 3.33333 20 3.33333C29.205 3.33333 36.6667 10.795 36.6667 20V28.3333C36.6667 28.7754 36.4911 29.1993 36.1786 29.5118C35.866 29.8244 35.4421 30 35 30H30ZM12.5 23.3333C12.1717 23.3333 11.8466 23.2687 11.5433 23.143C11.24 23.0174 10.9644 22.8332 10.7323 22.6011C10.5001 22.3689 10.316 22.0934 10.1903 21.79C10.0647 21.4867 10 21.1616 10 20.8333C10 20.505 10.0647 20.1799 10.1903 19.8766C10.316 19.5733 10.5001 19.2977 10.7323 19.0656C10.9644 18.8334 11.24 18.6493 11.5433 18.5236C11.8466 18.398 12.1717 18.3333 12.5 18.3333C13.1631 18.3333 13.799 18.5967 14.2678 19.0656C14.7366 19.5344 15 20.1703 15 20.8333C15 21.4964 14.7366 22.1323 14.2678 22.6011C13.799 23.0699 13.1631 23.3333 12.5 23.3333ZM27.5 23.3333C27.1717 23.3333 26.8466 23.2687 26.5433 23.143C26.24 23.0174 25.9644 22.8332 25.7323 22.6011C25.5001 22.3689 25.316 22.0934 25.1903 21.79C25.0647 21.4867 25 21.1616 25 20.8333C25 20.505 25.0647 20.1799 25.1903 19.8766C25.316 19.5733 25.5001 19.2977 25.7323 19.0656C25.9644 18.8334 26.24 18.6493 26.5433 18.5236C26.8466 18.398 27.1717 18.3333 27.5 18.3333C28.1631 18.3333 28.799 18.5967 29.2678 19.0656C29.7366 19.5344 30 20.1703 30 20.8333C30 21.4964 29.7366 22.1323 29.2678 22.6011C28.799 23.0699 28.1631 23.3333 27.5 23.3333Z" fill="#0B0914"/>
					</g>
					<defs>
						<clipPath id="clip0_8155_67">
							<rect width="40" height="40" fill="white"/>
						</clipPath>
					</defs>
				</svg>
			`}
				h1={'Day Pass'}
				h2={`What You'll Get ?`}
				buttonText={'Choose'}
			/>
			<CustomCard
				onClick={buyingMonthlyPlan}
				h1={'Monthly Pass'}
				h2={`What You'll Get`}
				bullets={[
					{ text: '3 Chats per day', isPresent: true },
					{ text: 'Chat With Image', isPresent: true },
					{ text: 'Create Image', isPresent: true }
				]}
				price={18}
				unitTime={'month'}
				buttonText={'Choose'}
			/>
		</div>
	</div>
</div>
