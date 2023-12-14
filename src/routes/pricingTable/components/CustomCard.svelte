<script>
	import Button from "$lib/components/ui/button/button.svelte";
import clsx from "clsx";
	/**
	 * @type {any}
	 */
	 export let bullets;
	 /**
	 * @type {string}
	 */
	  export let h1;
	 /**
	 * @type {string}
	 */
	  export let h2;
	  /**
	 * @type {number}
	 */
	   export let price;
	  /**
	 * @type {string}
	 */
	   export let unitTime;
	   /**
	 * @type {string}
	 */
	    export let buttonText;
		/**
	 * @type {any}
	 */
		 export let icn;

</script>
<div class={clsx('rounded-[20px] border-[#d4d4d4] border flex flex-col p-4 my-4')} >
	<div class={clsx('flex flex-row justify-evenly')} >
		<div class={clsx('text-black')} >
			{@html icn}			
		</div>
		<div class={clsx('font-bold text-[32px] leading-10 text-[#0b0914] w-3/4')} >
			{h1}
		</div>
	</div>
	<div class={clsx('flex flex-col')} >
		<div class={clsx('mt-2')} >
			{h2}
		</div>
		{#each bullets as bullet }
			<div class={clsx('flex flex-row my-2')} >
					<div>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12.0001 2.00008C6.48612 2.00008 2.00012 6.48608 2.00012 12.0001C2.00012 17.5141 6.48612 22.0001 12.0001 22.0001C17.5141 22.0001 22.0001 17.5141 22.0001 12.0001C22.0001 6.48608 17.5141 2.00008 12.0001 2.00008ZM10.0011 16.4131L6.28812 12.7081L7.70012 11.2921L9.99912 13.5871L15.2931 8.29308L16.7071 9.70708L10.0011 16.4131Z" fill="#35353F"/>
						</svg>							
					</div>
					<div>
						{bullet}
					</div>
			</div>
		{/each}
	</div>
	<hr class={clsx('border-dashed border-t-2 w-[90%] align-middle self-center mt-8 mb-4 border-[#a9a9aa] ')} >
	<div>
		<span class={clsx('font-bold text-[32px] leading-10 text-[#0b0914]')} >${price}</span><span class={clsx('font-normal text-[18px] leading-10 text-[#0b0914]')} >/{unitTime}</span>
	</div>
	<Button class={clsx('bg-[rgba(76,175,80,1)] hover:bg-[rgba(76,175,80,0.8)] rounded-xl w-[90%] self-center')} > 
		{buttonText}
	</Button>
</div>