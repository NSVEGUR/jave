<script lang="ts">
	import type { LayoutData } from './$types';
	import SearchSvg from '$lib/components/SVG/SearchSVG.svelte';
	import Logo from '$lib/images/logo.png';
	import { onMount } from 'svelte';
	export let data: LayoutData;
	let hyperlinks = [
		{
			name: 'Watch Now',
			link: '/admin',
			active: data.url === '/admin'
		},
		{
			name: 'Store',
			link: '/admin/store',
			active: data.url === '/admin/store'
		},
		{
			name: 'Library',
			link: '/admin/library',
			active: data.url === '/admin/library'
		},
		{
			name: 'Account',
			link: '/admin/account',
			active: data.url === '/admin/account'
		}
	];
	onMount(() => {
		const links = document.querySelectorAll('.hyperlink');
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

<main class="relative h-full w-full overflow-hidden">
	<header
		class="sticky w-full h-16 top-0 flex items-center justify-between px-20 z-10 bg-black bg-opacity-90 backdrop-blur-md"
	>
		<div>
			<img src={Logo} alt="logo" class="w-8" />
		</div>
		<ul
			class="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 w-max text-sm flex border-[1px] border-base rounded-md text-skin-muted-inverted font-medium"
		>
			{#each hyperlinks as hyperlink, index}
				<li
					class="px-2 w-[110px] {hyperlink.active
						? 'rounded-md bg-muted text-skin-base py-1'
						: 'my-1'} "
				>
					<a
						href={hyperlink.link}
						class="w-full h-full flex items-center justify-center hyperlink"
					>
						{hyperlink.name}
					</a>
				</li>
			{/each}
		</ul>
		<div
			class="h-7 border-[1px] border-base rounded-md flex items-center px-1 text-skin-muted-inverted text-sm"
		>
			<SearchSvg />
			<input
				type="text"
				class="w-full p-1 bg-transparent outline-none flex-grow"
				placeholder="Search"
			/>
		</div>
	</header>
	<slot><!-- optional fallback --></slot>
</main>
