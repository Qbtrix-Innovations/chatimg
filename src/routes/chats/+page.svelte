<script>
	import HumanChat from './components/HumanChat.svelte';
	import { clsx } from 'clsx';
	import { Skeleton } from '$lib/components/ui/skeleton';
    import { Button } from '$lib/components/ui/button';
    import CommonNavbar from '$lib/components/CommonNavbar.svelte'
    import CommonMessageBar from '$lib/components/CommonMessageBar.svelte'
    import { onMount } from 'svelte';
	let loading = false;
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
			<CommonNavbar  headingLeft='File name goes here ...' buttonTextRight="New" shareAvailable='true' />
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
							<div class={clsx('text-[16px] w-3/4 self-start bg-[rgba(226,239,238,0.9)] rounded-bl-[12px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[4px] h-fit max-w-fit py-2 my-2 ml-2')}>
							<div class="pl-4" >{conversation.txt}</div>
								<div class="flex flex-row justify-between pr-2 pt-2 items-center align-middle">
									<div class="flex flex-row justify-center px-2">
										<Button class='bg-transparent px-1' size='sm' >
											<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
												<g clip-path="url(#clip0_8006_113214)">
												<path d="M14.6285 4.53926C14.4745 4.36479 14.2852 4.22508 14.073 4.12941C13.8609 4.03374 13.6308 3.9843 13.3981 3.98438H10.3512V3.28125C10.3504 2.59773 10.0785 1.94242 9.59522 1.4591C9.1119 0.975773 8.45659 0.7039 7.77307 0.703125C7.64254 0.70314 7.5146 0.739488 7.40356 0.808099C7.29252 0.876709 7.20277 0.974874 7.14436 1.0916L4.99456 5.39062H2.61682C2.30602 5.39062 2.00795 5.51409 1.78818 5.73386C1.56841 5.95363 1.44495 6.2517 1.44495 6.5625V11.7188C1.44495 12.0296 1.56841 12.3276 1.78818 12.5474C2.00795 12.7672 2.30602 12.8906 2.61682 12.8906H12.6949C13.0948 12.8906 13.4809 12.7445 13.7806 12.4798C14.0804 12.2151 14.2731 11.8501 14.3227 11.4533L15.0258 5.82832C15.0547 5.59757 15.0343 5.36331 14.9658 5.14107C14.8973 4.91883 14.7823 4.71369 14.6285 4.53926ZM2.8512 6.79688H4.7262V11.4844H2.8512V6.79688ZM13.6324 5.6543L12.9293 11.2793C12.9221 11.3363 12.8943 11.3886 12.8511 11.4264C12.8079 11.4642 12.7523 11.4848 12.6949 11.4844H6.13245V6.25957L8.17268 2.17969C8.39895 2.26176 8.59446 2.41153 8.73263 2.60861C8.8708 2.8057 8.94493 3.04055 8.94495 3.28125V4.6875C8.94495 4.87398 9.01903 5.05282 9.15089 5.18468C9.28275 5.31655 9.46159 5.39062 9.64807 5.39062H13.3981C13.4315 5.39036 13.4646 5.39725 13.4951 5.41081C13.5256 5.42438 13.5529 5.44431 13.5751 5.46928C13.5973 5.49425 13.6139 5.52368 13.6238 5.55559C13.6337 5.5875 13.6366 5.62115 13.6324 5.6543Z" fill="#607D8B" fill-opacity="0.5"/>
												</g>
												<defs>
												<clipPath id="clip0_8006_113214">
												<rect width="15" height="15" fill="white" transform="translate(0.741821)"/>
												</clipPath>
												</defs>
											</svg>
										</Button>
										<Button class='bg-transparent px-1' size='sm'>
											<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
												<g clip-path="url(#clip0_8006_113215)">
												<path d="M15.0258 9.17168L14.3227 3.54668C14.2731 3.1499 14.0804 2.78487 13.7806 2.5202C13.4809 2.25553 13.0948 2.10943 12.6949 2.10938H2.61682C2.30602 2.10938 2.00795 2.23284 1.78818 2.45261C1.56841 2.67238 1.44495 2.97045 1.44495 3.28125V8.4375C1.44495 8.59139 1.47526 8.74378 1.53415 8.88596C1.59304 9.02814 1.67936 9.15732 1.78818 9.26614C1.897 9.37496 2.02619 9.46128 2.16836 9.52017C2.31054 9.57906 2.46293 9.60938 2.61682 9.60938H4.99456L7.14436 13.9084C7.20277 14.0251 7.29252 14.1233 7.40356 14.1919C7.5146 14.2605 7.64254 14.2969 7.77307 14.2969C8.45659 14.2961 9.1119 14.0242 9.59522 13.5409C10.0785 13.0576 10.3504 12.4023 10.3512 11.7188V11.0156H13.3981C13.6307 11.0156 13.8606 10.9661 14.0726 10.8704C14.2846 10.7748 14.4739 10.6351 14.6278 10.4607C14.7817 10.2864 14.8968 10.0813 14.9654 9.85902C15.0341 9.63677 15.0546 9.40248 15.0258 9.17168ZM4.7262 8.20312H2.8512V3.51562H4.7262V8.20312ZM13.5739 9.53027C13.5518 9.55517 13.5248 9.57509 13.4945 9.58873C13.4642 9.60237 13.4313 9.60941 13.3981 9.60938H9.64807C9.46159 9.60938 9.28275 9.68345 9.15089 9.81532C9.01903 9.94718 8.94495 10.126 8.94495 10.3125V11.7188C8.94493 11.9594 8.8708 12.1943 8.73263 12.3914C8.59446 12.5885 8.39895 12.7382 8.17268 12.8203L6.13245 8.74043V3.51562H12.6949C12.7523 3.51517 12.8079 3.53581 12.8511 3.57361C12.8943 3.61141 12.9221 3.66375 12.9293 3.7207L13.6324 9.3457C13.6364 9.37887 13.6332 9.41249 13.6231 9.44432C13.613 9.47615 13.5962 9.50546 13.5739 9.53027Z" fill="#607D8B" fill-opacity="0.5"/>
												</g>
												<defs>
												<clipPath id="clip0_8006_113215">
												<rect width="15" height="15" fill="white" transform="translate(0.741821)"/>
												</clipPath>
												</defs>
											</svg>	
										</Button>
										<Button class='bg-transparent px-1 pl-2' size='sm'>
											<svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path fill-rule="evenodd" clip-rule="evenodd" d="M3.66654 4H7.33321C7.58621 4 7.79154 3.7765 7.79154 3.5V1.5C7.79154 1.2235 7.58621 1 7.33321 1H3.66654C3.41354 1 3.20821 1.2235 3.20821 1.5V3.5C3.20821 3.7765 3.41354 4 3.66654 4ZM8.24988 3.5V2C9.00796 2 9.62488 2.673 9.62488 3.5V9.5C9.62488 10.327 9.00796 11 8.24988 11H2.74988C1.99179 11 1.37488 10.327 1.37488 9.5V3.5C1.37488 2.673 1.99179 2 2.74988 2V3.5C2.74988 4.0515 3.161 4.5 3.66654 4.5H7.33321C7.83875 4.5 8.24988 4.0515 8.24988 3.5Z" fill="#607D8B" fill-opacity="0.5"/>
												<mask id="mask0_8006_113217" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="1" y="1" width="9" height="10">
												<path fill-rule="evenodd" clip-rule="evenodd" d="M3.66654 4H7.33321C7.58621 4 7.79154 3.7765 7.79154 3.5V1.5C7.79154 1.2235 7.58621 1 7.33321 1H3.66654C3.41354 1 3.20821 1.2235 3.20821 1.5V3.5C3.20821 3.7765 3.41354 4 3.66654 4ZM8.24988 3.5V2C9.00796 2 9.62488 2.673 9.62488 3.5V9.5C9.62488 10.327 9.00796 11 8.24988 11H2.74988C1.99179 11 1.37488 10.327 1.37488 9.5V3.5C1.37488 2.673 1.99179 2 2.74988 2V3.5C2.74988 4.0515 3.161 4.5 3.66654 4.5H7.33321C7.83875 4.5 8.24988 4.0515 8.24988 3.5Z" fill="white"/>
												</mask>
												<g mask="url(#mask0_8006_113217)">
												<rect x="-0.00012207" width="11" height="12" fill="#607D8B" fill-opacity="0.5"/>
												</g>
											</svg>
											<div class="pl-1 leading-6 text-[12px] font-normal text-[rgba(96,125,139,0.5)]" >Copy</div>
										</Button>
									</div>
									<div class="text-[rgba(110,110,110,1)] leading-3 font-medium text-[10px] opacity-70">
										{conversation.time}
									</div>
								</div>
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		</div>
		<CommonMessageBar bind:inpVal={searchVal} class='mt-[92vh]'/>
	</div>
</div>