<script lang="ts">
	import ForwardSolid from '$lib/svg/ForwardSolid.svelte';
	import BackwardSolid from '$lib/svg/BackwardSolid.svelte';
	import SpeakerWaveSolid from '$lib/svg/SpeakerWaveSolid.svelte';
	import SpeakerMuteSolid from '$lib/svg/SpeakerMuteSolid.svelte';
	import PlaySolid from '$lib/svg/PlaySolid.svelte';
	import PauseSolid from '$lib/svg/PauseSolid.svelte';
	import CogSixToothSolid from '$lib/svg/CogSixToothSolid.svelte';
	import ArrowLeft from '$lib/svg/ArrowLeft.svelte';
	import ChevronDown from '$lib/svg/ChevronDown.svelte';
	import Characters from './Characters.svelte';
	import Settings from './Settings.svelte';
	import { onMount } from 'svelte';
	import { Video } from './Video.svelte';
	import { page } from '$app/stores';
	export let currentDuration = '00:00';
	export let totalDuration = '00:00';
	export let showControls: boolean;
	export let isPlaying: boolean;
	export let details: App.Video;
	let isFullScreen = false;
	let isMuted = false;
	let showCharacters = false;
	let showSettings = false;
	onMount(() => {
		({ currentDuration, totalDuration } = $Video.handleTimeUpdate());
		$Video.handleVolume();
	});
	const handleOuterClick = (e: MouseEvent) => {
		const character = (e.target as HTMLElement).closest('#characters');
		const showCharacterBtn = (e.target as HTMLElement).closest('#show-characters-btn');
		if (!character && !showCharacterBtn && showCharacters) {
			showCharacters = false;
		}
	};
	$: ({
		url: { pathname }
	} = $page);
	let filteredCharacters: App.Character[];
	$: if (details.characters) {
		{
			filteredCharacters = details.characters.filter((character) => {
				for (const timestamp of character.timestamps) {
					if (timestamp.start <= $Video.timestamp && timestamp.end >= $Video.timestamp) {
						return true;
					}
				}
				return false;
			});
		}
	}
</script>

<div class="block {!showControls && 'invisible'}">
	<div class="absolute inset-0 w-full h-full bg-black bg-opacity-80" />
	<div class="absolute top-0 left-0 px-10 pt-5 flex w-full justify-between">
		<div class="flex flex-col gap-2">
			{#if pathname.includes('character')}
				<a href="/admin/library/{details.filmId}"> <ArrowLeft /></a>
			{:else}
				<a href="/admin/library"> <ArrowLeft /></a>
			{/if}
			<div class="flex gap-2">
				<div class="h-12 w-[2px] bg-accent" />
				<div class="text-skin-muted-inverted">
					<h1>Rated U/A</h1>
					<h2>Genre: <span class="text-skin-muted-base">{details.genre}</span></h2>
				</div>
			</div>
		</div>
		{#if !pathname.includes('character') && filteredCharacters.length > 0}
			<div class="flex flex-col gap-1 items-end justify-start">
				<button
					class="flex gap-1 items-center justify-center"
					on:click={() => {
						showCharacters = !showCharacters;
					}}
					id="show-characters-btn"
				>
					X-Ray
					<ChevronDown />
				</button>
				{#if showCharacters}
					<Characters characters={filteredCharacters} />
				{/if}
			</div>
		{/if}
	</div>
	<div class="flex gap-2 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
		<button on:click={$Video.backward}>
			<BackwardSolid />
		</button>
		<button on:click={$Video.togglePlay}>
			{#if isPlaying}
				<PauseSolid />
			{:else}
				<PlaySolid />
			{/if}
		</button>
		<button on:click={$Video.forward}>
			<ForwardSolid />
		</button>
	</div>
	<div class="absolute bottom-0 w-full px-10 py-5 flex flex-col gap-2">
		<div class="flex flex-col gap-2">
			<h1 class="text-5xl font-bold">{details.title}</h1>
			<p class="w-[50%] text-skin-muted-inverted">{details.description}</p>
		</div>
		<div>
			<input
				type="range"
				class="w-full accent-accent h-[6px] cursor-pointer"
				id="time"
				on:input={$Video.handleTimeInput}
				value="0"
			/>
		</div>
		<div class="w-full flex justify-between items-center relative">
			<div class="flex items-center gap-1">
				<button
					on:click={() => {
						isMuted = $Video.toggleMute(isMuted);
					}}
				>
					{#if isMuted}
						<SpeakerMuteSolid />
					{:else}
						<SpeakerWaveSolid />
					{/if}
				</button>
				<input
					type="range"
					class="accent-muted-inverted h-1 w-20 cursor-pointer"
					id="volume"
					value="100"
					on:input={$Video.handleVolume}
				/>
				<span class="ml-2"> {currentDuration} / {totalDuration} </span>
			</div>
			<div class="flex gap-2 justify-center items-center">
				<div>
					{#if showSettings}
						<Settings />
					{/if}
					<button
						id="show-settings-btn"
						on:click={() => {
							showSettings = !showSettings;
						}}
					>
						<CogSixToothSolid />
					</button>
				</div>
				<button
					on:click={async () => {
						isFullScreen = await $Video.toggleFullScreen(isFullScreen);
					}}
				>
					{#if isFullScreen}
						<i class="fas fa-compress" />
					{:else}
						<i class="fas fa-expand" />
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>

<svelte:window on:click={handleOuterClick} />
