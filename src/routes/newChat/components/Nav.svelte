<script lang="ts">
	import { goto } from '$app/navigation';
	import ProfileButton from '$lib/components/ProfileButton.svelte';
	import { authStore } from '$lib/stores/userauth/authStore';
	import { Undo2 } from 'lucide-svelte';

	$: userName = $authStore?.currentUser?.displayName;
</script>

<div class="font-semibold text-[14px] text-[#263238] mt-2 pr-3 flex flex-row justify-between">
	<div class="flex items-center">
		{#if userName}
			<ProfileButton />
			<div class="flex flex-col">
                <span
				class="text-transparent bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
			>
				<span class="text-black dark:text-white">Hi</span>
				{userName?.split(' ')[0]} !
			</span>
            <span class="text-[10px]">10 credits left</span>
            </div>
		{/if}
	</div>
	<button
		on:click={() => {
			goto('/home');
		}}
	>
		<Undo2 />
	</button>
</div>
