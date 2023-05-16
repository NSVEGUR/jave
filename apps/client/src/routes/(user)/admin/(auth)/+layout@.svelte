<script lang="ts">
	import Logo from '$lib/images/logo.png';
</script>

<main
	class="relative h-screen w-screen overflow-hidden bg-[url('/src/lib/images/vr-auth-bg.png')] bg-cover bg-no-repeat"
>
	<div class="absolute w-full h-full bg-black bg-opacity-70 inset-0" />
	<div class="absolute top-5 left-5">
		<img src={Logo} alt="logo" class="w-12" />
	</div>
	<div class="absolute w-full h-full inset-0  grid place-items-center">
		<slot><!-- optional fallback --></slot>
	</div>
</main>
