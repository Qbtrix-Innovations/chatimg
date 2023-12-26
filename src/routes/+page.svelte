<script>
	import { goto } from '$app/navigation';
    import {ImagePlus} from 'lucide-svelte';
	import CommonMessageBar from '$lib/components/CommonMessageBar.svelte';
    const allFunc = ()=>{
        goto('/auth');
    }
    /**
     * @type{any}
     */
    let file;
    /**
    * @type{any}
    */
    let searchVal;
    $:{
        const var1 = file;
        const var2 = searchVal;
        if (var1) {
            allFunc();
        }
        if (var2) {
            allFunc();
        }
    }
</script>
<div class="bg-[#f5f5f5] h-screen flex flex-col">
	<div class="font-semibold text-[14px] text-[#263238] mt-2 mx-4 flex flex-row justify-between align-middle items-center">
		<div>
			Chat Img
		</div>
		<button on:click={allFunc} class="bg-[rgba(76,175,80,0.81)] rounded-[10px] px-2">
			<span class="text-xs font-medium leading-[14.5px] text-white" >New</span>
		</button>
	</div>
	<div class="flex flex-col self-center mt-[80%] items-center justify-center w-[85%]  h-[26vh] shadow-[0px_4px_3.7px_0px_rgba(0,0,0,0.22)] border-dashed border-[2px] border-[rgba(200,200,200,1)]">
			<label	class="w-full h-full flex flex-col items-center px-4 py-6 rounded-lg tracking-wide cursor-pointer">
				<ImagePlus size=46 color="#bcc7c7" stroke-width=2.5 />
                <div class="flex flex-col self-center">
                    <div class="mt-2 text-base leading-normal self-center">
                        <span class="text-[rgba(77,77,77,1)] leading-4 font-bold" >+</span> 
                        <span class="text-[rgba(115,115,115,1)] leading-4 font-medium" >Upload Image</span>
                    </div>
                    <div class="flex mt-4 self-center h-[24px] w-3/4 opacity-[44%] font-medium text-[10px] text-center items-center leading-3">
                        Upload an image or take a photo by clicking here to start chatting.
                    </div>
                </div>
                <button
				on:click={allFunc}	
                class="hidden"
				/>
			</label>
		</div>
	<div
		class={'flex fixed flex-row mt-[92vh] w-[90%] self-center justify-center items-center rounded-[21px]'}
	>
        <CommonMessageBar
        onClickedImp={allFunc}
        bind:file
        imgUploadClicked={allFunc}
        sentMessageClicked={allFunc}
        bind:inpVal={searchVal}
        class="mt-8"
		/>
    </div>
</div>
