<script lang="ts">
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	import Home from '$lib/svg/Home.svelte';
	import CreateCircle from '$lib/svg/CreateCircle.svelte';
	import UsersGroup from '$lib/svg/UsersGroup.svelte';
	import Device from '$lib/svg/Device.svelte';
	import Live from '$lib/svg/Live.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	let hyperlinks = [
		{
			name: 'Home',
			link: '/admin/dashboard',
			active: data.url === '/admin/dashboard',
			icon: Home
		},
		{
			name: 'Create',
			link: '/admin/dashboard/create',
			active: data.url === '/admin/dashboard/create',
			icon: CreateCircle
		},
		{
			name: 'Users',
			link: '/admin/dashboard/users',
			active: data.url === '/admin/dashboard/users',
			icon: UsersGroup
		},
		{
			name: 'Plans',
			link: '/admin/dashboard/plans',
			active: data.url === '/admin/dashboard/plans',
			icon: Device
		},
		{
			name: 'Live',
			link: '/admin/dashboard/live',
			active: data.url === '/admin/dashboard/live',
			icon: Live
		}
	];
</script>

<Sidebar {hyperlinks}>
	<slot />
</Sidebar>
