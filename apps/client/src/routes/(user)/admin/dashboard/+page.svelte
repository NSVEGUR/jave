<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const { films } = data;
</script>

<pre>
	{JSON.stringify(films, null, 2)}
</pre>
