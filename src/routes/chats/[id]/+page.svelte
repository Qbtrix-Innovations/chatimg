<script>
	import HistorySidebar from './components/HistorySidebar.svelte';
	import MainFrame from './components/MainFrame.svelte';
	import Navbar from './components/Navbar.svelte';
	import RightSidebar from './components/RightSidebar.svelte';
	import ChatNav from './components/chatNav.svelte';
    
	export let data;
    console.log(data)
</script>

<section class="bg-card h-[100vh]">
	<div class="w-full hidden xl:block">
		<Navbar newChatButton={true} shareButton={true} {data}/>
	</div>
	<div class="w-full xl:hidden block">
		<ChatNav data={data} />
	</div>
	<div class="flex w-full">
		<div class="w-full hidden xl:block">
			<HistorySidebar activeId={data.uid} />
		</div>
		<div class="">
			<MainFrame {data} />
		</div>
		<div class="hidden xl:block">
			<RightSidebar />
		</div>
	</div>
</section>
