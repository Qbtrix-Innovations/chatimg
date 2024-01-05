<script>
	import { ThumbsDown, ThumbsUp, Clipboard } from 'lucide-svelte';
</script>

<section class="chatbotWidget">
	<div
		class="bg-background absolute w-96 lg:bottom-52 xl:bottom-20 2xl:bottom-20 xl:right-10 lg:right-auto lg:left-16 rounded-xl xl:left-auto"
	>
		<div>
			<div
				class="bg-[linear-gradient(180deg,#FFF_0%,#CBCDCA_100%)] p-4 rounded-t-xl dark:bg-[linear-gradient(180deg,#212121_0%,#333_100%)]"
			>
				<header class="text-accent font-semibold text-xl">
					Chat<span
						class="italic text-transparent bg-clip-text bg-[linear-gradient(180deg,#000_0%,rgba(61,61,61,0.43)_100%)] dark:bg-[linear-gradient(180deg,#FFF_0%,rgba(50,50,50,0.43)_100%)]"
						>IMG</span
					>
				</header>
			</div>
			<div class="my-3">
				<span
					class="text-[12px] flex w-full justify-center text-[#607D8B]/60 dark:text-white dark:opacity-[55%]"
					>About this image by Chat IMG</span
				>
			</div>
			<div class="bg-[rgba(226,239,238,0.90)] dark:bg-[#252525] m-5 rounded-lg">
				<p class="p-3 text-[16px] font-normal text-[#263238] dark:text-white">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
				</p>
				<div class="flex items-center justify-between w-full p-4">
					<div class="text-[rgba(96,125,139,0.50)] dark:text-white/50 flex items-center gap-2">
						<ThumbsUp class="w-[15px] h-[15px]" />
						<ThumbsDown class="w-[15px] h-[15px]" />
						<div class="flex items-center gap-1">
							<Clipboard class="w-[15px] h-[15px]" />
							<p class="text-[10px]">Copy</p>
						</div>
					</div>
					<p class="text-[rgba(96,125,139,0.50)] dark:text-white/50 text-[10px]">01:30 pm</p>
				</div>
			</div>
			<div class="text-center m-5">
				<p class="text-[14px] text-[rgba(96,125,139,0.65)] dark:text-white/50 font-medium">
					<span class="text-accent">Login</span> to <span class="italic">Chat</span>
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.chatbotWidget {
		font-family: 'Inter Variable', sans-serif;
	}
</style>
