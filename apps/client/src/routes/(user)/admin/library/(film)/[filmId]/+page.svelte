<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const { film } = data;
	import Video from '$lib/components/VideoPlayer/Video.svelte';
</script>

<Video
	details={{
		id: film.id,
		type: film.type,
		title: film.title,
		genre: film.genre,
		description: film.description,
		fileId: film.fileId,
		thumbnailId: film.thumbnailId,
		filmId: film.id,
		mimetype: film.mimetype,
		createdAt: film.createdAt,
		characters: film.characters,
		size: film.size
	}}
/>
