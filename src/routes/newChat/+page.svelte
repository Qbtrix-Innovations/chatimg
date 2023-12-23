<script>
	import { Undo2 } from 'lucide-svelte';
	import { text } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import CommonMessageBar from '$lib/components/CommonMessageBar.svelte';
	import { clsx } from 'clsx';
	import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
	import { app, auth, db } from '../../lib/services/firebase/firebase';
	import { addDoc, collection, getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
	import { authStore } from '$lib/stores/userauth/authStore';
	import { userData } from '$lib/stores/user/userStore';
	import Compressor from 'compressorjs';
	import OpenAI from 'openai';
	import { addNewChatService } from '../../services/chatService';
	import { addImageToChatService } from '../../services/imageService';
	import { addMessageToChat } from '../../services/messageServices';
	
	/**
	 * @type {string | null | undefined}
	 */
	let userName;
	$: userName = $authStore?.currentUser?.displayName;
	/**
	 * @type {string | null | undefined}
	 */
	let email;
	$: email = $authStore?.currentUser?.email;
	let uploading = false;
	/**
	 * @type {string | undefined}
	 */
	let uid;
	$: uid = $authStore?.currentUser?.uid;
	/**
	 * @type {File}
	 */
	let file;
	/**
	 * @type {string}
	 */
	let photoUrl;
	/**
	 * @type {Blob | ArrayBuffer}
	 */
	let compressedFile;
	/**
	 * @type {string}
	 */
	let compressedFileType;
	/**
	 * @type {number}
	 */
	let compressedFileSize;
	/**
	 * @type {import("../../lib/core/entities/Image").Image}
	 */
	let img;
	/**
	 * @type {string}
	 */
	let searchVal;
	/**
	 * @type {() => void}
	 */
	let completeUploadFunction;
	$: {
		completeUploadFunction = async () => {
			uploading = true;
			console.log('changed');
			const storage = getStorage(app);
			const upload = () => {
				const name = email + '_' + new Date().getTime() + '_' + file.name;
				const storageRef = ref(storage, name);
				/**
				 * @param {File | Blob} file
				 */
				function compressAndUploadImage(file) {
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
								(snapshot) => {
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
											createNewChat();
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
			// photoUrl = await uploadImages(email,file,uid);
			file && upload();
			// if (file) {
			// 	// @ts-ignore
			// 	uploadImages(email,file,uid).then((img2)=>{
			// 		img=img2;
			// 	}).then(()=>{
			// 		createNewChat();
			// 	})
			// }
			uploading = false;
		};
		file && completeUploadFunction();
	}

	async function createNewChat() {
		try {
			const part = [uid];
			// @ts-ignore
			const chatsRef = await addNewChatService(part);
			const img = {
				uploadedBy: uid,
				uploadedAt: new Date(),
				imageUrl: photoUrl,
				thumbnailUrl: photoUrl,
				fileSize: compressedFileSize,
				fileType: compressedFileType
			};
			// @ts-ignore
			const ImagesRef = await addImageToChatService(img, chatsRef.id);
			const openai = new OpenAI({
				apiKey: import.meta.env.VITE_OPENAI_API_KEY,
				dangerouslyAllowBrowser: true
			});
			console.log(ImagesRef[0].imageUrl);
			const response = await openai.chat.completions.create({
				model: 'gpt-4-vision-preview',
				max_tokens: 1024,
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: 'Give a detailed description of the given image. This description will be further passed on to another Large Language Model where it will be used for answering various questions that are asked by the user. Only reply with the descriptino for the image and nothing more as the description will also be shown to the user.'
							},
							{
								type: 'image_url',
								image_url: {
									url: `${ImagesRef[0].imageUrl}`,
									detail: 'high'
								}
							}
						]
					}
				]
			});
			const messagesRefOpenAI = await addMessageToChat(
				{
					sentBy: 'GPT',
					// @ts-ignore
					sentAt: {},
					// @ts-ignore
					text: `${response.choices[0].message.content}`,
					isEdited: false,
					isDeleted: false
				},
				chatsRef.id
			);
			goto(`/chats/${chatsRef.id}`);
		} catch (err) {
			console.log(err);
			console.log('There was an error saving your information');
		}
	}
	async function createNewChatFromMessage() {
		if (searchVal.length > 0) {
			try {
				const part = [];
				part.push(uid);
				// @ts-ignore
				const chatsRef = await addNewChatService(part);
				const messageRef = await addMessageToChat(
					{
						// @ts-ignore
						sentBy: uid,
						// @ts-ignore
						sentAt: {},
						text: searchVal,
						isEdited: false,
						isDeleted: false
					},
					chatsRef.id
				);
				const openai = new OpenAI({
					apiKey: import.meta.env.VITE_OPENAI_API_KEY,
					dangerouslyAllowBrowser: true
				});
				const response = await openai.chat.completions.create({
					model: 'gpt-4-vision-preview',
					max_tokens: 300,
					messages: [
						{
							role: 'user',
							content: [
								{
									type: 'text',
									text: `${searchVal}`
								}
							]
						}
					]
				});
				const messagesRefOpenAI = await addMessageToChat(
					{
						sentBy: 'GPT',
						// @ts-ignore
						sentAt: {},
						// @ts-ignore
						text: response.choices[0].message.content,
						isEdited: false,
						isDeleted: false
					},
					chatsRef.id
				);
				goto(`/chats/${chatsRef.id}`);
			} catch (err) {
				console.log(err);
				console.log('There was an error saving your information');
			}
		}
	}
</script>

<div class="bg-[#f5f5f5] h-screen flex flex-col">
	<div class="font-semibold text-[14px] text-[#263238] mt-2 ml-4 flex flex-row justify-between">
		<div>
			Chat Img
			{#if userName}
				<span
					class="text-transparent ml-[2px] bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
				>
					Hi {userName?.split(' ')[0]} !</span
				>
			{/if}
		</div>
		<button on:click={()=>{goto('/home')}}>
			<Undo2/>
		</button>
	</div>
	<div class="mt-[70%] h-1/2 flex flex-col">
		<div class="flex items-center justify-center active:scale-[85%] transition-transform">
			<div
				class="flex items-center justify-center w-[85%] rounded-2xl h-[58px] bg-gradient-to-t from-[rgba(76,175,80,1)] to-[rgba(100,197,104,0.43)] shadow-[0px_4px_3.7px_0px_rgba(0, 0, 0, 0.22)] border-dashed border-[2px] border-[rgba(200,200,200,1)]"
			>
				<label
					class="w-64 flex flex-col items-center px-4 py-6 text-white rounded-lg tracking-wide cursor-pointer"
				>
					<span class="mt-2 text-base leading-normal">+ Upload Image</span>
					<input
						type="file"
						accept="image/*;pdf/*"
						name="file"
						on:change={(/**@type {any}*/ e) => {
							file = e.target.files[0];
						}}
						class="hidden"
					/>
				</label>
			</div>
		</div>
		<div
			class="flex mt-4 self-center h-[24px] w-1/2 opacity-[44%] font-medium text-[10px] text-center items-center leading-3"
		>
			Upload an image or take a photo by clicking here to start chatting.
		</div>
		<hr class="w-full mt-4 border-[0.2px] bg-[#eaeaea]" />
	</div>
	<div
		class={clsx(
			'flex fixed flex-row mt-[92vh] w-[90%] self-center justify-center items-center rounded-[21px]'
		)}
	>
		<CommonMessageBar
			bind:file
			imgUploadClicked={completeUploadFunction}
			sentMessageClicked={createNewChatFromMessage}
			bind:inpVal={searchVal}
			class="mt-8"
		/>
	</div>
</div>
