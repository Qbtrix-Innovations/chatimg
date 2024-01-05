<script lang='ts' >
	import { onMount } from 'svelte';
	import '../app.pcss';
	import { ModeWatcher, setMode } from "mode-watcher";
	import { authStore } from '$lib/stores/userauth/authStore';
	import checkStatus from '$lib/stores/user/initialNavigation';
	onMount(async () => {
		setMode('light');
		if ($authStore.currentUser) {
			await checkStatus();
		}
	});
</script>

<ModeWatcher />
<slot />
