<script lang="ts">
	import TopNavbar from '$lib/components/TopNavbar.svelte';
	import ImgChatHistory from './components/ImgChatHistory.svelte';
	import TextChatHistory from './components/TextChatHistory.svelte';
	import { userData } from '$lib/stores/user/userStore';

	import chatsData from '$lib/stores/chats/chatStore';
	import { goto, afterNavigate } from '$app/navigation';
	import { getChatAsIdDataImageInSortedOrder } from '../../services/chatService';
	import type { Image } from '$lib/core/entities/Image';
	import type { Chat } from '$lib/core/entities/Chat';

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

<div class="flex flex-col">
	<TopNavbar
		leftProfile={true}
		handleBack={back}
		handleRightTextClick={createNewChat}
		handleShare={share}
		headingLeft={`Hi ${$userData.userName}`}
		buttonTextRight="New"
		shareAvailable="false"
		creditsLeft="3"
		passType="basic"
	/>

	<div class="flex flex-col mt-[40px]">
		{#each $chatsData as chat}
			{#if chat.images.length === 0}
				<button
					on:click={() => {
						goto(`/chats/${chat.id}`);
					}}
					class={`w-full`}
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
					class={`w-full`}
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
</div>
