<script>
	import Input from "$lib/components/ui/input/input.svelte";
	import { Mail,Eye,EyeOff,PenLine } from "lucide-svelte";
    /**
	 * @type {string}
	 */
    export let val;
	/**
	 * @type {string}
	 */
	 export let placeholder;
     /**
	 * @type {string}
	 */
	export let type;
    /**
	 * @type {string}
	 */
	export let SvgInput;
    /**
	 * @type {string}
	 */
	let className = '';
	export { className as class };
    /**
	 * @type {string}
	 */
	let classNameSVG = '';
	export { classNameSVG as classSVG };
    /**
	 * @type {string}
	 */
	let classNameInp = '';
	export { classNameInp as classInp };
	/**
	 * @type {() => void}
	 */
	 export let onClickSVG;
	const svgClicked=()=>{
		onClickSVG();
	}
</script>

<div class={`flex flex-row w-4/5 align-middle mb-6 ${className}`}>
	<Input
		{type}
		{placeholder}
		bind:value={val}
		class={`w-full rounded-[7.5px] h-9 bg-[rgba(196,196,196,0.2)] border-none ${classNameInp}`}
	/>
	<div class={`absolute mt-2 ${classNameSVG}`} on:click={svgClicked} >
        <!-- {@html actualSvg} -->
		{#if SvgInput==='email'}
			<Mail color="#607D8B" width=18 height=19 />
		{:else if SvgInput==='password'}
			<Eye color="#607D8B" width=18 height=19 />
		{:else if SvgInput==='passwordVisible'}
			<EyeOff color="#607D8B" width=18 height=19 />
		{:else if SvgInput==='password'}
			<Eye color="#607D8B" width=18 height=19 />
		{:else}
			<PenLine color="#607D8B" width=18 height=19/>
		{/if}
	</div>
</div>
