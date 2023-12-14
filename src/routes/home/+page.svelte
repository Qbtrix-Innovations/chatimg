<script>
	import { db } from '$lib/services/firebase/firebase.js';
	import { collection, getDocs, query, where } from 'firebase/firestore';

	import CommonNavbar from '$lib/components/CommonNavbar.svelte';
	import ImgChatHistory from './components/ImgChatHistory.svelte';
	import TextChatHistory from './components/TextChatHistory.svelte';
	import { date } from 'zod';
	import { onMount } from 'svelte';
	import { userData } from '$lib/stores/user/userStore';
	import { chatsData } from '$lib/stores/chats/chatStore';
	import { goto, afterNavigate } from '$app/navigation';
	/**
	 * @type {any}
	 */
	let previousPage;
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
		console.log(previousPage);
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
	 * @type {{
					id: string,
					data: import("@firebase/firestore").DocumentData,
					images: import("@firebase/firestore").DocumentData[],
				}[]}
	 */
	let chatData = [];

	const getChats = async () => {
		const chatsCollection = collection(db, 'chats');
		try {
			// Query to find chat documents where participants array contains the user ID
			// console.log(data.user?.id);
			const id = $userData.id;
			console.log(id);
			const q = query(chatsCollection, where('participants', 'array-contains', id));
			const querySnapshot = await getDocs(q);
			// Iterate through the chat documents
			console.log('outside');
			querySnapshot.forEach((chatDoc) => {
				console.log('inside');
				// Extract data from the main chat document
				const chatInfo = {
					id: chatDoc.id,
					data: chatDoc.data(),
					images: []
				};
				// Update the chatData array
				chatData.push(chatInfo);
			});
			// console.log(chatData);
			// chatData.reduce((promiseChain, chat) => {
			//     console.log('inside reduce');
			// 	return promiseChain.then(
			// 		() =>
			// 			new Promise((resolve) => {
			// 				return async () => {
			//                     console.log('internal');
			// const imagesCollectionRef = collection(chatsCollection, chat.id, 'images');
			// const imagesQuerySnapshot = await getDocs(imagesCollectionRef);
			// const imagesData = imagesQuerySnapshot.docs.map((imageDoc) => imageDoc.data());
			// chat.images = imagesData;
			//                     console.log(imagesData);
			// 				};
			// 			})
			// 	);
			// }, Promise.resolve());
			/**
			 * @param {string | any[]} array
			 * @param {(arg0: any, arg1: number, arg2: any) => any} callback
			 */
			async function asyncForEach(array, callback) {
				for (let index = 0; index < array.length; index++) {
					await callback(array[index], index, array);
				}
			}
			await asyncForEach(chatData, async (chat) => {
				const imagesCollectionRef = collection(chatsCollection, chat.id, 'images');
				const imagesQuerySnapshot = await getDocs(imagesCollectionRef);
				const imagesData = imagesQuerySnapshot.docs.map((imageDoc) => imageDoc.data());
				chat.images = imagesData;
			});
			console.log(chatData);
			// @ts-ignore
			chatsData.set(chatData);
			/**
             *  .reduce((promiseChain, item) => {
                        return promiseChain.then(() => new Promise((resolve) => {
                            asyncFunction(item, resolve);
                        }));
                    }, Promise.resolve()
                );
            */
			// Reference to the 'images' subcollection for the current chat document
			// chatData.forEach(async(chat)=>{
			//     console.log('inside');
			// 	const imagesCollectionRef = collection(chatsCollection, chat.id, 'images');
			// 	// Fetch documents from the 'images' subcollection
			// 	const imagesQuerySnapshot = await getDocs(imagesCollectionRef);
			// 	const imagesData = imagesQuerySnapshot.docs.map((imageDoc) => imageDoc.data());
			//     chat.images=imagesData;
			// })
		} catch (err) {
			console.log(err);
		}
	};
	// onMount(async () => {
	// 	await getChats();
	// });
	$: {
		if ($userData?.id) {
			console.log($userData.id);
			const impFunc = async () => {
				await getChats();
			};
			impFunc();
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
	/>
	<div class="flex flex-col w-[100%] mt-[50px]">
		{#each $chatsData as chat}
			{#if chat.images.length === 0}
				<button on:click={()=>{goto(`/chats/${chat.id}`)}}>
					<TextChatHistory
						chatId={chat.id}
						lastMessage={chat.data.lastMessagePreview}
						time={chat.data.lastMessage}
					/>
				</button>
			{:else}
				<button on:click={()=>{goto(`/chats/${chat.id}`)}}>
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
