<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	/**
	 * @type {string}
	 */
	export let text: string;

	/**
	 * @type {any}
	 */
	export let icn: any;
	/**
	 * @type {string}
	 */
	let className = '';
	export { className as class };
	export let handleAuthClick: () => void;
	// export handleAuthClick ;
</script>

<Button
	on:click={async () => {
		handleAuthClick();
	}}
	class={`flex flex-row justify-center items-center border-[0.5px] h-[36px] rounded-[6px]  w-full bg-[rgba(227,227,227,1)] bg-gradient-to-b from-[rgba(255,255,255,1)] to-[rgba(185,185,185,0.39)] ${className}`}
>
	<div class="text-[14px] leading-5">
		<svelte:component this={icn}></svelte:component>
	</div>
	<div class="pl-2 text-black text-[14px] leading-5">
		{text}
	</div>
</Button>

<style>
</style>
