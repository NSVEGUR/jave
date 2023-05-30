<script lang="ts">
	import Logo from '$lib/images/logo.png';
	import Login from '$lib/svg/Login.svelte';
</script>

<main class="relative h-full w-full overflow-hidden">
	<header
		class="sticky w-full h-16 top-0 flex items-center justify-between px-20 z-10 bg-black bg-opacity-90 backdrop-blur-md"
	>
		<div class="flex items-end">
			<img src={Logo} alt="logo" class="w-8" />
			<span class="font-bold text-accent text-xl">ave</span>
		</div>
		<form action="/login" method="POST">
			<button
				type="submit"
				class="flex gap-1 items-center bg-accent justify-center text-sm text-skin-inverted font-medium p-2 rounded-md"
			>
				<Login /> Signin
			</button>
		</form>
	</header>
	<slot><!-- optional fallback --></slot>
</main>
