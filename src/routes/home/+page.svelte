<script>
	import CommonNavbar from '$lib/components/CommonNavbar.svelte';
    import ImgChatHistory from './components/ImgChatHistory.svelte';
	import TextChatHistory from './components/TextChatHistory.svelte';
    function back(){
        return;
    }
    function createNewChat(){
        
    }
    function share(){
        return;
    }
</script>

<div class="flex flex-col" >
	<CommonNavbar handleLeftTextClick={back} handleRightTextClick={createNewChat} handleSecondFromRightClick={share} headingLeft="History" buttonTextRight="New" shareAvailable="false" />
	<div class="flex flex-col mt-[60px]">
        <ImgChatHistory/>
        <TextChatHistory/>
        <ImgChatHistory/>
        <ImgChatHistory/>
        <ImgChatHistory/>
        <ImgChatHistory/>
        <TextChatHistory/>
        <TextChatHistory/>
        <TextChatHistory/>
	</div>
</div>

<style>
</style>
