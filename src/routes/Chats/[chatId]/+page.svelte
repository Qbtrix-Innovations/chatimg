<script>
    import HumanChat from '../components/HumanChat.svelte';
    import AiChat from '../components/AiChat.svelte';
	import { clsx } from 'clsx';
	import { Skeleton } from '$lib/components/ui/skeleton';
    import { Button } from '$lib/components/ui/button';
    import CommonNavbar from '$lib/components/CommonNavbar.svelte'
    import CommonSearchBar from '$lib/components/CommonSearchBar.svelte'
    import { onMount } from 'svelte';
	import { backIn } from 'svelte/easing';
	let loading = false;
    function back(){

    }
    function createNewChat(){

    }
    function shareChat(){
        
    }
	onMount(()=>{
		
	})
	let conv = [
		{
			sender: 'hm',
			time: '01:30 pm',
			txt: 'What is this photo about?'
		},
		{
			sender: 'ai',
			time: '01:30 pm',
			txt: 'It is a long established fact that a reader will be distracted by the readable content of a page when'
		},
		{
			sender: 'hm',
			time: '01:30 pm',
			txt: 'What is this photo about?'
		},
		{
			sender: 'ai',
			time: '01:30 pm',
			txt: 'It is a long established fact that a reader will be distracted by the readable content of a page when'
		},
		{
			sender: 'hm',
			time: '01:30 pm',
			txt: 'What is this photo about?'
		},

		{
			sender: 'ai',
			time: '01:30 pm',
			txt: 'It is a long established fact that a reader will be distracted by the readable content of a page when'
		},
		{
			sender: 'hm',
			time: '01:30 pm',
			txt: 'What is this photo about?'
		},
		{
			sender: 'ai',
			time: '01:30 pm',
			txt: 'It is a long established fact that a reader will be distracted by the readable content of a page when'
		}
	];
    /**
	 * @type {string}
	 */
    let searchVal;
</script>

<div class={clsx('bg-[#f5f5f5] h-[100vh]')}>
	<div class={clsx('flex flex-col w-screen justify-between items-center')}>
		<div class={clsx('flex flex-col w-full items-center')}>
			<CommonNavbar handleLeftTextClick={back} handleSecondFromRightClick={shareChat} handleRightTextClick={createNewChat} headingLeft='File name goes here ...' buttonTextRight="New" shareAvailable='true' />
			<hr class={clsx('bg-[#ededed] mt-[12%] fixed border-[1px] border-solid border-[#ededed] w-full')} />
			{#if loading}
				<Skeleton class={clsx('w-[85%] fixed mt-[15%] h-[25%] rounded-[8px] bg-[#d9d9d9] self-center')} />
				<div class={clsx('text-center h-3 opacity-50 w-fit font-normal text-[10px] leading-3 text-[#607d8b] mt-[10px]')}>
					Loading...
				</div>
			{:else}
				<img
					src="img1.png"
					alt=""
					class={clsx('w-[85%] mt-[15%] fixed h-[25%] rounded-[8px] bg-[#d9d9d9] self-center')}
				/>
				<div
					class={clsx('text-center fixed h-3 pt-1 mt-[33vh] md:mt-[44vh] sm:mt-[41vh]  opacity-50 w-fit font-normal text-[10px] leading-3 text-[#607d8b]')}>
					Ask anything about this Image below.
				</div>
			{/if}
			<hr class={clsx('w-[90%] fixed mt-[36vh] md:mt-[47vh] sm:mt-[44vh] opacity-40 border-[#607d8b] border-dashed border-t-2')} />
			<div class={clsx('mt-[36vh] md:mt-[47vh] sm:mt-[44vh] mb-[3vh] h-[55vh] overflow-y-auto flex flex-col w-full')}>
				{#if loading}
					<Skeleton
						class={clsx(
							'bg-[#d9d9d9] w-3/4 rounded-bl-[0.5px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] h-28 p-2 my-2 ml-2 self-start'
						)}
					/>
					<Skeleton
						class={clsx(
							'bg-[#d9d9d9] w-3/4 rounded-bl-[10px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[0.5px] h-16 p-2 my-2 mr-2 self-end'
						)}
					/>
					<Skeleton
						class={clsx(
							'bg-[#d9d9d9] w-3/4 rounded-bl-[0.5px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] h-24 p-2 my-2 ml-2 self-start'
						)}
					/>
				{:else}
					{#each conv as conversation}
						{#if conversation.sender === 'hm'}
							<div class={clsx('text-[16px] text-[rgba(38,50,56,1)] w-3/4 flex leading-6 self-end bg-[rgba(38,50,56,0.05)] rounded-bl-[12px] rounded-tl-[12px] rounded-tr-[4px] rounded-br-[12px] h-14 max-w-fit py-1 px-4 my-2 mr-2')}>
								{conversation.txt}
								<div class="h-3 opacity-70 text-[10px] self-end leading-3 font-medium text-[#6e6e6e] px-2 w-fit">
									{conversation.time}
								</div>
							</div>
                            <HumanChat conversation={conversation} />
						{:else}
                            <AiChat conversation={conversation} />
						{/if}
					{/each}
				{/if}
			</div>
		</div>
		<CommonSearchBar bind:inpVal={searchVal} class='mt-[92vh]'/>
	</div>
</div>