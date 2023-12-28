<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	export let text: string;
	export let icn: string;
	let className = '';
	export { className as class };
	export let handleAuthClick: () => void;
</script>

<Button
	on:click={() => {
		handleAuthClick();
	}}
	class={`flex flex-row justify-start items-center border-[0.5px] rounded-[6px] h-7 w-full bg-[rgba(227,227,227,1)] bg-gradient-to-b from-[rgba(255,255,255,1)] to-[rgba(185,185,185,0.39)] ${className}`}
>
	<div class="text-[14px] leading-5">
		{@html icn}
	</div>
	<div class="pl-2 text-black text-[14px] leading-5">
		{text}
	</div>
</Button>

<style>
</style>
