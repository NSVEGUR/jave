<script lang="ts">
	import { slide } from 'svelte/transition';
	export let characters: App.Character[];
</script>

<div class="max-w-[300px] flex flex-col gap-5 mt-5" transition:slide>
	{#each characters as character}
		<a
			href="/admin/library/character/{character.id}"
			class="flex gap-2 items-center p-3 bg-black bg-opacity-70 backdrop-blur-lg"
		>
			<img
				class="h-12 w-12 rounded-full"
				src="/api/film/{character.imageId}/thumbnail"
				alt={character.name}
			/>
			<div class="flex flex-col gap-1 text-lg">
				<h1 class="text-skin-muted-base font-medium">{character.name}</h1>
				<h2 class="text-skin-muted-inverted text-xs">{character.description}</h2>
			</div>
		</a>
	{/each}
</div>
