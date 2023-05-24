<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const { film } = data;
</script>

<video controls class="w-full h-full">
	<source src="/api/film/{film.fileId}" />
	<track kind="captions" />
</video>
