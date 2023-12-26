<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.pcss';
	import { auth } from '../lib/services/firebase/firebase';
	import { authStore } from '$lib/stores/userauth/authStore';
	import checkStatus from '$lib/stores/user/initialNavigation';
	onMount(async () => {
		goto('/auth');
		if ($authStore.currentUser) {
			await checkStatus();
		}
	});
</script>

<slot />
