<script lang="ts">
	import { goto } from '$app/navigation';
	import PrimaryButton from '$lib/components/primaryButton.svelte';
	import { userData } from '$lib/stores/user/userStore';
	import { ChevronLeft, Forward } from 'lucide-svelte';
	export let data;
	const root = `${import.meta.env.VITE_SITE_DOMAIN}/`;
	function back() {
		goto('/home');
	}
	function goToNewChat() {
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

<nav class="p-3 flex justify-between items-center">
	<div class="flex items-center text-[14px] font-[500] text-[#263238] dark:text-white/80">
		<button on:click={back}>
			<ChevronLeft />
		</button>
		{data.imagesDataArray.length > 0
			? decodeURIComponent(
					data.imagesDataArray[0].imageUrl.split('.com_')[1].split('?alt')[0].slice(14, 34)
			  ) + ''
			: 'Upload an Image'}
	</div>
	<div class="flex items-center gap-2">
		<button on:click={share} class="bg-[#D9D9D9] w-[21px] h-[21px] flex justify-center items-center rounded-full">
			<Forward class="w-[16px] h-[16px] dark:text-black" />
		</button>
		<PrimaryButton onClick={goToNewChat} class="h-[29px] text-[12px]" size={'sm'} text={'New'} />
	</div>
</nav>
