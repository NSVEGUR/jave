<script lang="ts">
	import { SvelteComponent, onMount } from 'svelte';

	export let hyperlinks: {
		name: string;
		link: string;
		active: boolean;
		icon: any;
	}[];

	onMount(() => {
		const links = document.querySelectorAll('.hyperlink-sidebar');
		if (links) {
			links.forEach((link, index) => {
				link.addEventListener('click', () => {
					hyperlinks.forEach((hyperlink) => {
						hyperlink.active = false;
					});
					hyperlinks[index].active = true;
				});
			});
		}
	});
</script>

<div class="flex w-full h-full">
	<nav
		class="min-w-[200px] flex flex-col p-5 gap-3 h-full bg-black pt-10 text-skin-muted-inverted"
	>
		{#each hyperlinks as { name, link, active, icon }}
			<a
				href={link}
				class="flex gap-1 p-1 px-2 items-center {active &&
					' bg-muted rounded-md text-skin-base'} hyperlink-sidebar"
			>
				<svelte:component this={icon} />
				{name}
			</a>
		{/each}
	</nav>
	<div>
		<slot><!-- optional fallback --></slot>
	</div>
</div>
