<script lang="ts">
	import { any } from 'zod';
	import Button from './ui/button/button.svelte';
	export let text: string;
	let className: string = '';
	export let id: string = '';
	export let type: 'submit' | 'button' | 'reset' | null | undefined = 'button';
	export { className as class };
	export let size: 'default' | 'sm' | 'lg' | 'icon' | undefined = "sm";
	export let onClick: (() => void) | undefined = undefined;
</script>

<Button
	{size}
	{id}
	on:click={onClick}
	{type}
	class={` ${className} bg-[linear-gradient(180deg,#0092C0_0%,#FFF_0.01%,#E7E7E7_98.96%)] hover:bg-transparent border-2 border-accent rounded-[10px] text-black dark:bg-[linear-gradient(180deg,#414141_0%,rgba(74,74,74,0.00)_100%)] shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] dark:text-white font-[700]`}
>
	{text}
</Button>

<style>
</style>
