<script>
	import clsx from "clsx";
    /**
	 * @type {any}
	 */
     export let conversation;
</script>

<div class={clsx('text-[16px] text-[rgba(38,50,56,1)] w-3/4 flex leading-6 self-end bg-[rgba(38,50,56,0.05)] rounded-bl-[12px] rounded-tl-[12px] rounded-tr-[4px] rounded-br-[12px] h-14 max-w-fit py-1 px-4 my-2 mr-2')}>
    {conversation.text}
    <div class="h-3 opacity-70 text-[10px] self-end leading-3 font-medium text-[#6e6e6e] px-2 w-fit">
        {conversation.sentAt}
    </div>
</div>