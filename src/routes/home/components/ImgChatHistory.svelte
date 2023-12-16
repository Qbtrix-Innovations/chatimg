<script>
	import { goto } from "$app/navigation";

	// import { chatsData } from "$lib/stores/chats/chatStore";
    // $chatsData[0].images[0].
    /**
	 * @type {any}
	 */
     export let url;
     console.log(url);
    /**
	 * @type {any}
	 */
     export let time;
    /**
	 * @type {string}
	 */
     export let lastMessage;
     /**
	 * @type {string}
	 */
      export let chatId;
     export const onClick=()=>{
        goto(`/chats/${chatId}`)
     }
</script>
<div class='flex flex-col w-full mt-4 hover:opacity-100 active:opacity-100' on:click={onClick} >
    <div class="flex flex-row items-center w-full ml-[16px]">
        <img src={url} alt="" class="hover:opacity-100 rounded-[5px] bg-[rgba(217,217,217,1)] h-9 w-12"/>
        <div class="flex flex-col pl-2">
            <div class='font-normal text-[14px] leading-6 text-[rgba(38,50,56,1)] text-left ' >{lastMessage.length>0?lastMessage.substring(0,30)+'...':'Write a message to start conversation !'}</div>
            <div class='text-[rgba(110,110,110,1)] leading-3 text-[10px] font-medium h-3 text-left' >{new Date(time.seconds*1000).toString().slice(0,25)}</div>
        </div>
    </div>
    <hr class='w-full mt-2 border-[0.6px] bg-[rgba(218,218,218,1)] border-[rgba(218,218,218,1)]' >
</div>