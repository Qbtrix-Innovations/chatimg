<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import ProfileButton from '$lib/components/ProfileButton.svelte';
	import { Forward, SearchIcon } from 'lucide-svelte';
	import PrimaryButton from '$lib/components/primaryButton.svelte';
	import { goto } from '$app/navigation';
	import { userData } from '$lib/stores/user/userStore';
	export let data;
	const root = `${import.meta.env.VITE_SITE_DOMAIN}/`;
	export let shareButton: boolean | undefined = false;
	export let newChatButton: boolean | undefined = false;
	function createNewChat() {
		goto('/newChat');
	}
	const share = async () => {
		let titleText;
		let urlText;
		let textText;
		let shareData;
		if (data.imagesDataArray.length > 0) {
			titleText = data.imagesDataArray[0].imageUrl.split('.com_')[1].split('?alt')[0].slice(14);
			textText = '';
			for (let index = 0; index < data.MessagesDataArray.length; index++) {
				const element = data.MessagesDataArray[index];
				textText = textText + '_;_' + element.text;
			}
			console.log(textText);
			textText += data.imagesDataArray[0].imageUrl;
			// urlText =  data.imagesDataArray[0].imageUrl;
			urlText = root + 'chats/shared/' + data.uid;
			console.log(urlText);
			shareData = {
				title: `Chat shared by ${$userData.userName}`,
				text: 'Use ChatImg to talk with Images and watch them come alive.',
				url: urlText
			};
			// console.log(shareData);
			// const shareDataJSON = JSON.stringify(shareData);
			// const base64ShareData = btoa(shareDataJSON);
			// const shareableLink = `https://localhost/share?data=${encodeURIComponent(base64ShareData)}`;
			// console.log(shareDataJSON);
			// console.log(base64ShareData);
			// console.log(shareableLink);
		}
		// Check if the Web Share API is supported
		if (navigator.share) {
			// Try to share the data
			try {
				await navigator.share(shareData);
				console.log('Data shared successfully');
			} catch (err) {
				// Handle any errors
				console.error('Error while sharing:', err);
			}
		} else {
			// Fallback to some other sharing method
			console.log('Web Share API not supported');
		}
		// return;
	};
</script>

<header class="bg-card1 py-3.5 px-3 border-b border-[#607D8B] border-opacity-[15%]">
	<nav class="flex justify-between">
		<div>
			<img class="w-28 block dark:hidden" src="/images/logo-blue.png" alt="" />
			<img class="w-28 hidden dark:block" src="/images/logo-dark.png" alt="" />
		</div>
		<div class="relative w-2/6">
			<Input class="bg-white rounded-[30px]" placeholder="Type to search..." />
			<SearchIcon class="absolute top-2.5 right-4 w-5 h-5 dark:text-black" />
		</div>
		<div class="flex items-center">
			{#if shareButton}
				<button
					on:click={share}
					class="p-1 bg-[#D9D9D9] mr-4 flex justify-center items-center rounded-full"
				>
					<Forward class="w-5 h-5" />
				</button>
			{/if}
			{#if newChatButton}
				<PrimaryButton onClick={createNewChat} class="h-[25px] mr-2" text="New Chat" />
			{/if}
			<ProfileButton />
		</div>
	</nav>
</header>
