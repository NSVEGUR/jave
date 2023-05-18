<script>
	import '../app.postcss';
	import Snackbar from '$lib/components/Snackbar.svelte';
</script>

<div class="bg-dominant text-skin-base h-screen w-screen overflow-hidden">
	<Snackbar />
	<slot />
</div>
