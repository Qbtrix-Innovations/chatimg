<script>
	import { ChevronLeft, Forward } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { userData } from '$lib/stores/user/userStore';
	import Button from './ui/button/button.svelte';
	import clsx from 'clsx'; 
	/**
	 * @type {string}
	 */
	export let headingLeft;

	/**
	 * @type {string}
	 */
	export let buttonTextRight;

	/**
	 * @type {string}
	 */
	export let shareAvailable;
	/**
	 * @type {() => void}
	 */
	export let handleRightTextClick;
	function handleRightClick() {
		handleRightTextClick();
	}
	/**
	 * @type {() => void}
	 */
	export let handleLeftTextClick;
	function handleLeftClick() {
		handleLeftTextClick();
	}
	/**
	 * @type {() => void}
	 */
	export let handleSecondFromRightClick;
	function handleSecondRightClick() {
		handleSecondFromRightClick();
	}
	/**
	 * @type {boolean}
	 */
	export let leftProfile;
	const handleProfile = () => {
		goto('/userProfile');
	};
	let sub = 'monthly';
	/**
	 * @type {string}
	 */
	 export let creditsLeft;
	 /**
	 * @type {string}
	 */
	  export let passType;
</script>

<nav class={clsx('w-screen fixed flex flex-row justify-between align-middle')}>
	<div class={clsx('flex flex-row justify-evenly align-middle items-center')}>
		{#if leftProfile}
			<Button on:click={handleProfile} class={clsx('ml-1 bg-transparent hover:bg-transparent rounded-full')}>
				<img
					alt="profile"
					class="rounded-full max-h-[25px]"
					src="{$userData.profilePictureUrl ? `${$userData.profilePictureUrl}`:`/no_default_user_image.png`}"
				/>
			</Button>
		{:else}
			<Button on:click={handleLeftClick} class={clsx('bg-transparent hover:bg-transparent')}>
				<ChevronLeft color='#263238' height=14 width=8 />
			</Button>
		{/if}
		<div class={clsx('flex flex-col')} >
			<div class={clsx('text-transparent text-sm p-0 m-0 bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]')}>
				{headingLeft}
			</div>
			<div class={clsx('flex flex-row justify-start align-middle items-center ')} >
				<div class={clsx('text-[10px] opacity-70 leading-3 text-[rgba(38,50,56,1)] font-medium')} >{creditsLeft} Credits left</div>
				<div class={clsx('text-[8px] leading-[10px] font-semibold text-[rgba(125,125,125,1)] bg-[rgba(217,217,217,1)] rounded-sm ml-1 px-[5px]')} >{passType}</div>
			</div>
		</div>
	</div>
	<div class={clsx('flex flex-row justify-around align-middle items-center pr-2')}>
		{#if shareAvailable === 'true'}
			<button
				class={clsx(
					'bg-[#d9d9d9] w-[21px] h-[21px] rounded-full mr-2 flex items-center align-middle pl-1'
				)}
				on:click={handleSecondRightClick}
			>
				<Forward height=13 width=13 color='#607D8B' strokeWidth=1.2 stroke-linecap="round" stroke-linejoin="round" />
			</button>
		{/if}
		<div class={clsx('flex items-center align-middle')}>
			<Button
				on:click={handleRightClick}
				class={clsx(
					'bg-[rgba(76,175,80,0.8)] rounded-[10px] h-[21px] w-[52px] text-[15px] leading-4 font-medium text-[#ffffff] py-3 text-center'
				)}
			>
				{buttonTextRight}
			</Button>
		</div>
	</div>
</nav>
