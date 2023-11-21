<script>
	import Button from './ui/button/button.svelte';
	/**
	 * @type {String}
	 */
	 export let text;
	/**
	 * @type {string}
	 */
	let className = '';
	export { className as class };
	/**
	 * @type {"submit" | "reset" | "button" | null | undefined}
	 */
	 export let type;
</script>

<Button
	{type}
	class={`w-[85%] bg-transparent rounded-2xl border-[1px] border-[#c8c8c8] bg-gradient-to-t from-[rgba(76,175,80,1)] to-[rgba(100,197,104,0.43)] shadow-[0px_4px_3.7px_0px_rgba(0, 0, 0, 0.22)] ${className}`}
>
	{text}
</Button>
