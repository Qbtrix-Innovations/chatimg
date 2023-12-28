<script>
	import { clsx } from 'clsx';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import { goto } from '$app/navigation';
	export { className as class };

	/**
	 * @type {string}
	 */
	export let inpVal;
	let className = '';
	/**
	 * @type {() => any}
	 */
	 export let sentMessageClicked;
	const sentClicked = async () => {
		await sentMessageClicked();
	};
	export let file;
	/**
	 * @type{boolean}
	 */
	export let onClickedNavigationToNewChat;
	function initialNavigationToNewChat(){
		if (onClickedNavigationToNewChat===true) {
			goto('/auth');
		}
	}
</script>

<div
	class={clsx('flex fixed flex-row w-[90%] justify-center items-center rounded-[21px]', className)}
	on:click={initialNavigationToNewChat}
>
	<div
		class={clsx(
			'h-10 w-10 flex bg-[#4caf50] m-2 pb-2 px-2 rounded-full align-middle text-center hover:bg-[rgba(76,175,80,0.8)] leading-9 font-medium text-[30px] text-[#ffffff] '
		)}
	>
		<label>
			+
			<input
				type="file"
				accept="image/*;pdf/*"
				name="file"
				on:change={(/**@type {any}*/ e) => {
					file = e.target.files[0];
				}}
				class="hidden"
			/>
		</label>
	</div>
	<Input
		class={clsx(
			'sm:pl-10 sm:pr-12 px-10 w-[90%] rounded-[21px] h-[42px] bg-white shadow-[0px_3px_3.2px_0px_#D2D2D224] text-[#607D8B] leading-4 items-center text-[14px]'
		)}
		placeholder="Type here ..."
		bind:value={inpVal}
	/>
	<Button class="bg-transparent absolute sm:ml-[85%] ml-[85%]" on:click={sentClicked}>
		<svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M9.41254 0.286905L22.2984 6.47173C24.3113 7.43791 24.3113 10.1955 22.2983 11.1617L9.41254 17.3465C7.1207 18.4465 4.6547 16.1844 5.69537 13.9367L7.5729 9.88149C7.60912 9.80326 7.64116 9.72375 7.66902 9.64326L12.3343 9.64327C12.8096 9.64327 13.1948 9.2732 13.1948 8.8167C13.1948 8.3602 12.8096 7.99013 12.3343 7.99013L7.66902 7.99013C7.64116 7.90964 7.60912 7.83013 7.5729 7.7519L5.69537 3.69667C4.6547 1.44896 7.12071 -0.81311 9.41254 0.286905ZM0 6.61252C0 6.15602 0.385274 5.78596 0.860534 5.78596H3.15529C3.63055 5.78596 4.01583 6.15602 4.01583 6.61252C4.01583 7.06902 3.63055 7.43909 3.15529 7.43909H0.860534C0.385274 7.43909 0 7.06902 0 6.61252ZM0.860534 10.194C0.385274 10.194 0 10.5641 0 11.0206C0 11.4771 0.385274 11.8472 0.860534 11.8472H3.15529C3.63055 11.8472 4.01583 11.4771 4.01583 11.0206C4.01583 10.5641 3.63055 10.194 3.15529 10.194H0.860534Z"
				fill="#4CAF50"
			/>
		</svg>
	</Button>
</div>
