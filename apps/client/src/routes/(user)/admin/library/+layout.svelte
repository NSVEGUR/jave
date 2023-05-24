<script lang="ts">
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	import Home from '$lib/svg/Home.svelte';
	import Jave from '$lib/svg/Jave.svelte';
	import Live from '$lib/svg/Live.svelte';
	import VideoCamera from '$lib/svg/VideoCamera.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import TV from '$lib/svg/TV.svelte';

	let hyperlinks = [
		{
			name: 'Home',
			link: '/admin/library',
			active: data.url === '/admin/library',
			icon: Home
		},
		{
			name: 'Movies',
			link: '/admin/library/movies',
			active: data.url === '/admin/library/movies',
			icon: VideoCamera
		},
		{
			name: 'Jave',
			link: '/admin/library/jave',
			active: data.url === '/admin/library/jave',
			icon: Jave
		},
		{
			name: 'Series',
			link: '/admin/library/series',
			active: data.url === '/admin/library/series',
			icon: TV
		},
		{
			name: 'Live',
			link: '/admin/library/live',
			active: data.url === '/admin/library/live',
			icon: Live
		}
	];
</script>

<Sidebar {hyperlinks}>
	<slot />
</Sidebar>
