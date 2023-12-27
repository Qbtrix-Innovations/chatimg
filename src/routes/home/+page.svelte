<script>
	import CommonNavbar from '$lib/components/CommonNavbar.svelte';
	import ImgChatHistory from './components/ImgChatHistory.svelte';
	import TextChatHistory from './components/TextChatHistory.svelte';
	import { userData } from '$lib/stores/user/userStore';

	import { chatsData } from '$lib/stores/chats/chatStore';
	import { goto, afterNavigate } from '$app/navigation';
	import { getChatAsIdDataImageInSortedOrder } from '../../services/chatService';

	/**
	 * @type {any}
	 */
	let previousPage;
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
		// console.log(previousPage);
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
	/**
	 * @type {{ id: string; data: import("$lib/core/entities/Message"); images: import("$lib/core/entities/Image")[] }[]}
	 */
	let chatData = [];

	const getChats = async () => {
			// @ts-ignore
			chatData = await getChatAsIdDataImageInSortedOrder($userData.id);
			// @ts-ignore
			chatsData.set(chatData);
	};
	$: {
		if ($userData?.id) {
			getChats();
		}
	}

</script>

<div class="flex flex-col">
	<CommonNavbar
		leftProfile={true}
		handleLeftTextClick={back}
		handleRightTextClick={createNewChat}
		handleSecondFromRightClick={share}
		headingLeft={`Hi ${$userData.userName}`}
		buttonTextRight="New"
		shareAvailable="false"
		creditsLeft={$userData.subscriptionDetails.availableCredits.toString()}
		passType={$userData.subscriptionDetails.planType}
	/>
    <hr class='w-full fixed mt-[40px] border-[0.6px] bg-[rgba(218,218,218,1)] border-[rgba(218,218,218,1)]' >
	<div class="flex flex-col mt-[40px]">
		{#each $chatsData as chat}
			{#if chat.images.length === 0}
				<button on:click={()=>{goto(`/chats/${chat.id}`)}} class={`w-screen`} >
					<TextChatHistory
						chatId={chat.id}
						lastMessage={chat.data.lastMessagePreview}
						time={chat.data.lastMessage}
					/>
				</button>
			{:else}
				<button on:click={()=>{goto(`/chats/${chat.id}`)}} class={`w-screen`} >
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

<style>
</style>
