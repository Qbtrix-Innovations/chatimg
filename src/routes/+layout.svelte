<script>
	import { onMount } from 'svelte';
	import '../app.pcss';
	import { auth } from '../lib/services/firebase/firebase';
	import { authStore } from '../lib/stores/authStore';
	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			authStore.update((curr) => {
				console.log(curr.userInfo);
				console.log(curr.currentUser);
				return { ...curr, isLoading: false, currentUser: user };
			});
		});		
	});
</script>

<slot />
