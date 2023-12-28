<script lang='ts' >
	import { onMount } from 'svelte';
	import '../app.pcss';
	import { authStore } from '$lib/stores/userauth/authStore';
	import checkStatus from '$lib/stores/user/initialNavigation';
	onMount(async () => {
		if ($authStore.currentUser) {
			await checkStatus();
		}
	});
</script>

<slot />
