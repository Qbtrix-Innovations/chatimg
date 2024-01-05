<script>
	import { goto } from '$app/navigation';
	import Badge from '$lib/components/ui/badge/badge.svelte';
</script>

<section class="absolute bottom-20 left-20 h-20">
	<div class="flex flex-col justify-between h-full">
		<div class="flex gap-9">
			<div class="flex gap-4">
				<div>
					<Badge class="bg-transparent border-2 rounded-md border-[#878787] text-[#878787]"
						>TERMS</Badge
					>
				</div>
				<div>
					<Badge class="bg-transparent border-2 rounded-md border-[#878787] text-[#878787]"
						>PRIVACY</Badge
					>
				</div>
			</div>
			<div>
				<Badge class="bg-transparent border-2 rounded-md border-accent text-accent"
					>CONTACT US</Badge
				>
			</div>
		</div>

		<div class="text-[#878787] mt-1">All rights reserved © Qbtrix Innovations 2021</div>
	</div>
</section>
