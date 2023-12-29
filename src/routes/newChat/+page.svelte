<script lang="ts">
	import { Loader2, Undo2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import MessageBar from '$lib/components/MessageBar.svelte';
	import { clsx } from 'clsx';
	import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
	import { app, auth, db } from '../../lib/firebase/firebase';
	import { authStore } from '$lib/stores/userauth/authStore';
	import Compressor from 'compressorjs';
	import OpenAI from 'openai';
	import { addNewChatService } from '../../services/chatService';
	import { addImageToChatService } from '../../services/imageService';
	import { addMessageToChat } from '../../services/messageServices';
	import { ImagePlus } from 'lucide-svelte';
	import type { Image } from '$lib/core/entities/Image';
	import Modal from '$lib/components/Modal.svelte';
	import {
		getVisionAPIResponse,
		getVisionAPIResponseWithoutImage
	} from '../../services/llmService';
	import { doc, updateDoc } from 'firebase/firestore';
	import { userData } from '$lib/stores/user/userStore';
	let waiting = false;
	let waitingExtra = false;
	let displayError = '';
	let userName: string | null | undefined;
	$: userName = $authStore?.currentUser?.displayName;
	let email: string | null | undefined;
	$: email = $authStore?.currentUser?.email;
	let uploading = false;
	let uid: string | undefined;
	$: uid = $authStore?.currentUser?.uid;
	let file: File;
	let photoUrl: string;
	let compressedFile: Blob | ArrayBuffer;
	let compressedFileType: string;
	let compressedFileSize: number;
	let img: Image;
	let messageVal: string;
	let completeUploadFunction: () => void;
	$: {
		completeUploadFunction = async () => {
			uploading = true;
			waiting = true;
			console.log('changed');
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
										})
										.then(() => {
											waiting = false;
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
	async function createNewChat() {
		const part = [uid];
		// @ts-ignore
		const chatsRef = await addNewChatService(part);
		if (!(chatsRef.id.length > 1)) {
			displayError = 'New Chat not created.Please Try again.';
			return displayError;
		}
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
		if (!ImagesRef[0].imageUrl) {
			displayError = 'Image not Uploaded.Please Try again.';
			return displayError;
		}
		let response = await getVisionAPIResponse(ImagesRef);
		let count = 0;
		while (response === 'ERROR: Something went wrong. Please try again.') {
			response = await getVisionAPIResponse(ImagesRef);
			count++;
			console.log(count);
			if (count > 1) {
				waitingExtra = true;
			}
			if (count > 5) break; // If it fails to send the request for more than 5 times, stop trying
		}
		if (count > 5 && response === 'ERROR: Something went wrong. Please try again.') {
			displayError = 'Could not get Vision API Response. Please try again.';
			return displayError;
		}
		const messagesRefOpenAI = await addMessageToChat(
			{
				sentBy: 'GPT',
				// @ts-ignore
				sentAt: {},
				// @ts-ignore
				text: `${response}`,
				isEdited: false,
				isDeleted: false
			},
			chatsRef.id
		);
		if (!messagesRefOpenAI.text) {
			displayError = 'Could not save Vision API Response. Please try again.';
			return displayError;
		}
		const sub = await updateDoc(
			doc(db, `users/${$userData.id}/subscriptionDetals/${$userData.subscriptionDetails.sid}`),
			{}
		);
		goto(`/chats/${chatsRef.id}`);
	}
	async function createNewChatFromMessage() {
		if (messageVal.length > 0) {
			try {
				const part = [];
				part.push(uid);
				// @ts-ignore
				const chatsRef = await addNewChatService(part);
				if (!(chatsRef.id.length > 1)) {
					displayError = 'New Chat not created.Please Try again.';
					return displayError;
				}
				const messageRef = await addMessageToChat(
					{
						// @ts-ignore
						sentBy: uid,
						// @ts-ignore
						sentAt: {},
						text: messageVal,
						isEdited: false,
						isDeleted: false
					},
					chatsRef.id
				);
				if (!messageRef.text) {
					displayError = 'Could not save your message. Please try again.';
					return displayError;
				}
				let response = await getVisionAPIResponseWithoutImage(messageVal);
				let count = 0;
				while (response === 'ERROR: Something went wrong. Please try again.') {
					response = await getVisionAPIResponseWithoutImage(messageVal);
					count++;
					console.log(count);
					if (count > 1) {
						waitingExtra = true;
					}
					if (count > 5) break; // If it fails to send the request for more than 5 times, stop trying
				}
				if (count > 5 && response === 'ERROR: Something went wrong. Please try again.') {
					displayError = 'Could not get Vision API Response. Please try again.';
					return displayError;
				}
				const messagesRefOpenAI = await addMessageToChat(
					{
						sentBy: 'GPT',
						// @ts-ignore
						sentAt: {},
						// @ts-ignore
						text: response,
						isEdited: false,
						isDeleted: false
					},
					chatsRef.id
				);
				if (!messagesRefOpenAI.text) {
					displayError = 'Could not save Vision API Response. Please try again.';
					return displayError;
				}
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
		<button
			on:click={() => {
				goto('/home');
			}}
		>
			<Undo2 />
		</button>
	</div>
	<div
		class="flex flex-col self-center mt-[5%] items-center justify-center w-[85%] h-[26vh] rounded-xl border-[1px] border-[rgba(200,200,200,1)]"
	>
		<label
			class="w-full h-full flex flex-col items-center px-4 py-6 rounded-lg tracking-wide cursor-pointer"
		>
			<ImagePlus size="46" color="#bcc7c7" stroke-width="2.5" />
			<div class="flex flex-col self-center">
				<div class="mt-2 text-base leading-normal self-center">
					<span class="text-[rgba(77,77,77,1)] leading-4 font-bold">+</span>
					<span class="text-[rgba(115,115,115,1)] leading-4 font-medium">Upload Image</span>
				</div>
				<div
					class="flex mt-4 self-center h-[24px] w-3/4 opacity-[44%] font-medium text-[10px] text-center items-center leading-3"
				>
					Upload a new image to start chatting.
				</div>
			</div>
			<input
				type="file"
				accept="image/*;pdf/*"
				name="file"
				on:change={(e) => {
					// @ts-ignore
					file = e.target?.files[0];
				}}
				class="hidden"
			/>
		</label>
	</div>
	<hr
		class={clsx(
			'w-[90%] self-center fixed mt-[36vh] md:mt-[47vh] sm:mt-[44vh] opacity-40 border-[#607d8b] border-dashed border-t-2'
		)}
	/>
	<div
		class={clsx(
			'flex fixed flex-row mt-[92vh] w-[90%] self-center justify-center items-center rounded-[21px]'
		)}
	>
		<MessageBar
			onClickedNavigationToNewChat={false}
			bind:file
			sentMessageClicked={createNewChatFromMessage}
			bind:inpVal={messageVal}
			class="mt-8"
		/>
	</div>
	<Modal showModal={waiting} permissionToCloseModal={displayError.length > 1}>
		<div
			slot="header"
			class="bg-transparent text-transparent bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
		>
			Uploading
		</div>
		<div class="flex flex-col">
			{#if waitingExtra}
				<div class="text-center">
					The operation is taking longer than usual.Please wait for sometime.
				</div>
				<br />
				<div class="text-red text-center">{displayError}</div>
			{/if}
			<Loader2 size="18" class="animate-spin self-center my-1" />
		</div>
	</Modal>
</div>
