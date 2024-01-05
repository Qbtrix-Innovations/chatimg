<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';

	import * as Dialog from './ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { userData } from '$lib/stores/user/userStore';
	import clsx from 'clsx';
	import { goto, afterNavigate } from '$app/navigation';
	import { app, auth, db } from '$lib/firebase/firebase';
	import { authHandlers, authStore } from '$lib/stores/userauth/authStore.js';
	import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
	import { doc, updateDoc } from 'firebase/firestore';
	import Compressor from 'compressorjs';
	import PrimaryButton from '$lib/components/primaryButton.svelte';
	let previousPage: any;
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
		// console.log(previousPage);
	});
	function back() {
		goto('/home');
	}
	let newPassword: string;
	let apiKey: string;
	const saveApiKey = async () => {
		if (apiKey && $userData.id) {
			// console.log($userData.id);
			const key = `${$userData.id + '_OPEN_AI_API_KEY'}`;
			// console.log(key);
			const value = apiKey;
			localStorage.setItem(key, value);
			// console.log(apiKey);
			const lol = localStorage.getItem($userData.id + '_OPEN_AI_API_KEY');
			// console.log(lol);
			let finalDay = new Date();
			finalDay.setMonth(finalDay.getMonth() + 6);
			const startDate = new Date();
			await updateDoc(doc(db, `users`, $userData.id), {
				subscriptionDetails: {
					startDate: startDate,
					endDate: finalDay,
					planType: 'ownAPI'
				}
			});

			$userData.subscriptionDetails.startDate = startDate;
			$userData.subscriptionDetails.endDate = finalDay;
			$userData.subscriptionDetails.planType = 'ownAPI';
			$userData.subscriptionDetails.isActive = true;
			$userData.subscriptionDetails.isActive = true;
			$userData.subscriptionDetails.totalCredits = 1000;
			$userData.subscriptionDetails.availableCredits = 1000;
		}
	};

	const Logout = async () => {
		await authHandlers.logout();
	};

	const changePassword = async () => {
		authHandlers.changePassword(newPassword);
		newPassword = '';
	};

	const disableAccount = async () => {
		const key = `${$userData.id + '_OPEN_AI_API_KEY'}`;
		localStorage.removeItem(key);
		authHandlers.logout();
	};
	let file: File;
	let photoUrl: string;
	let uploading: boolean = false;
	let completeUploadFunction: () => void;
	$: udis = $authStore.currentUser?.uid;
	$: udun = $authStore.currentUser?.displayName;

	$: {
		completeUploadFunction = () => {
			uploading = true;
			const storage = getStorage(app);
			const upload = () => {
				const name = udis + '_' + udun + '_' + new Date().getTime();
				const storageRef = ref(storage, name);
				function compressAndUploadImage(file: File | Blob) {
					new Compressor(file, {
						quality: 0.8, // the quality of the output image, the higher the better quality but larger file
						maxWidth: 1024, // the max width of the output image
						maxHeight: 1024, // the max height of the output image
						success(result) {
							// Create a file reference
							const uploadTask = uploadBytesResumable(storageRef, result);
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
									getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
										photoUrl = downloadURL;
										// @ts-ignore
										updateDocumentById('users', udis, {
											profilePictureUrl: downloadURL
										});
									});
									// .then(() => {
									// Update firestore Database
									// @ts-ignore
									// updateDocumentById('users', udis, {
									// 	profilePictureUrl: photoUrl
									// });
									// });
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
	const updateDocumentById = async (collectionName: string, documentId: string, newData: any) => {
		const docRef = doc(db, collectionName, documentId);
		try {
			// Update the document
			await updateDoc(docRef, newData);
			userData.update((currentState) => {
				return {
					id: currentState.id,
					userName: currentState.userName,
					email: currentState.email,
					phoneNumber: currentState.phoneNumber,
					dateOfBirth: currentState.dateOfBirth,
					profilePictureUrl: newData.profilePictureUrl,
					createdAt: currentState.createdAt,
					lastLogin: currentState.lastLogin,
					isPremium: currentState.isPremium,
					subscriptionDetails: currentState.subscriptionDetails,
					stripeCustomerId: currentState.stripeCustomerId
				};
			});
			// @ts-ignore
			data.user.profilePictureUrl = newData.profilePictureUrl;
		} catch (err) {
			// @ts-ignore
			console.error(`Error updating document with ID ${documentId}:`, err.message);
		}
	};
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button class={clsx('ml-1 bg-transparent hover:bg-transparent rounded-full')}>
			<img
				alt="profile"
				class="rounded-full max-h-[25px]"
				src={$userData.profilePictureUrl
					? `${$userData.profilePictureUrl}`
					: `/no_default_user_image.png`}
			/>
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="bg-card overflow-auto">
		<div class={clsx('w-full bg-card flex justify-between items-center p-4')}>
			<div class={clsx('flex flex-row justify-start items-center align-middle')}>
				<button on:click={back} class={clsx('bg-transparent hover:bg-transparent')}>
					<ArrowLeft class="w-6 mr-2" color="black" />
				</button>
				<div class="font-[600]">My Profile</div>
			</div>
			<PrimaryButton
				size="sm"
				class={clsx('bg-[rgba(76,175,80,1)] hover:bg-[rgba(76,175,80,0.8)] rounded-full h-7')}
				onClick={Logout}
				text="Logout"
			/>
		</div>
		<div class={clsx(' w-full bg-card ')}>
			<!-- Top Navbar -->

			<!-- User Profile Image Display -->
			<div class="w-full flex justify-center">
				<div
					class={clsx(
						` bg-[url('/Rectangle_background.png')] h-[20vh] w-[90%] bg-no-repeat bg-cover self-center rounded-lg mt-4 grid`
					)}
				>
					<label
						class="self-center justify-self-end w-[20%] h-[7vh] text-center align-middle opacity-60 text-white rounded-lg tracking-wide cursor-pointer"
					>
						<span class="text-white bg-transparent hover:bg-transparent">Edit</span>
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
					<img
						src={$userData.profilePictureUrl
							? `${$userData.profilePictureUrl}`
							: `/no_default_user_image.png`}
						alt="user profile"
						srcset=""
						class={clsx(
							'rounded-full border-white border h-[90px] self-start justify-self-center mt-[-5vh]'
						)}
					/>
				</div>
			</div>
			<!-- Subscriptions upgrade -->
			<div
				class={clsx(
					'justify-self-center w-[90%] flex flex-row justify-between items-center align-middle mt-8 mx-[5%]'
				)}
			>
				<div class="font-bold leading-4 text-sm text-[#263238] opacity-50">Subscriptions</div>
				<div class="font-[500] leading-4 text-[12px] text-[#E09F9F]">Expiring Today</div>
			</div>
			<!-- Subscriptions list -->
			<div
				class="justify-self-center w-[90%] flex flex-row justify-between items-center align-middle mx-[5%] mt-2"
			>
				<div class="flex flex-row gap-2 items-center align-middle justify-start">
					<div class="">
						<svg height="2em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clip-path="url(#clip0_8155_67)">
								<path
									d="M33.3334 20C33.3334 16.4638 31.9286 13.0724 29.4281 10.5719C26.9276 8.07142 23.5363 6.66666 20 6.66666C16.4638 6.66666 13.0724 8.07142 10.572 10.5719C8.07147 13.0724 6.66671 16.4638 6.66671 20V26.6667H11.6667C12.1087 26.6667 12.5327 26.8423 12.8452 27.1548C13.1578 27.4674 13.3334 27.8913 13.3334 28.3333V33.3333H26.6667V28.3333C26.6667 27.8913 26.8423 27.4674 27.1549 27.1548C27.4674 26.8423 27.8913 26.6667 28.3334 26.6667H33.3334V20ZM30 30V35C30 35.442 29.8244 35.8659 29.5119 36.1785C29.1993 36.4911 28.7754 36.6667 28.3334 36.6667H11.6667C11.2247 36.6667 10.8008 36.4911 10.4882 36.1785C10.1756 35.8659 10 35.442 10 35V30H5.00004C4.55801 30 4.13409 29.8244 3.82153 29.5118C3.50897 29.1993 3.33337 28.7754 3.33337 28.3333V20C3.33337 10.795 10.795 3.33333 20 3.33333C29.205 3.33333 36.6667 10.795 36.6667 20V28.3333C36.6667 28.7754 36.4911 29.1993 36.1786 29.5118C35.866 29.8244 35.4421 30 35 30H30ZM12.5 23.3333C12.1717 23.3333 11.8466 23.2687 11.5433 23.143C11.24 23.0174 10.9644 22.8332 10.7323 22.6011C10.5001 22.3689 10.316 22.0934 10.1903 21.79C10.0647 21.4867 10 21.1616 10 20.8333C10 20.505 10.0647 20.1799 10.1903 19.8766C10.316 19.5733 10.5001 19.2977 10.7323 19.0656C10.9644 18.8334 11.24 18.6493 11.5433 18.5236C11.8466 18.398 12.1717 18.3333 12.5 18.3333C13.1631 18.3333 13.799 18.5967 14.2678 19.0656C14.7366 19.5344 15 20.1703 15 20.8333C15 21.4964 14.7366 22.1323 14.2678 22.6011C13.799 23.0699 13.1631 23.3333 12.5 23.3333ZM27.5 23.3333C27.1717 23.3333 26.8466 23.2687 26.5433 23.143C26.24 23.0174 25.9644 22.8332 25.7323 22.6011C25.5001 22.3689 25.316 22.0934 25.1903 21.79C25.0647 21.4867 25 21.1616 25 20.8333C25 20.505 25.0647 20.1799 25.1903 19.8766C25.316 19.5733 25.5001 19.2977 25.7323 19.0656C25.9644 18.8334 26.24 18.6493 26.5433 18.5236C26.8466 18.398 27.1717 18.3333 27.5 18.3333C28.1631 18.3333 28.799 18.5967 29.2678 19.0656C29.7366 19.5344 30 20.1703 30 20.8333C30 21.4964 29.7366 22.1323 29.2678 22.6011C28.799 23.0699 28.1631 23.3333 27.5 23.3333Z"
									fill="#0B0914"
								/>
							</g>
							<defs>
								<clipPath id="clip0_8155_67">
									<rect width="40" height="40" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</div>
					<div class="font-[700]">Basic</div>
				</div>
				<button
					class="font-bold leading-4 text-sm text-[rgba(76,175,80,1)] opacity-80"
					on:click={() => {
						goto('/pricingTable');
					}}>Upgrade</button
				>
			</div>
			<!-- Change Password -->
			<div class="w-full flex justify-center mt-6">
				<div class={`justify-self-center grid w-[90%] self-center`}>
					<div
						class="font-bold text-sm leading-4 text-[#263238] opacity-50 self-start justify-self-start"
					>
						Change Password
					</div>
					<Input
						class="bg-white mt-2 border-none font-[400] placeholder:text-[#CCC]"
						type="password"
						placeholder="Enter New Password"
						bind:value={newPassword}
					/>
					<button
						on:click={changePassword}
						class="flex justify-end bg-transparent text-accent/80 text-sm leading-4 font-bold pt-3"
						>Update</button
					>
				</div>
			</div>
			<!-- Open AI API Key -->
			<div class="w-full flex justify-center mt-6">
				<div class={`justify-self-center grid w-[90%] self-center `}>
					<div
						class="font-bold text-sm leading-4 text-[#263238] opacity-50 self-start justify-self-start"
					>
						OPEN AI API KEY
					</div>
					<Input
						type="password"
						placeholder="Enter open ai api key"
						bind:value={apiKey}
						class="bg-white mt-2 border-none font-[400] placeholder:text-[#CCC]"
					/>
					<button
						on:click={saveApiKey}
						class="flex justify-end pt-3 bg-transparent text-accent/80 text-sm leading-4 font-bold"
						>Update</button
					>
				</div>
			</div>
			<!-- Disable Account -->
			<div class="w-full flex justify-center relative mt-6">
				<div class="justify-self-center self-end w-[90%] grid mb-4">
					<div class="self-start flex flex-row align-middle items-center justify-between">
						<div class="font-bold leading-4 text-sm text-[#263238]/50">Disable Account</div>
						<button
							on:click={disableAccount}
							class="hover:bg-transparent text-transparent hover:text-[rgba(255,0,0,1)] bg-clip-text bg-[rgba(255,0,0,0.56)] text-sm leading-4 font-bold m-0 p-0"
							>Disable</button
						>
					</div>
					<div class="text-sm leading-4 font-normal text-[#CCC] mt-2">
						You can Login to enable later.
					</div>
				</div>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
