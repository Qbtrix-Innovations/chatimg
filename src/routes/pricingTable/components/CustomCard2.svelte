<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { db } from '$lib/services/firebase/firebase';
	import { userData } from '$lib/stores/user/userStore';
	import clsx from 'clsx';
	import { doc, updateDoc } from 'firebase/firestore';
	import { CheckCircle2, TentTree } from 'lucide-svelte';
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
	 * @type {"20credits/day"|"60credits/day"|"140credits/day"}
	 */
	let plan = '20credits/day';
	let bullet1 = '20 Credits - 1 credit = 1 chat.';
	$: {
		bullet1 = `${
			plan === '20credits/day' ? '20' : plan === '60credits/day' ? '60' : '140'
		} Credits - 1 credit = 1 chat.`;
	}
	/**
	 * @type string[]
	 */
	let bullets = [bullet1, 'Chat with Image','Create Image'];
	$: {
		bullets = [bullet1, 'Chat with Image','Create Image'];
	}
</script>

<div class={clsx('rounded-[20px] border-[#d4d4d4] border flex flex-col p-4 my-4')}>
	<div class={clsx('flex flex-row justify-evenly')}>
		<TentTree size=40 />
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
					<CheckCircle2 fill="#35353f" color="white"/>
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
				<span class={clsx('text-[32px] leading-10 font-bold')}>$3</span>
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
				`${plan === '140credits/day' ? 'opacity-100' : 'opacity-40'} flex flex-col text-center`
			)}
			on:click={() => {
				plan = '140credits/day';
			}}
		>
			<div>
				<span class={clsx('text-[32px] leading-10 font-bold')}>$12</span>
				<span class={clsx('text-[18px] leading-10 font-normal')}>/day</span>
			</div>
			<div>140 Credits</div>
		</div>
	</div>
	<form action="?/createDailyCheckoutSession" method="post">
		<input type="hidden" name="userInfo" value={JSON.stringify($userData)} />
		<input type="hidden" name="type" bind:value={plan} />
		<Button
			type="submit"
			class={clsx(
				'bg-[rgba(76,175,80,1)] hover:bg-[rgba(76,175,80,0.8)] rounded-xl w-[90%] self-center'
			)}
		>
			{buttonText}
		</Button>
	</form>
</div>
