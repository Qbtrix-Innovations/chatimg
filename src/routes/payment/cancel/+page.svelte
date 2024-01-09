<script lang="ts">
	import { userData } from '$lib/stores/user/userStore';
	import TopNavbar from '$lib/components/TopNavbar.svelte';
	import clsx from 'clsx';
	import { BadgeCheck, BadgeMinus, TentTree } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import PrimaryButton from '$lib/components/primaryButton.svelte';
	let isChecked: any;
</script>

<div class="flex flex-col justify-between pb-28 items-center align-middle h-[100vh]">
	<TopNavbar
		leftProfile={true}
		handleBack={() => {}}
		handleRightTextClick={() => {
			goto('/home');
		}}
		handleShare={() => {}}
		headingLeft={`Hi ${$userData.userName}`}
		buttonTextRight="Home"
		shareAvailable="false"
		creditsLeft={'3'}
		passType={'basic'}
	/>
	<div class={clsx(`flex flex-col  items-center align-middle `)}>
		<div class={clsx(`flex flex-col  items-center align-middle `)}>
			<!-- <div class=""> -->
			<BadgeMinus size="52" color="#f22f2f" stroke-width="3" />
			<!-- </div> -->
			<div class="text-[16px] sm:text-2xl leading-6 font-semibold text-[#de9e9e] mt-3">Payment Failed</div>
			<div class="text-[16px] leading-5 font-normal text-center text-[#959595] w-[75%] mt-2">
				Your purchase is failed, Please try again later.
			</div>
		</div>
	</div>
	<div class="flex flex-col justify-between items-center align-middle">
		<div class="flex flex-row justify-center align-middle items-center py-4 px-4">
			<input
				type="checkbox"
				bind:checked={isChecked}
				class={clsx` w-4 h-4 data-[state=checked]:bg-white data-[state=checked]:text-[rgba(0,217,24,1)] mr-2 border-[1px] rounded-[2px] border-solid border-[rgba(203,203,203,1)]`}
			/>
			<div class="text-[12px] text-[rgba(37,37,37,1)] leading-[8.5px] font-normal">
				<span>By checking the box you agree to our </span>
				<span
					class="text-transparent bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
					>Terms</span
				>
				and
				<span
					class="text-transparent bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
					>Conditions</span
				>.
			</div>
		</div>
		<PrimaryButton onClick={() => goto("/pricingTable")} class="w-full h-[30px]" text="Pay Again" />
		<Button
			on:click={() => {
				goto('/userProfile');
			}}
			class="h-[30px] w-full mt-4 bg-transparent rounded-lg border-[1px] border-[#c8c8c8] bg-[#d9d9d9] shadow-[0px_4px_3.7px_0px_rgba(0, 0, 0, 0.22)]"
			type="submit"
		>
			<span class="text-[#747474]">
				{`Close`}
			</span>
		</Button>
	</div>
</div>
