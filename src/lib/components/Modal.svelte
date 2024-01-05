<script>
	import { X } from 'lucide-svelte';

	/**
	 * @type {boolean}
	 */
	export let showModal;

	/**
	 * @type {HTMLDialogElement}
	 */
	let dialog;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
	class="max-w-[32em] rounded-[0.2em] border-none p-0 backdrop:bg-[rgba(0,0,0,0.5)] open:animate-modal-popup"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="p-[1em]">
		<div class="flex flex-row justify-between items-center">
			<slot name="header" class="w-fit" />
			<button
				autofocus
				on:click={() => dialog.close()}
				class="text-white flex justify-center font-extrabold bg-red-500 w-6 h-6 ml-1 rounded-full"
			>
				<X class=" w-4" />
			</button>
		</div>
		<hr />
		<slot />
		<hr />
		<div class="flex flex-row justify-center">
			<slot name="footer" />
		</div>
		<!-- svelte-ignore a11y-autofocus -->
	</div>
</dialog>

<style>
</style>
