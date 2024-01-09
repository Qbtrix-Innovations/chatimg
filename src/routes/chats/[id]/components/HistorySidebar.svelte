<script lang="ts">
	import TopNavbar from '$lib/components/TopNavbar.svelte';
	import ImgChatHistory from '../../../home/components/ImgChatHistory.svelte';
	import TextChatHistory from '../../../home/components/TextChatHistory.svelte';
	import { userData } from '$lib/stores/user/userStore';
	export let activeId: string = '';
	import chatsData from '$lib/stores/chats/chatStore';
	import { goto, afterNavigate } from '$app/navigation';
	import { getChatAsIdDataImageInSortedOrder } from '../../../../services/chatService';
	import type { Image } from '$lib/core/entities/Image';
	import type { Chat } from '$lib/core/entities/Chat';
	import { MoreVertical } from 'lucide-svelte';

	let previousPage: any;
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});
	function back() {
		console.log(previousPage);
		goto(previousPage);
	}
	function createNewChat() {
		goto('/newChat');
	}
	function share() {
		return;
	}

	let chatData: { id: string; data: Chat; images: Image[] }[] = [];

	const getChats = async () => {
		chatData = await getChatAsIdDataImageInSortedOrder($userData.id);
		chatsData.set(chatData);
	};
	$: {
		if ($userData?.id) {
			getChats();
		}
	}
</script>

<section class="xl:w-[350px] w-full h-full min border-r-2 border-[#607D8B] border-opacity-[15%]">
	<div class="w-full flex items-center justify-between px-4 text-[22px] font-[600] py-2">
		History
		<button><MoreVertical class="h-5" /></button>
	</div>
	{#if $chatsData.length !== 0}
		<div class="w-full flex flex-col gap-2 max-h-[100vh] overflow-x-hidden overflow-y-auto">
			{#each $chatsData as chat}
				{#if chat.images.length === 0}
					<button
						on:click={() => {
							goto(`/chats/${chat.id}`);
						}}
						class={`w-full ${activeId === chat.id ? `bg-[rgba(96,125,139,0.10)]` : ``} p-1`}
					>
						<TextChatHistory
							chatId={chat.id}
							lastMessage={chat.data.lastMessagePreview}
							time={chat.data.lastMessage}
						/>
					</button>
				{:else}
					<button
						on:click={() => {
							goto(`/chats/${chat.id}`);
						}}
						class={`w-full ${activeId === chat.id ? `bg-[rgba(96,125,139,0.10)]` : ``} p-1`}
					>
						<ImgChatHistory
							chatId={chat.id}
							url={chat.images[0].imageUrl}
							lastMessage={chat.data.lastMessagePreview}
							time={chat.data.lastMessage}
						/>
					</button>
				{/if}
			{/each}
		</div>
	{:else}
		<h1 class="text-sm text-center">Create new Chat</h1>
	{/if}
</section>
