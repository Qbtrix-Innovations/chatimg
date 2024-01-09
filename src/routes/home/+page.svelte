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
	import HistorySidebar from '../chats/[id]/components/HistorySidebar.svelte';
	import MainFrame from '../chats/[id]/components/MainFrame.svelte';
	import RightSidebar from '../chats/[id]/components/RightSidebar.svelte';
	import Navbar from '../chats/[id]/components/Navbar.svelte';
	import ChatNav from '../chats/[id]/components/chatNav.svelte';
	import { getImagesOfIndividualChatOrdered } from '../../services/imageService';
	import { getMessagesOfIndividualChatOrdered } from '../../services/messageServices';
	import type { Message } from '$lib/core/entities/Message';
	import { Plus } from 'lucide-svelte';
	import NewChat from './components/NewChat.svelte';
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
	let data: { uid: string; imagesDataArray: Image[]; MessagesDataArray: Message[] } = {
		uid: '',
		imagesDataArray: [],
		MessagesDataArray: []
	};

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

	let activeId: string = $chatsData[0]?.id || '';

	async function getData() {
		let imagesData: Image[] = [];
		let MessagesData: Message[] = [];
		try {
			imagesData = await getImagesOfIndividualChatOrdered(activeId);
			MessagesData = await getMessagesOfIndividualChatOrdered(activeId);
			data = {
				uid: activeId,
				imagesDataArray: imagesData,
				MessagesDataArray: MessagesData
			};
		} catch (error) {
			console.log(error);
		}
		data = {
			uid: activeId,
			imagesDataArray: imagesData,
			MessagesDataArray: MessagesData
		};
	}

	$: {
		if (activeId) {
			getData();
		}
	}
</script>

<section class="bg-card">
	<div class="w-full hidden xl:block">
		<Navbar {data} newChatButton={false} />
	</div>
	<div class="w-full xl:hidden block">
		<ChatNav {data} />
	</div>
	<div class="flex w-full h-full">
		<div class="xl:w-[350px] w-full block">
			<HistorySidebar {activeId} />
		</div>
		<div class="w-full hidden xl:flex">
			<NewChat />
		</div>

		<div class="hidden xl:block">
			<RightSidebar />
		</div>
	</div>
</section>
<!-- <div class="flex flex-col mt-[40px]">
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
		</div> -->
