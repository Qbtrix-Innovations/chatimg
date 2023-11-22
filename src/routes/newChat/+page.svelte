<script>
	import { goto } from '$app/navigation';
	import CommonSearchBar from '$lib/components/CommonSearchBar.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { clsx } from 'clsx';
	import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
	import Input from '$lib/components/ui/input/input.svelte';
    import Modal from '../../lib/components/Modal.svelte';
	import { app, auth, db } from '../../lib/services/firebase/firebase';
	import { addDoc, collection, getDoc, doc, setDoc } from 'firebase/firestore';
	import { authStore } from '$lib/stores/userauth/authStore';
	import { userData } from '$lib/stores/user/userStore';

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
	let userDataInstance = $userData;
	/**
	 * @type {any}
	 */
	let file;
	/**
	 * @type {string}
	 */
	let photoUrl;
    /**
	 * @type {string}
	 */
    let searchVal;
	$: {
		uploading=true;
		console.log('changed');
		const storage = getStorage(app);
		const upload = () => {
			const name = email + '_' + new Date().getTime() + '_' + file.name;
			const storageRef = ref(storage, name);
			const uploadTask = uploadBytesResumable(storageRef, file);
			
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
					}).then(()=>{
						createNewChat();
					});
				}
			);
		};
		file && upload();
		uploading=false;
	}
	async function createNewChat() {
		try {
			// const userRef = doc(db, 'users/chats', email + '_' + new Date().getTime() + '_' + file.name);
			const chatRef = await addDoc(collection(db, `users/${uid}/chats`), {
				uid: uid,
				imageURL: photoUrl,
				createdAt: new Date(),
				messages: []
			});
			goto('/chatScreen');
		} catch (err) {
			console.log(err);
			console.log('There was an error saving your information');
		}
	}
	let showModal = false;
</script>

<div class="bg-[#f5f5f5] h-screen flex flex-col">
	<div class="font-semibold text-[14px] text-[#263238] mt-2 ml-4">
		Chat Img Hi {userName?.split(' ')[0]} ! CreatedAt: {$userData.createdAt}
	</div>
	<div class="mt-[70%] h-1/2 flex flex-col">
		<div class="flex items-center justify-center active:scale-[85%] transition-transform">
			<div
				class="flex items-center justify-center w-[85%] rounded-2xl border-[1px] border-[#c8c8c8] h-[58px] bg-gradient-to-t from-[rgba(76,175,80,1)] to-[rgba(100,197,104,0.43)] shadow-[0px_4px_3.7px_0px_rgba(0, 0, 0, 0.22)]"
			>
				<label
					class="w-64 flex flex-col items-center px-4 py-6 text-white rounded-lg tracking-wide cursor-pointer"
				>
					<span class="mt-2 text-base leading-normal">+ Upload Image</span>
					<input
						type="file"
						accept="image/*;pdf/*"
						name="file"
						on:change={(/**@type {any}*/e) => {
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
		<CommonSearchBar bind:inpVal={searchVal} class="mt-8" />
	</div>
</div>
