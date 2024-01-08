<script lang="ts">
	import { goto } from '$app/navigation';
	import type { serverTimestampType } from '../../../lib/types';

	export let url: string;
	export let time: serverTimestampType;
	export let lastMessage: string;
	export let chatId: string;
	const onClick = () => {
		goto(`/chats/${chatId}`);
	};
</script>

<button class="flex flex-col w-full m-2 hover:opacity-100 active:opacity-100" on:click={onClick} >
	<div class="flex flex-row items-center w-full px-2">
		<img
			src={url}
			alt=""
			class="hover:opacity-100 rounded-[5px] bg-[rgba(217,217,217,1)] w-[50px] h-[50px]"
		/>
		<div class="flex flex-col pl-2">
			<div class="font-normal text-[14px] leading-6 text-[rgba(38,50,56,1)] dark:text-white/80 text-left">
				{lastMessage.length > 0
					? lastMessage.substring(0, 30) + '...'
					: 'Write a message to start conversation !'}
			</div>
			<div class="text-[rgba(110,110,110,1)] dark:text-white/45 leading-3 text-[10px] font-medium h-3 text-left">
				{new Date(time.seconds * 1000).toString().slice(0, 25)}
			</div>
		</div>
	</div>
</button>
