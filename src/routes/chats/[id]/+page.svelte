<script>
	import HumanChat from '../components/HumanChat.svelte';
	import AiChat from '../components/AiChat.svelte';
	import { clsx } from 'clsx';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
	import CommonNavbar from '$lib/components/CommonNavbar.svelte';
	import CommonMessageBar from '$lib/components/CommonMessageBar.svelte';
	import { goto, afterNavigate } from '$app/navigation';
	import { userData } from '$lib/stores/user/userStore';
	import { chatsData } from '$lib/stores/chats/chatStore';
	import { addDoc, collection, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
	import { app, db } from '$lib/services/firebase/firebase';
	import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
	import Compressor from 'compressorjs';
	import { Title } from '$lib/components/ui/alert';
	import { text } from '@sveltejs/kit';

	// import { onMount } from 'svelte';
	// import { chatsData } from '$lib/stores/chats/chatStore';
	// import { files } from '$service-worker';
	const root = 'http://localhost:5173/'
	let completeUploadFunction;
	let uploading=false;
	let email = $userData.email;
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
	$: {
		completeUploadFunction = () => {
			uploading = true;
			// console.log('changed');
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
						maxWidth: 1920, // the max width of the output image
						maxHeight: 1080, // the max height of the output image
						success(result) {
							// Create a file reference
							compressedFile = result;
							const uploadTask = uploadBytesResumable(storageRef, result);
							compressedFileSize = result.size;
							compressedFileType = file.type;
							uploadTask.on(
								'state_changed',
								(/** @type {{ bytesTransferred: number; totalBytes: number; state: any; }} */ snapshot) => {
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
			file && upload();
			uploading = false;
		};
		file && completeUploadFunction();
	}
	async function createNewChat() {
		try {
			const part = [];
			part.push($userData.id);
			// const userRef = doc(db, 'users/chats', email + '_' + new Date().getTime() + '_' + file.name);
			// const chatsRef = await addDoc(collection(db, `chats`), {
			// 	participants: part,
			// 	createdAt: serverTimestamp(),
			// 	lastMessage: serverTimestamp(),
			// 	lastMessagePreview: '',
			// 	isArchived: false
			// });
			// const messagesRef = await addDoc(collection(db,`chats/${chatsRef.id}/messages`),{
			// 	sentBy:uid,
			// 	sentAt:serverTimestamp(),
			// 	text:"",
			// 	isEdited:false,
			// 	isDeleted:false,
			// });
			const ImagesRef = await addDoc(collection(db, `chats/${data.uid}/images`), {
				uploadedBy: $userData.id,
				uploadedAt: serverTimestamp(),
				imageUrl: photoUrl,
				thumbnailUrl: photoUrl,
				fileSize: compressedFileSize,
				fileType: compressedFileType
				// metaData:,
			});

			// console.log(ImagesRef);
			data.imagesDataArray = [...data.imagesDataArray,{
				uploadedBy: $userData.id,
				uploadedAt: serverTimestamp(),
				imageUrl: photoUrl,
				thumbnailUrl: photoUrl,
				fileSize: compressedFileSize,
				fileType: compressedFileType
				// metaData:,
			}];
			// goto(`/chats/${data.uid}`);

		} catch (err) {
			console.log(err);
			console.log('There was an error saving your information');
		}
	}
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
		if ($userData.id.length>0) {
			goto('/home');
		}
		else{
			goto('/auth')
		}
	}
	function goToNewChat() {
		goto('/newChat');
	}
	const share = async ()=>{
		let titleText;
		let urlText;
		let textText;
		let shareData;
		if (data.imagesDataArray.length>0) {
			titleText = data.imagesDataArray[0].imageUrl.split('.com_')[1].split('?alt')[0].slice(14,);
			textText = '';
			for (let index = 0; index < data.MessagesDataArray.length; index++) {
				const element = data.MessagesDataArray[index];
				textText=textText+'_;_'+element.text;
			}
			console.log(textText);
			textText+=data.imagesDataArray[0].imageUrl;
			// urlText =  data.imagesDataArray[0].imageUrl;
			urlText = root+'chats/shared/'+data.uid;
			console.log(urlText);
			shareData = {
				title: `Chat shared by ${$userData.userName}`,
				text:'Use ChatImg to talk with Images and watch them come alive.',
				url:urlText
			}
			console.log(shareData);
			// const shareDataJSON = JSON.stringify(shareData);
			// const base64ShareData = btoa(shareDataJSON);
			// const shareableLink = `https://localhost/share?data=${encodeURIComponent(base64ShareData)}`;
		}
		// Check if the Web Share API is supported
		if (navigator.share) {
		  // Try to share the data
		  try {
		    await navigator.share(shareData);
		    console.log("Data shared successfully");
		  } catch (err) {
		    // Handle any errors
		    console.error("Error while sharing:", err);
		  }
		} else {
		  // Fallback to some other sharing method
		  console.log("Web Share API not supported");
		}
		// return;
	}
	let loading = false;

	/**
	 * @type {any}
	 */
	let file;
	let images;
	// onMount(()=>{})
	export let data;
	let conv = data.MessagesDataArray;
	// console.log(conv);
	// conv = [
	// 	{
	// 		sender: 'hm',
	// 		time: '01:30 pm',
	// 		txt: 'What is this photo about?'
	// 	},
	// 	{
	// 		sender: 'ai',
	// 		time: '01:30 pm',
	// 		txt: 'It is a long established fact that a reader will be distracted by the readable content of a page when'
	// 	},
	// 	{
	// 		sender: 'hm',
	// 		time: '01:30 pm',
	// 		txt: 'What is this photo about?'
	// 	},
	// 	{
	// 		sender: 'ai',
	// 		time: '01:30 pm',
	// 		txt: 'It is a long established fact that a reader will be distracted by the readable content of a page when'
	// 	},
	// 	{
	// 		sender: 'hm',
	// 		time: '01:30 pm',
	// 		txt: 'What is this photo about?'
	// 	},

	// 	{
	// 		sender: 'ai',
	// 		time: '01:30 pm',
	// 		txt: 'It is a long established fact that a reader will be distracted by the readable content of a page when'
	// 	},
	// 	{
	// 		sender: 'hm',
	// 		time: '01:30 pm',
	// 		txt: 'What is this photo about?'
	// 	},
	// 	{
	// 		sender: 'ai',
	// 		time: '01:30 pm',
	// 		txt: 'It is a long established fact that a reader will be distracted by the readable content of a page when'
	// 	}
	// ];
	/**
	 * @type {string}
	 */
	let searchVal;
	// if (data.imagesDataArray[0].imageURL === undefined) {
	// 	data.imagesDataArray[0].imageURL = ['noImage.jpg'];
	// }
	console.log(data);
	// console.log(data.imagesDataArray[0].imageUrl);
	// let cd = $chatsData;
	// let chatData;
	// for (let index = 0; index < cd.length; index++) {
	// 	if (cd[index].id == ) {
	// 		chatData=cd[index];
	// 	}
	// }
	const sendMessage = async () => {
		const messagesRef = await addDoc(collection(db, `chats/${data.uid}/messages`), {
			sentBy: $userData.id,
			sentAt: serverTimestamp(),
			text: searchVal,
			isEdited: false,
			isDeleted: false
		});
		const querySnapshotMsg = await getDocs(collection(db, `chats/${data.uid}/messages`));
		// Extract data from query snapshot
		const MessagesData = querySnapshotMsg.docs.map((doc) => doc.data());
		data.MessagesDataArray = MessagesData;
		await updateDoc(doc(db,`chats`,data.uid),{
			lastMessagePreview:searchVal,
			lastMessage:serverTimestamp()
		});
		// data.MessagesDataArray=[...data.MessagesDataArray,{
		// 		sentBy: $userData.id ,
		// 		sentAt: serverTimestamp(),
		// 		text: searchVal,
		// 		isEdited: false,
		// 		isDeleted: false
		// 	}];
		searchVal = '';
	};
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
</script>

<div class={clsx('bg-[#f5f5f5] h-[100vh]')}>
	<div class={clsx('flex flex-col w-screen justify-between items-center')}>
		<div class={clsx('flex flex-col w-full items-center')}>
			<CommonNavbar
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
											<svg
												width="16"
												height="15"
												viewBox="0 0 16 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g clip-path="url(#clip0_8006_113214)">
													<path
														d="M14.6285 4.53926C14.4745 4.36479 14.2852 4.22508 14.073 4.12941C13.8609 4.03374 13.6308 3.9843 13.3981 3.98438H10.3512V3.28125C10.3504 2.59773 10.0785 1.94242 9.59522 1.4591C9.1119 0.975773 8.45659 0.7039 7.77307 0.703125C7.64254 0.70314 7.5146 0.739488 7.40356 0.808099C7.29252 0.876709 7.20277 0.974874 7.14436 1.0916L4.99456 5.39062H2.61682C2.30602 5.39062 2.00795 5.51409 1.78818 5.73386C1.56841 5.95363 1.44495 6.2517 1.44495 6.5625V11.7188C1.44495 12.0296 1.56841 12.3276 1.78818 12.5474C2.00795 12.7672 2.30602 12.8906 2.61682 12.8906H12.6949C13.0948 12.8906 13.4809 12.7445 13.7806 12.4798C14.0804 12.2151 14.2731 11.8501 14.3227 11.4533L15.0258 5.82832C15.0547 5.59757 15.0343 5.36331 14.9658 5.14107C14.8973 4.91883 14.7823 4.71369 14.6285 4.53926ZM2.8512 6.79688H4.7262V11.4844H2.8512V6.79688ZM13.6324 5.6543L12.9293 11.2793C12.9221 11.3363 12.8943 11.3886 12.8511 11.4264C12.8079 11.4642 12.7523 11.4848 12.6949 11.4844H6.13245V6.25957L8.17268 2.17969C8.39895 2.26176 8.59446 2.41153 8.73263 2.60861C8.8708 2.8057 8.94493 3.04055 8.94495 3.28125V4.6875C8.94495 4.87398 9.01903 5.05282 9.15089 5.18468C9.28275 5.31655 9.46159 5.39062 9.64807 5.39062H13.3981C13.4315 5.39036 13.4646 5.39725 13.4951 5.41081C13.5256 5.42438 13.5529 5.44431 13.5751 5.46928C13.5973 5.49425 13.6139 5.52368 13.6238 5.55559C13.6337 5.5875 13.6366 5.62115 13.6324 5.6543Z"
														fill="#607D8B"
														fill-opacity="0.5"
													/>
												</g>
												<defs>
													<clipPath id="clip0_8006_113214">
														<rect
															width="15"
															height="15"
															fill="white"
															transform="translate(0.741821)"
														/>
													</clipPath>
												</defs>
											</svg>
										</Button>
										<Button class="bg-transparent px-1" size="sm">
											<svg
												width="16"
												height="15"
												viewBox="0 0 16 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g clip-path="url(#clip0_8006_113215)">
													<path
														d="M15.0258 9.17168L14.3227 3.54668C14.2731 3.1499 14.0804 2.78487 13.7806 2.5202C13.4809 2.25553 13.0948 2.10943 12.6949 2.10938H2.61682C2.30602 2.10938 2.00795 2.23284 1.78818 2.45261C1.56841 2.67238 1.44495 2.97045 1.44495 3.28125V8.4375C1.44495 8.59139 1.47526 8.74378 1.53415 8.88596C1.59304 9.02814 1.67936 9.15732 1.78818 9.26614C1.897 9.37496 2.02619 9.46128 2.16836 9.52017C2.31054 9.57906 2.46293 9.60938 2.61682 9.60938H4.99456L7.14436 13.9084C7.20277 14.0251 7.29252 14.1233 7.40356 14.1919C7.5146 14.2605 7.64254 14.2969 7.77307 14.2969C8.45659 14.2961 9.1119 14.0242 9.59522 13.5409C10.0785 13.0576 10.3504 12.4023 10.3512 11.7188V11.0156H13.3981C13.6307 11.0156 13.8606 10.9661 14.0726 10.8704C14.2846 10.7748 14.4739 10.6351 14.6278 10.4607C14.7817 10.2864 14.8968 10.0813 14.9654 9.85902C15.0341 9.63677 15.0546 9.40248 15.0258 9.17168ZM4.7262 8.20312H2.8512V3.51562H4.7262V8.20312ZM13.5739 9.53027C13.5518 9.55517 13.5248 9.57509 13.4945 9.58873C13.4642 9.60237 13.4313 9.60941 13.3981 9.60938H9.64807C9.46159 9.60938 9.28275 9.68345 9.15089 9.81532C9.01903 9.94718 8.94495 10.126 8.94495 10.3125V11.7188C8.94493 11.9594 8.8708 12.1943 8.73263 12.3914C8.59446 12.5885 8.39895 12.7382 8.17268 12.8203L6.13245 8.74043V3.51562H12.6949C12.7523 3.51517 12.8079 3.53581 12.8511 3.57361C12.8943 3.61141 12.9221 3.66375 12.9293 3.7207L13.6324 9.3457C13.6364 9.37887 13.6332 9.41249 13.6231 9.44432C13.613 9.47615 13.5962 9.50546 13.5739 9.53027Z"
														fill="#607D8B"
														fill-opacity="0.5"
													/>
												</g>
												<defs>
													<clipPath id="clip0_8006_113215">
														<rect
															width="15"
															height="15"
															fill="white"
															transform="translate(0.741821)"
														/>
													</clipPath>
												</defs>
											</svg>
										</Button>
										<Button
											on:click={() => {
												copyToClipboard(conversation.sentAt.seconds);
											}}
											class="bg-transparent px-1 pl-2 active:scale-[75%]"
											size="sm"
										>
											<svg
												width="11"
												height="12"
												viewBox="0 0 11 12"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="M3.66654 4H7.33321C7.58621 4 7.79154 3.7765 7.79154 3.5V1.5C7.79154 1.2235 7.58621 1 7.33321 1H3.66654C3.41354 1 3.20821 1.2235 3.20821 1.5V3.5C3.20821 3.7765 3.41354 4 3.66654 4ZM8.24988 3.5V2C9.00796 2 9.62488 2.673 9.62488 3.5V9.5C9.62488 10.327 9.00796 11 8.24988 11H2.74988C1.99179 11 1.37488 10.327 1.37488 9.5V3.5C1.37488 2.673 1.99179 2 2.74988 2V3.5C2.74988 4.0515 3.161 4.5 3.66654 4.5H7.33321C7.83875 4.5 8.24988 4.0515 8.24988 3.5Z"
													fill="#607D8B"
													fill-opacity="0.5"
												/>
												<mask
													id="mask0_8006_113217"
													style="mask-type:luminance"
													maskUnits="userSpaceOnUse"
													x="1"
													y="1"
													width="9"
													height="10"
												>
													<path
														fill-rule="evenodd"
														clip-rule="evenodd"
														d="M3.66654 4H7.33321C7.58621 4 7.79154 3.7765 7.79154 3.5V1.5C7.79154 1.2235 7.58621 1 7.33321 1H3.66654C3.41354 1 3.20821 1.2235 3.20821 1.5V3.5C3.20821 3.7765 3.41354 4 3.66654 4ZM8.24988 3.5V2C9.00796 2 9.62488 2.673 9.62488 3.5V9.5C9.62488 10.327 9.00796 11 8.24988 11H2.74988C1.99179 11 1.37488 10.327 1.37488 9.5V3.5C1.37488 2.673 1.99179 2 2.74988 2V3.5C2.74988 4.0515 3.161 4.5 3.66654 4.5H7.33321C7.83875 4.5 8.24988 4.0515 8.24988 3.5Z"
														fill="white"
													/>
												</mask>
												<g mask="url(#mask0_8006_113217)">
													<rect
														x="-0.00012207"
														width="11"
														height="12"
														fill="#607D8B"
														fill-opacity="0.5"
													/>
												</g>
											</svg>
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
		<CommonMessageBar
			sentMessageClicked={sendMessage}
			imgUploadClicked={() => {}}
			bind:file
			bind:inpVal={searchVal}
			class="mt-[92vh]"
		/>
	</div>
</div>
