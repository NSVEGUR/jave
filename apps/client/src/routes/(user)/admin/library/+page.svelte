<script lang="ts">
	import type { PageData } from './$types';
	import PlaySolid from '$lib/svg/PlaySolid.svelte';
	export let data: PageData;
	const { films } = data;
</script>

<main class="p-10">
	{#if films.length > 0}
		<h1 class="text-3xl font-medium mb-5">Films</h1>
		{#each films as film}
			<div>
				<a href="/admin/library/{film.id}" class="relative group">
					<img
						src="/api/film/{film.thumbnailId}/thumbnail"
						alt={film.title}
						class=" h-36 w-60 object-cover rounded-xl"
					/>
					<div
						class="absolute w-full h-full inset-0 bg-black bg-opacity-60 hidden group-hover:block"
					/>
					<span
						class="absolute inset-0 w-full h-full text-skin-base hidden group-hover:flex items-center justify-center"
					>
						<PlaySolid />
					</span>
				</a>
				<h2 class="mt-1 text-sm">{film.title}</h2>
				<h3 class="text-xs">{(film.description, film.genre)}</h3>
			</div>
		{/each}
	{:else}
		<div class="flex w-full h-full items-center justify-center">
			<h1>No films found</h1>
		</div>
	{/if}
</main>
