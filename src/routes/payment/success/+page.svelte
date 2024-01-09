<script lang="ts">
	import { userData } from '$lib/stores/user/userStore';
	import TopNavbar from '$lib/components/TopNavbar.svelte';
	import clsx from 'clsx';
	import { BadgeCheck, TentTree } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import PrimaryButton from '$lib/components/primaryButton.svelte';
	let isChecked: any;
</script>

<div class="flex flex-col justify-between items-center align-middle">
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
		creditsLeft={$userData.subscriptionDetails.availableCredits.toString()}
		passType={$userData.subscriptionDetails.planType}
	/>
	<div class={clsx(`flex flex-col justify-around items-center align-middle mt-[40px] h-screen`)}>
		<div class={clsx(`flex flex-col justify-between items-center align-middle`)}>
			<div class="">
				<BadgeCheck size="52" color="#16ba44" stroke-width="3" />
			</div>
			<div class="text-[16px] sm:text-2xl leading-6 font-semibold text-[#535353] mt-3">
				Payment Success
			</div>
			<div class=" leading-5 font-normal text-center text-[#959595] w-[320px] mt-2">
				<h2>Your purchase is successful, find your credit details bellow.</h2>
			</div>
			<div
				class="bg-[#dfeee0] rounded-[12px] mt-6 h-[14vh] w-3/4 flex flex-col justify-between items-center align-middle"
			>
				<div class="flex flex-row justify-center mt-4 items-center align-middle">
					<div>
						<TentTree size="32" />
					</div>
					<div class="font-bold text-[32px] leading-10 text-[#0b0914]">
						<!-- {$userData.subscriptionDetails.planType} -->
						Day Pass
					</div>
				</div>
				<div class="flex flex-row justify-around w-full items-center align-middle">
					<div class="text-[15px] text-[#4caf50] font-bold leading-10">
						60 Credits
						<!-- {$userData.subscriptionDetails.totalCredits} Credits -->
					</div>
					<div class="font-normal text-[12px] leading-5 text-center text-[#959595]">
						1 credit = 1 chat
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col justify-between items-center align-middle">
			<div class="flex flex-row justify-center align-middle items-center py-2 px-2">
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
			<PrimaryButton onClick={() => goto('/home')} class="w-full h-[30px]" text="Chat >" />
			<Button
				on:click={() => {
					goto('/pricingTable');
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
</div>
