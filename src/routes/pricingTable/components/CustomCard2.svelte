<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { db } from '$lib/services/firebase/firebase';
	import { userData } from '$lib/stores/user/userStore';
	import clsx from 'clsx';
	import { doc, updateDoc } from 'firebase/firestore';
	/**
	 * @type {string}
	 */
	export let h1;
	/**
	 * @type {string}
	 */
	export let h2;
	/**
	 * @type {string}
	 */
	export let buttonText;
	/**
	 * @type {any}
	 */
	export let icn;
	/**
	 * @type {"20credits/day"|"60credits/day"|"120credits/day"}
	 */
	let plan = '20credits/day';
	let bullet1='20 Credits - 1 credit = 1 chat.';
	$:{bullet1 = `${
		plan === '20credits/day' ? '20' : plan === '60credits/day' ? '60' : '120'
	} Credits - 1 credit = 1 chat.`;}
	/**
	 * @type string[]
	 */
	let bullets = [bullet1, 'Access to All our rooms'];
	$:{
		bullets=[bullet1, 'Access to All our rooms'];
	}
	const buyDailyPlan = async ()=>{
		if (plan==='20credits/day') {
		const paymentSuccessfull = true;
			if(paymentSuccessfull){
			let finalDay = new Date();
            finalDay.setDate(finalDay.getDate() + 1);   
            const startDate = new Date();
            await updateDoc(doc(db, `users`,$userData.id), {
                subscriptionDetails:{
                    startDate: startDate,
                    endDate:finalDay,
                    planType:"20credits/day"
                }
            });
            $userData.subscriptionDetails.startDate=startDate;
            $userData.subscriptionDetails.endDate=finalDay;
            $userData.subscriptionDetails.planType="20credits/day";
			}
			else{
				console.log('unsucceccfull payment');
			}
		} else if (plan==='60credits/day') {
		const paymentSuccessfull = true;
			if(paymentSuccessfull){
			let finalDay = new Date();
            finalDay.setDate(finalDay.getDate() + 1);   
            const startDate = new Date();
            await updateDoc(doc(db, `users`,$userData.id), {
                subscriptionDetails:{
                    startDate: startDate,
                    endDate:finalDay,
                    planType:"60credits/day"
                }
            });
            $userData.subscriptionDetails.startDate=startDate;
            $userData.subscriptionDetails.endDate=finalDay;
            $userData.subscriptionDetails.planType="60credits/day";
			}
			else{
				console.log('unsucceccfull payment');
			}
		}else if (plan==='120credits/day') {
		const paymentSuccessfull = true;
			if(paymentSuccessfull){
			let finalDay = new Date();
            finalDay.setDate(finalDay.getDate() + 1);   
            const startDate = new Date();
            await updateDoc(doc(db, `users`,$userData.id), {
                subscriptionDetails:{
                    startDate: startDate,
                    endDate:finalDay,
                    planType:"120credits/day"
                }
            });
            $userData.subscriptionDetails.startDate=startDate;
            $userData.subscriptionDetails.endDate=finalDay;
            $userData.subscriptionDetails.planType="120credits/day";
			}
			else{
				console.log('unsucceccfull payment');
			}
		}
		goto('/userProfile');
	}
</script>

<div class={clsx('rounded-[20px] border-[#d4d4d4] border flex flex-col p-4 my-4')}>
	<div class={clsx('flex flex-row justify-evenly')}>
		<div class={clsx('text-black')}>
			{@html icn}
		</div>
		<div class={clsx('font-bold text-[32px] leading-10 text-[#0b0914] w-3/4')}>
			{h1}
		</div>
	</div>
	<div class={clsx('flex flex-col')}>
		<div class={clsx('mt-2')}>
			{h2}
		</div>
		{#each bullets as bullet}
			<div class={clsx('flex flex-row my-2')}>
				<div>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12.0001 2.00008C6.48612 2.00008 2.00012 6.48608 2.00012 12.0001C2.00012 17.5141 6.48612 22.0001 12.0001 22.0001C17.5141 22.0001 22.0001 17.5141 22.0001 12.0001C22.0001 6.48608 17.5141 2.00008 12.0001 2.00008ZM10.0011 16.4131L6.28812 12.7081L7.70012 11.2921L9.99912 13.5871L15.2931 8.29308L16.7071 9.70708L10.0011 16.4131Z"
							fill="#35353F"
						/>
					</svg>
				</div>
				<div>
					{bullet}
				</div>
			</div>
		{/each}
	</div>
	<hr
		class={clsx(
			'border-dashed border-t-2 w-[90%] align-middle self-center mt-8 mb-4 border-[#a9a9aa] '
		)}
	/>

	<div class={clsx('flex flex-row justify-between mx-2')}>
		<div
			class={clsx(
				`${plan === '20credits/day' ? 'opacity-100' : 'opacity-40'} flex flex-col text-center`
			)}
			on:click={() => {
				plan = '20credits/day';
			}}
		>
			<div>
				<span class={clsx('text-[32px] leading-10 font-bold')}>$2</span>
				<span class={clsx('text-[18px] leading-10 font-normal')}>/day</span>
			</div>
			<div>20 Credits</div>
		</div>
		<div
			class={clsx(
				`${plan === '60credits/day' ? 'opacity-100' : 'opacity-40'} flex flex-col text-center`
			)}
			on:click={() => {
				plan = '60credits/day';
			}}
		>
			<div>
				<span class={clsx('text-[32px] leading-10 font-bold')}>$5</span>
				<span class={clsx('text-[18px] leading-10 font-normal')}>/day</span>
			</div>
			<div>60 Credits</div>
		</div>
		<div
			class={clsx(
				`${plan === '120credits/day' ? 'opacity-100' : 'opacity-40'} flex flex-col text-center`
			)}
			on:click={() => {
				plan = '120credits/day';
			}}
		>
			<div>
				<span class={clsx('text-[32px] leading-10 font-bold')}>$10</span>
				<span class={clsx('text-[18px] leading-10 font-normal')}>/day</span>
			</div>
			<div>120 Credits</div>
		</div>
	</div>
	<Button
		on:click={buyDailyPlan}
		class={clsx(
			'bg-[rgba(76,175,80,1)] hover:bg-[rgba(76,175,80,0.8)] rounded-xl w-[90%] self-center'
		)}
	>
		{buttonText}
	</Button>
</div>
