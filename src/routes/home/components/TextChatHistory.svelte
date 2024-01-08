<script lang="ts">
	import { goto } from '$app/navigation';
	import type { serverTimestampType } from '$lib/types';
	export let chatId: string;
	export let lastMessage: string;
	export let time: serverTimestampType;
	const onClick = () => {
		goto(`/chats/${chatId}`);
	};
</script>

<button class="flex flex-col w-full mt-4 hover:opacity-100" on:click={onClick}>
	<div class="font-normal ml-[16px] leading-[22px] text-[14px] text-left">
		{lastMessage.substring(0, 30) + '...'}
	</div>
	<div class="font-medium ml-[16px] leading-3 text-[10px] text-[rgba(110,110,110,1)] dark:text-white text-left">
		{new Date(time.seconds * 1000).toString().slice(0, 25)}
	</div>
</button>
