<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const { character } = data;
	import Video from '$lib/components/VideoPlayer/Video.svelte';
</script>

<Video
	details={{
		id: character.id,
		filmId: character.filmId,
		type: character.type,
		title: character.name,
		genre: character.genre,
		description: character.description,
		fileId: character.fileId,
		thumbnailId: character.imageId,
		mimetype: character.mimetype,
		createdAt: character.createdAt,
		size: character.size
	}}
/>
