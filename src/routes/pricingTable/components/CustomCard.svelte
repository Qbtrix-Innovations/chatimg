<script>
	import { Bot, CalendarDays, CheckCircle2, XCircle } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { userData } from '$lib/stores/user/userStore';
	import clsx from 'clsx';
	import { goto } from '$app/navigation';
	/**
	 * @type {() => void}
	 */
	export let onClick;
	const buttonClicked = async () => {
		onClick();
	};
	/**
	 * @type {any}
	 */
	export let bullets;
	/**
	 * @type {string}
	 */
	export let h1;
	/**
	 * @type {string}
	 */
	export let h2;
	/**
	 * @type {number}
	 */
	export let price;
	/**
	 * @type {string}
	 */
	export let unitTime;
	/**
	 * @type {string}
	 */
	export let buttonText;
</script>

<div class={clsx('rounded-[20px] border-[#d4d4d4] border flex flex-col p-4 my-4')}>
	<div class={clsx('flex flex-row justify-evenly')}>
		<div class={clsx('text-black')}>
			{#if price === 0}
				<Bot size="40" />
			{:else}
				<CalendarDays size="40" />
			{/if}
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
				{#if bullet.isPresent}
					<CheckCircle2 fill="#35353f" color="white" />
				{:else}
					<XCircle fill="#ee9393" color="white" />
				{/if}
				<div>
					{bullet.text}
				</div>
			</div>
		{/each}
	</div>
	<hr
		class={clsx(
			'border-dashed border-t-2 w-[90%] align-middle self-center mt-8 mb-4 border-[#a9a9aa] '
		)}
	/>
	<div>
		<span class={clsx('font-bold text-[32px] leading-10 text-[#0b0914]')}>${price}</span><span
			class={clsx('font-normal text-[18px] leading-10 text-[#0b0914]')}>/{unitTime}</span
		>
	</div>
	{#if price === 0}
		<!-- <form action="?/ownAPICheckoutSession" method="post">
			<input type="hidden" name="userInfo" value={JSON.stringify($userData)} />
			<input type="hidden" name="lookup_key" value="Monthly Subscription" /> -->
			<Button
				id="checkout-and-portal-button"
				type="submit"
				on:click={()=>{goto('/userProfile')}}
				class={clsx(
					'bg-[rgba(76,175,80,1)] hover:bg-[rgba(76,175,80,0.8)] rounded-xl w-[90%] self-center'
				)}
			>
				{buttonText}
			</Button>
		<!-- </form> -->
	{:else}
		<form action="?/createCheckoutSession" method="post">
			<input type="hidden" name="userInfo" value={JSON.stringify($userData)} />
			<input type="hidden" name="lookup_key" value="Monthly Subscription" />
			<Button
				id="checkout-and-portal-button"
				type="submit"
				class={clsx(
					'bg-[rgba(76,175,80,1)] hover:bg-[rgba(76,175,80,0.8)] rounded-xl w-[90%] self-center'
				)}
			>
				{buttonText}
			</Button>
		</form>
	{/if}
</div>
