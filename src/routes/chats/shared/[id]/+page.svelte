<script>
	import { clsx } from 'clsx';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
	// import CommonNavbar from '$lib/components/CommonNavbar.svelte';
	// import MessageBar from '$lib/components/MessageBar.svelte';
	import { goto, afterNavigate } from '$app/navigation';
	// import { userData } from '$lib/stores/user/userStore';
	// import { chatsData } from '$lib/stores/chats/chatStore';
	// import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
	// import Compressor from 'compressorjs';
	import { ThumbsDown, ThumbsUp,Clipboard } from 'lucide-svelte';

	// import { onMount } from 'svelte';
	// import { chatsData } from '$lib/stores/chats/chatStore';
	// import { files } from '$service-worker';
	const root = 'http://localhost:5173/'
	let completeUploadFunction;
	let uploading=false;
	// let email = $userData.email;
	let compressedFile;
	/**
	 * @type {number}
	 */
	let compressedFileSize;
	/**
	 * @type {string}
	 */
	let compressedFileType;
	/**
	 * @type {string}
	 */
	let photoUrl;
	// $: {
	// 	completeUploadFunction = () => {
	// 		uploading = true;
	// 		// console.log('changed');
	// 		const storage = getStorage(app);
	// 		const upload = () => {
	// 			const name = email + '_' + new Date().getTime() + '_' + file.name;
	// 			const storageRef = ref(storage, name);
	// 			/**
	// 			 * @param {File | Blob} file
	// 			 */
	// 			function compressAndUploadImage(file) {
	// 				new Compressor(file, {
	// 					quality: 0.8, // the quality of the output image, the higher the better quality but larger file
	// 					maxWidth: 1920, // the max width of the output image
	// 					maxHeight: 1080, // the max height of the output image
	// 					success(result) {
	// 						// Create a file reference
	// 						compressedFile = result;
	// 						const uploadTask = uploadBytesResumable(storageRef, result);
	// 						compressedFileSize = result.size;
	// 						compressedFileType = file.type;
	// 						uploadTask.on(
	// 							'state_changed',
	// 							(/** @type {{ bytesTransferred: number; totalBytes: number; state: any; }} */ snapshot) => {
	// 								const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	// 								console.log('Upload is ' + progress + '% done');
	// 								switch (snapshot.state) {
	// 									case 'paused':
	// 										console.log('Upload is paused');
	// 										break;
	// 									case 'running':
	// 										console.log('Upload is running');
	// 										break;
	// 								}
	// 							},
	// 							(error) => {
	// 								console.log(error);
	// 							},
	// 							() => {
	// 								getDownloadURL(uploadTask.snapshot.ref)
	// 									.then((downloadURL) => {
	// 										photoUrl = downloadURL;
	// 									})
	// 									.then(() => {
	// 										createNewChat();
	// 									});
	// 							}
	// 						);
	// 					},
	// 					error(err) {
	// 						console.log(err.message);
	// 					}
	// 				});
	// 			}
	// 			compressAndUploadImage(file);
	// 		};
	// 		file && upload();
	// 		uploading = false;
	// 	};
	// 	file && completeUploadFunction();
	// }
	// async function createNewChat() {
	// 	try {
	// 		const part = [];
	// 		part.push($userData.id);
	// 		const ImagesRef = await addDoc(collection(db, `chats/${data.uid}/images`), {
	// 			uploadedBy: $userData.id,
	// 			uploadedAt: serverTimestamp(),
	// 			imageUrl: photoUrl,
	// 			thumbnailUrl: photoUrl,
	// 			fileSize: compressedFileSize,
	// 			fileType: compressedFileType
	// 			// metaData:,
	// 		});
	// 		// console.log(ImagesRef);
	// 		data.imagesDataArray = [...data.imagesDataArray,{
	// 			uploadedBy: $userData.id,
	// 			uploadedAt: serverTimestamp(),
	// 			imageUrl: photoUrl,
	// 			thumbnailUrl: photoUrl,
	// 			fileSize: compressedFileSize,
	// 			fileType: compressedFileType
	// 			// metaData:,
	// 		}];
	// 		// goto(`/chats/${data.uid}`);

	// 	} catch (err) {
	// 		console.log(err);
	// 		console.log('There was an error saving your information');
	// 	}
	// }
	/**
	 * @type {any}
	 */
	let previousPage;
	// @ts-ignore
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});
	function back() {
		// console.log(previousPage);
		// goto(previousPage);
        return;
	}
	function goToNewChat() {
		// goto('/newChat');
        return;
	}
	// const share = async ()=>{
	// 	let titleText;
	// 	let urlText;
	// 	let textText;
	// 	let shareData;
	// 	if (data.imagesDataArray.length>0) {
	// 		titleText = data.imagesDataArray[0].imageUrl.split('.com_')[1].split('?alt')[0].slice(14,);
	// 		textText = '';
	// 		for (let index = 0; index < data.MessagesDataArray.length; index++) {
	// 			const element = data.MessagesDataArray[index];
	// 			textText=textText+'_;_'+element.text;
	// 		}
	// 		console.log(textText);
	// 		textText+=data.imagesDataArray[0].imageUrl;
	// 		// urlText =  data.imagesDataArray[0].imageUrl;
	// 		urlText = root+'chats/shared/'+data.uid;
	// 		console.log(urlText);
	// 		shareData = {
	// 			title: `Chat shared by ${$userData.userName}`,
	// 			text:'Use ChatImg to talk with Images and watch them come alive.',
	// 			url:urlText
	// 		}
	// 		console.log(shareData);
	// 		// const shareDataJSON = JSON.stringify(shareData);
	// 		// const base64ShareData = btoa(shareDataJSON);
	// 		// const shareableLink = `https://localhost/share?data=${encodeURIComponent(base64ShareData)}`;
	// 	}
	// 	// Check if the Web Share API is supported
	// 	if (navigator.share) {
	// 	  // Try to share the data
	// 	  try {
	// 	    await navigator.share(shareData);
	// 	    console.log("Data shared successfully");
	// 	  } catch (err) {
	// 	    // Handle any errors
	// 	    console.error("Error while sharing:", err);
	// 	  }
	// 	} else {
	// 	  // Fallback to some other sharing method
	// 	  console.log("Web Share API not supported");
	// 	}
	// 	// return;
	// }
	let loading = false;

	/**
	 * @type {any}
	 */
	let file;
	let images;
	// onMount(()=>{})
	export let data;
	/**
	 * @type {string}
	 */
	let searchVal;
	// const sendMessage = async () => {
	// 	const messagesRef = await addDoc(collection(db, `chats/${data.uid}/messages`), {
	// 		sentBy: $userData.id,
	// 		sentAt: serverTimestamp(),
	// 		text: searchVal,
	// 		isEdited: false,
	// 		isDeleted: false
	// 	});
	// 	const querySnapshotMsg = await getDocs(collection(db, `chats/${data.uid}/messages`));
	// 	// Extract data from query snapshot
	// 	const MessagesData = querySnapshotMsg.docs.map((doc) => doc.data());
	// 	data.MessagesDataArray = MessagesData;
	// 	await updateDoc(doc(db,`chats`,data.uid),{
	// 		lastMessagePreview:searchVal,
	// 		lastMessage:serverTimestamp()
	// 	});
	// 	// data.MessagesDataArray=[...data.MessagesDataArray,{
	// 	// 		sentBy: $userData.id ,
	// 	// 		sentAt: serverTimestamp(),
	// 	// 		text: searchVal,
	// 	// 		isEdited: false,
	// 	// 		isDeleted: false
	// 	// 	}];
	// 	searchVal = '';
	// };
	let copySuccess = false;	
	const copyToClipboard = (/** @type {string} */ inpVal) => {
		let textToCopy = document.getElementById(inpVal)?.innerHTML ;
		const textarea = document.createElement('textarea');
		// @ts-ignore
		textarea.value = textToCopy;
		document.body.appendChild(textarea);
		textarea.select();
		try {
			const successful = document.execCommand('copy');
			copySuccess = successful;
		} catch (err) {
			console.error('Unable to copy to clipboard', err);
		}
		document.body.removeChild(textarea);
	};
    /**
     * <CommonNavbar
				leftProfile={false}
				handleLeftTextClick={back}
				handleSecondFromRightClick={share}
				handleRightTextClick={goToNewChat}
				headingLeft={data.imagesDataArray.length > 0
					? data.imagesDataArray[0].imageUrl.split('.com_')[1].split('?alt')[0].slice(14, 34) +
					  '...'
					: 'Upload an Image'}
				buttonTextRight="New"
				shareAvailable="true"
			/>
    
    *		<MessageBar
			sentMessageClicked={sendMessage}
			imgUploadClicked={() => {}}
			bind:file
			bind:inpVal={searchVal}
			class="mt-[92vh]"
		/>
    */
</script>

<div class={clsx('bg-[#f5f5f5] h-[100vh]')}>
	<div class={clsx('flex flex-col w-screen justify-between items-center')}>
		<div class={clsx('flex flex-col w-full items-center')}>
			<hr
				class={clsx(
					'bg-[#ededed] mt-[12%] fixed border-[1px] border-solid border-[#ededed] w-full'
				)}
			/>
			{#if loading}
				<Skeleton
					class={clsx('w-[85%] fixed mt-[15%] h-[25%] rounded-[8px] bg-[#d9d9d9] self-center')}
				/>
				<div
					class={clsx(
						'text-center h-3 opacity-50 w-fit font-normal text-[10px] leading-3 text-[#607d8b] mt-[10px]'
					)}
				>
					Loading...
				</div>
			{:else if data.imagesDataArray.length > 0}
				<img
					src={`${data.imagesDataArray[0].imageUrl}`}
					alt="..."
					class={clsx('w-[85%] mt-[15%] fixed h-[25%] rounded-[8px] bg-[#d9d9d9] self-center')}
				/>
				<div
					class={clsx(
						'text-center fixed h-3 pt-1 mt-[33vh] md:mt-[44vh] sm:mt-[41vh]  opacity-50 w-fit font-normal text-[10px] leading-3 text-[#607d8b]'
					)}
				>
					Ask anything about this Image below.
				</div>
				<hr
					class={clsx(
						'w-[90%] fixed mt-[36vh] md:mt-[47vh] sm:mt-[44vh] opacity-40 border-[#607d8b] border-dashed border-t-2'
					)}
				/>
			{/if}
			<div
				class={clsx(
					`${
						data.imagesDataArray.length > 0
							? ' mt-[36vh] md:mt-[47vh] sm:mt-[44vh] h-[55vh]'
							: 'mt-[7vh] h-[85vh]'
					} mb-[3vh] overflow-y-scroll flex flex-col w-full`
				)}
			>
				{#if loading}
					<Skeleton
						class={clsx(
							'bg-[#d9d9d9] w-3/4 rounded-bl-[0.5px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] h-28 p-2 my-2 ml-2 self-start'
						)}
					/>
					<Skeleton
						class={clsx(
							'bg-[#d9d9d9] w-3/4 rounded-bl-[10px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[0.5px] h-16 p-2 my-2 mr-2 self-end'
						)}
					/>
					<Skeleton
						class={clsx(
							'bg-[#d9d9d9] w-3/4 rounded-bl-[0.5px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] h-24 p-2 my-2 ml-2 self-start'
						)}
					/>
				{:else}
					{#each data.MessagesDataArray as conversation}
						{#if conversation.sentBy !== 'GPT'}
							<div
								class={clsx(
									'text-[16px] grid-flow-col break-words text-[rgba(38,50,56,1)] w-[75%] leading-6 self-end bg-[rgba(38,50,56,0.05)] rounded-bl-[12px] rounded-tl-[12px] rounded-tr-[4px] rounded-br-[12px] py-1 px-4 my-2 mr-2'
								)}
							>
								<div>
									{conversation.text}
								</div>
								<div
									class="h-3 opacity-70 ml-[50%] justify-self-end grid text-[10px] leading-3 font-medium text-[#6e6e6e] px-2 w-fit"
								>
									{new Date(conversation.sentAt.seconds * 1000).toString().slice(3, 21)}
								</div>
							</div>
						{:else}
							<div
								class={clsx(
									'text-[16px] w-3/4 self-start bg-[rgba(226,239,238,0.9)] rounded-bl-[12px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[4px] h-fit max-w-fit py-2 my-2 ml-2'
								)}
							>
								<div class="pl-4" id={conversation.sentAt.seconds}>{conversation.text}</div>
								<div class="flex flex-row justify-between pr-2 pt-2 items-center align-middle">
									<div class="flex flex-row justify-center px-2">
										<Button class="bg-transparent px-1" size="sm">
											<ThumbsUp height="1" width="1" color="#607D8B" opacity="0.5" />
										</Button>
										<Button class="bg-transparent px-1" size="sm">
											<ThumbsDown height="1" width="1" color="#607D8B" opacity="0.5" />
										</Button>
										<Button
											on:click={() => {
												copyToClipboard(conversation.sentAt.seconds.toString());
											}}
											class="bg-transparent px-1 pl-2 active:scale-[75%]"
											size="sm"
										>
											<Clipboard size="10" color="#607D8B" fill-opacity="0.5" />
											<div
												class="pl-1 leading-6 text-[12px] font-normal text-[rgba(96,125,139,0.5)]"
											>
												Copy
											</div>
										</Button>
									</div>
									<div
										class="text-[rgba(110,110,110,1)] leading-3 font-medium text-[10px] opacity-70"
									>
										{new Date(conversation.sentAt.seconds * 1000).toString().slice(0, 21)}
									</div>
								</div>
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
