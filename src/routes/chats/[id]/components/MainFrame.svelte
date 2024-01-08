<script lang="ts">
	import { PromptTemplate } from 'langchain/prompts';
	import { clsx } from 'clsx';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import CommonNavbar from '$lib/components/TopNavbar.svelte';
	import MessageBar from '$lib/components/MessageBar.svelte';
	import { goto, afterNavigate } from '$app/navigation';
	import { userData } from '$lib/stores/user/userStore';
	import { app, db } from '$lib/firebase/firebase';
	import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
	import Compressor from 'compressorjs';
	import {
		addMessageToChat,
		getMessagesOfIndividualChatOrdered
	} from '../../../../services/messageServices';
	import { updateLastMessagePreviewByChatById } from '../../../../services/chatService';
	import { addIndividualImageToChatService } from '../../../../services/imageService';
	import { Clipboard, ThumbsDown, ThumbsUp } from 'lucide-svelte';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { getOpenAiReply, getOpenAiReplyWithoutImage } from '../../../../services/llmService';
	import chatsData from '$lib/stores/chats/chatStore';

	let completeUploadFunction;
	let uploading = false;
	let email = $userData.email;
	let compressedFile;
	let compressedFileSize: number;
	let compressedFileType: string;
	let photoUrl: string;
	$: {
		completeUploadFunction = () => {
			uploading = true;
			// console.log('changed');
			const storage = getStorage(app);
			const upload = () => {
				const name = email + '_' + new Date().getTime() + '_' + file.name;
				const storageRef = ref(storage, name);
				function compressAndUploadImage(file: File | Blob) {
					new Compressor(file, {
						quality: 0.8, // the quality of the output image, the higher the better quality but larger file
						maxWidth: 1024, // the max width of the output image
						maxHeight: 1024, // the max height of the output image
						success(result) {
							// Create a file reference
							compressedFile = result;
							const uploadTask = uploadBytesResumable(storageRef, result);
							compressedFileSize = result.size;
							compressedFileType = file.type;
							uploadTask.on(
								'state_changed',
								(
									/** @type {{ bytesTransferred: number; totalBytes: number; state: any; }} */ snapshot
								) => {
									const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
									console.log('Upload is ' + progress + '% done');
									switch (snapshot.state) {
										case 'paused':
											console.log('Upload is paused');
											break;
										case 'running':
											console.log('Upload is running');
											break;
									}
								},
								(error) => {
									console.log(error);
								},
								() => {
									getDownloadURL(uploadTask.snapshot.ref)
										.then((downloadURL) => {
											photoUrl = downloadURL;
										})
										.then(() => {
											saveNewImage();
										});
								}
							);
						},
						error(err) {
							console.log(err.message);
						}
					});
				}
				compressAndUploadImage(file);
			};
			file && upload();
			uploading = false;
		};
		file && completeUploadFunction();
	}
	async function saveNewImage() {
		try {
			const part = [];
			part.push($userData.id);
			const ua = {};
			const ImagesRef = await addIndividualImageToChatService(
				{
					uploadedBy: $userData.id,
					// @ts-ignore
					uploadedAt: ua,
					imageUrl: photoUrl,
					thumbnailUrl: photoUrl,
					fileSize: compressedFileSize,
					fileType: compressedFileType
				},
				data.uid
			);
			data.imagesDataArray = [...data.imagesDataArray, ImagesRef];
			goto(`/chats/${data.uid}`);
		} catch (err) {
			console.log(err);
			console.log('There was an error saving your information');
		}
	}
	let previousPage: any;
	// @ts-ignore
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});

	let loading = false;
	let file: any;
	export let data: any;
	console.log(data);
	let searchVal: string;
	const sendMessage = async () => {
		// Add user message to chat
		const sa = {};
		const messageRef = await addMessageToChat(
			{
				sentBy: $userData.id,
				// @ts-ignore
				sentAt: sa,
				text: searchVal,
				isEdited: false,
				isDeleted: false
			},
			data.uid
		);

		// Retreive chats from firestore and display on the screen
		data.MessagesDataArray = await getMessagesOfIndividualChatOrdered(data.uid);

		// Clear the search val (that is clear the message written in the bottom box).
		const msgVal = searchVal;
		searchVal = '';

		// Update the LastMessagePreview of this chat
		await updateLastMessagePreviewByChatById(data.uid, msgVal);

		// Get response from openAI and Langchain
		let openAiResponse;
		if (data.imagesDataArray.length > 0) {
			openAiResponse = await getOpenAiReply(msgVal, data);
		} else {
			openAiResponse = await getOpenAiReplyWithoutImage(msgVal, data);
		}

		// Add that message to backend
		const messagesRefOpenAI = await addMessageToChat(
			{
				sentBy: 'GPT',
				// @ts-ignore
				sentAt: sa,
				text: openAiResponse,
				isEdited: false,
				isDeleted: false
			},
			data.uid
		);

		// Retreive all the messages for this chat and rerender the page to show aal of them.
		data.MessagesDataArray = await getMessagesOfIndividualChatOrdered(data.uid);
	};
	let copySuccess = false;
	const copyToClipboard = (inpVal: string) => {
		let textToCopy = document.getElementById(inpVal)?.innerHTML;
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
</script>

<section
	class="w-full mx-auto overflow-y-auto xl:max-h-[calc(100vh-75px)] max-h-[calc(100vh-50px)] relative"
>
	<div class="w-full absolute bottom-14 z-50">
		<div class="flex w-full justify-center">
			<MessageBar
				onClickedNavigationToNewChat={false}
				sentMessageClicked={sendMessage}
				bind:file
				bind:inpVal={searchVal}
				class="max-w-[600px]"
			/>
		</div>
	</div>
	<div class="xl:w-5/6 2xl:w-5/6 w-full px-4 mx-auto">
		<Tabs.Root value="chat" class="w-full xl:px-8 px-0 pt-4 relative">
			<Tabs.Content value="chat" class="w-full h-full pb-20">
				<div class="w-full flex flex-col lg:items-end items-center xl:pt-8 pt-1">
					<img
						class="lg:w-[425px] lg:h-[250px] w-[450px] h-[250px] object-cover rounded-[12px_12px_4px_12px]"
						src={`${data?.imagesDataArray[0]?.imageUrl}`}
						alt=""
					/>
					<div class="lg:hidden block w-full">
						<div
							class={clsx(
								'flex w-full justify-center h-3 py-2  opacity-50 font-normal text-[16px] leading-3 text-[#607d8b]'
							)}
						>
							Ask anything about this Image below.
						</div>
						<hr class={clsx('w-full mt-2 opacity-40 border-[#607d8b] border-dashed border-t-2')} />
					</div>
					<div class="lg:grid hidden grid-cols-2 w-[425px] gap-2 pt-4">
						<div
							class="p-1 bg-[rgba(225,245,254,0.20)] border-2 rounded-[10px] border-[1px_solid_rgba(96,125,139,0.20)] shadow-[0px_2px_83px_0px_rgba(0,0,0,0.03)] text-center"
						>
							what is his name?
						</div>
						<div
							class="p-1 bg-[rgba(225,245,254,0.20)] border-2 rounded-[10px] border-[1px_solid_rgba(96,125,139,0.20)] shadow-[0px_2px_83px_0px_rgba(0,0,0,0.03)] text-center"
						>
							what is his name?
						</div>
						<div
							class="p-1 bg-[rgba(225,245,254,0.20)] border-2 rounded-[10px] border-[1px_solid_rgba(96,125,139,0.20)] shadow-[0px_2px_83px_0px_rgba(0,0,0,0.03)] text-center"
						>
							is this doctor strange?
						</div>
						<div
							class="p-1 bg-[rgba(225,245,254,0.20)] border-2 rounded-[10px] border-[1px_solid_rgba(96,125,139,0.20)] shadow-[0px_2px_83px_0px_rgba(0,0,0,0.03)] text-center"
						>
							recognise the person
						</div>
					</div>
				</div>
				<div class="w-full flex flex-col">
					{#each data.MessagesDataArray as conversation}
						{#if conversation.sentBy !== 'GPT'}
							<div
								class={clsx(
									'text-[16px] w-5/6 grid-flow-col dark:bg-slate-800 break-words text-[rgba(38,50,56,1)] dark:text-white/80  leading-6 self-end bg-[rgba(38,50,56,0.05)] rounded-bl-[12px] rounded-tl-[12px] rounded-tr-[4px] rounded-br-[12px] py-1 px-4 my-2 mr-2'
								)}>
								<div>
									{conversation.text}
								</div>
								<div
									class="h-3 opacity-70 justify-end grid text-[10px] leading-3 font-medium text-[#6e6e6e] text-white/50 px-2"
								>
									{new Date(conversation.sentAt.seconds * 1000).toString().slice(3, 21)}
								</div>
							</div>
						{:else}
							<div
								class={clsx(
									'text-[16px] p-4 w-5/6 self-start bg-[rgba(178,223,219,0.59)] rounded-bl-[12px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[4px] h-fit max-w-fit py-2 my-2 ml-2'
								)}
							>
								<div class="" id={conversation.sentAt.seconds.toString()}>
									{conversation.text}
								</div>
								<div class="flex flex-row justify-between pr-2 pt-2 items-center align-middle">
									<div class="flex flex-row justify-center px-2">
										<Button class="bg-transparent px-1" size="sm">
											<ThumbsUp size="15" color="#607D8B" opacity="0.5" />
										</Button>
										<Button class="bg-transparent px-1" size="sm">
											<ThumbsDown size="15" color="#607D8B" opacity="0.5" />
										</Button>
										<Button
											on:click={() => {
												copyToClipboard(conversation.sentAt.seconds.toString());
											}}
											class="bg-transparent px-1 pl-2 active:scale-[75%]"
											size="sm"
										>
											<Clipboard size="15" fill="#607D8B" fill-opacity="0.5" />
											<div
												class="pl-1 leading-6 text-[12px] font-normal text-[rgba(96,125,139,0.5)]"
											>
												Copy
											</div>
										</Button>
									</div>
									<div
										class="text-[rgba(110,110,110,1)] leading-3 font-medium text-[10px] dark:text-white/60 opacity-70"
									>
										{new Date(conversation.sentAt.seconds * 1000).toString().slice(0, 21)}
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
