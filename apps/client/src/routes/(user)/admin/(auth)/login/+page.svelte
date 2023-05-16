<script lang="ts">
	import Profile from '$lib/images/profile.png';
	import Google from '$lib/images/google.png';
	import type { ActionData } from './$types';
	let visibility = false;
	export let form: ActionData;
</script>

<form
	action="?/login"
	method="POST"
	class="bg-black bg-opacity-70 rounded-md backdrop-blur-lg w-max min-w-[500px] flex flex-col items-start justify-center gap-5 p-12"
>
	<h1 class="text-3xl font-bold">Log In</h1>
	<div class="flex items-center justify-center gap-3">
		<div class="w-12 h-12 rounded-full bg-dominant shadow-xl flex relative">
			<span class="absolute -bottom-1 -left-1 text-2xl">👋🏼</span>
			<img src={Profile} alt="profile" />
		</div>
		<h2 class="text-2xl font-heading font-bold">
			Hey <span class="text-accent">Admin</span>,
			<span class="text-lg font-primary font-light">welcome back!</span>
		</h2>
	</div>
	<div class="flex flex-col gap-1 w-full">
		<div class="w-full flex flex-col bg-inverted text-skin-inverted p-2 rounded-md">
			<label for="email" class="text-skin-muted-inverted text-sm">Email</label>
			<input
				class="bg-transparent focus:bg-transparent outline-none w-full"
				name="email"
				type="email"
				id="email"
				required
			/>
		</div>
	</div>
	<div class="w-full flex flex-col bg-inverted text-skin-inverted p-2 rounded-md">
		<label for="password" class="text-skin-muted-inverted text-sm">Password</label>
		<div class="flex">
			<input
				class="bg-transparent focus:bg-transparent outline-none w-full"
				name="password"
				type={visibility ? 'text' : 'password'}
				autocomplete="true"
				id="password"
				required
			/>
			<button
				on:click|preventDefault={() => {
					visibility = !visibility;
				}}
			>
				{#if visibility}
					<i class="fas fa-eye-slash fa-sm" />
				{:else}
					<i class="fas fa-eye fa-sm" />
				{/if}
			</button>
		</div>
	</div>
	<div class="flex justify-between w-full font-medium items-center">
		<div class="remember">
			<input class="cursor-pointer" type="checkbox" id="remember" value="remember" />
			<label for="remember"> Remember me </label>
		</div>
		<a href="/user/forgotpassword">Forgot password?</a>
	</div>
	{#if form?.error}
		<div class="w-full text-center text-sm text-skin-error">{form.error}</div>
	{/if}
	<button class="bg-accent w-full p-2 rounded-md text-skin-inverted font-medium">Log In</button>
	<div class="flex items-center w-full justify-center gap-1">
		<div class="h-[1px] bg-inverted flex-grow" />
		<div>or</div>
		<div class="h-[1px] bg-inverted flex-grow" />
	</div>
	<button
		type="submit"
		class="rounded-md border-inverted w-full border-2 text-skin-base p-2 transition-colors font-medium flex justify-center items-center gap-1 hover:text-accent hover:border-accent"
		><img class=" w-5 " src={Google} alt="google" />Continue with Google</button
	>
</form>
