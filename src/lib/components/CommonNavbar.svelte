<script>
	import Button from './ui/button/button.svelte';
    import clsx from 'clsx';
	/**
	 * @type {string}
	 */
    export let headingLeft;

	/**
	 * @type {string}
	 */
	 export let buttonTextRight;
    
     /**
	 * @type {string}
	 */
	export let shareAvailable;
	/**
	 * @type {() => void}
	 */
	 export let handleRightTextClick;
	function handleRightClick(){
		handleRightTextClick();
	}
	/**
	 * @type {() => void}
	 */
	 export let handleLeftTextClick;
	function handleLeftClick(){
		handleLeftTextClick();
	}
		/**
	 * @type {() => void}
	 */
	 export let handleSecondFromRightClick;
	function handleSecondRightClick(){
		handleSecondFromRightClick();
	}
</script>

<nav class={clsx('w-full fixed flex flex-row justify-between mt-1 mb-2')}>
	<div class={clsx('flex flex-row justify-evenly align-middle items-center')}>
		<Button on:click={handleLeftClick} class={clsx('bg-transparent')}>
			<svg
				width="8"
				height="14"
				viewBox="0 0 8 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
			>
				<path
					d="M7 13L1 7L7 1"
					stroke="#263238"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</Button>
		<div>{headingLeft}</div>
	</div>
	<div class={clsx('flex flex-row justify-around align-middle items-center mr-2')}>
		{#if shareAvailable==='true'}
			<button
				class={clsx('bg-[#d9d9d9] w-[21px] h-[21px] rounded-full mr-2 flex items-center align-middle pl-1')}
				on:click={handleSecondRightClick}
			>
				<svg
					width="13"
					height="13"
					viewBox="0 0 13 13"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.125 9.20832L10.8333 6.49999L8.125 3.79166"
						stroke="#607D8B"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M2.16666 9.75V8.66667C2.16666 8.09203 2.39493 7.54093 2.80126 7.1346C3.20759 6.72827 3.75869 6.5 4.33332 6.5H10.8333"
						stroke="#607D8B"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/if}
		<div class={clsx('flex items-center align-middle')}>
			<Button
				on:click={handleRightClick}
				class={clsx('bg-[rgba(76,175,80,0.8)] rounded-[10px] h-[21px] w-[52px] text-[15px] leading-4 font-medium text-[#ffffff] py-3 text-center')}
			>
				{buttonTextRight}
			</Button>
		</div>
	</div>
</nav>
