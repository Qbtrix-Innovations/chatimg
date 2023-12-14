<script>
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
import clsx from 'clsx';
const seePricing = () =>{
    goto('/pricingTable')
}
</script>

<div>
	<div class={clsx('bg-[#2e6434] flex flex-col-reverse h-screen')}>
        <img src="/pexels-godisable-jacob-871495-removebg-preview 1.png" alt="" srcset="" class={clsx('w-full')} />
		<div class={clsx('mt-[5%] ml-[5%]')}>
			<div class={clsx('text-white font-normal text-[32px] leading-[48px] ml-[5%]')}>Save More</div>
			<div class={clsx('text-white font-bold text-[32px] leading-[48px] ml-[5%]')}>
				With Goodplans
			</div>
			<div class={clsx('text-white font-normal text-[18px] leading-6 mt-4 ml-[5%] w-4/5')}>
				Choose a plan and get onboard in minutes. Then get $100 credits for your next payment.
			</div>
            <Button on:click={seePricing} class={clsx('text-white bg-transparent hover:bg-transparent ml-[5%] mt-[5%]')} >
                <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clip-path="url(#clip0_8155_91)">
                    <path
                        d="M26.9533 18.3333L18.0133 9.39335L20.37 7.03668L33.3333 20L20.37 32.9633L18.0133 30.6067L26.9533 21.6667H6.66663V18.3333H26.9533Z"
                        fill="white"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_8155_91">
                        <rect width="40" height="40" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            </Button>
			<!-- <div class={clsx('text-white ml-[5%] mt-[5%]')}>
				<svg
					width="40"
					height="40"
					viewBox="0 0 40 40"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clip-path="url(#clip0_8155_91)">
						<path
							d="M26.9533 18.3333L18.0133 9.39335L20.37 7.03668L33.3333 20L20.37 32.9633L18.0133 30.6067L26.9533 21.6667H6.66663V18.3333H26.9533Z"
							fill="white"
						/>
					</g>
					<defs>
						<clipPath id="clip0_8155_91">
							<rect width="40" height="40" fill="white" />
						</clipPath>
					</defs>
				</svg>
			</div> -->
		</div>
	</div>
</div>

<style>
</style>
