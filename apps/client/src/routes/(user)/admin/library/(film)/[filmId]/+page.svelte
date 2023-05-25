<script lang="ts">
	import type { PageData } from './$types';
	import ForwardSolid from '$lib/svg/ForwardSolid.svelte';
	import BackwardSolid from '$lib/svg/BackwardSolid.svelte';
	import SpeakerWaveSolid from '$lib/svg/SpeakerWaveSolid.svelte';
	import SpeakerMuteSolid from '$lib/svg/SpeakerMuteSolid.svelte';
	import PlaySolid from '$lib/svg/PlaySolid.svelte';
	import PauseSolid from '$lib/svg/PauseSolid.svelte';
	import CogSixToothSolid from '$lib/svg/CogSixToothSolid.svelte';
	import { onMount } from 'svelte';
	import { getVideoDuration } from '$lib/utils/date';
	export let data: PageData;
	const { film } = data;

	let currentDuration = '00:00';
	let totalDuration = '00:00';
	let isPlaying = false;
	let isFullScreen = false;
	let isMuted = false;
	let showControls = false;
	let controlTimer: NodeJS.Timeout;

	const togglePlay = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		video.paused ? video.play() : video.pause();
	};
	const handlePlay = () => {
		isPlaying = true;
	};
	const handlePause = () => {
		isPlaying = false;
	};
	const handleVolume = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		const volume = document.getElementById('volume') as HTMLInputElement;
		video.volume = +volume.value / 100;
	};
	const handleTimeInput = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		const time = document.getElementById('time') as HTMLInputElement;
		const { duration } = video;
		video.currentTime = (+time.value / 100) * duration;
	};
	const handleTimeUpdate = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		const { currentTime, duration } = video;
		({ currentDuration, totalDuration } = getVideoDuration(currentTime, duration));
		const time = document.getElementById('time') as HTMLInputElement;
		time.value = (currentTime / duration) * 100 + '';
	};
	const forward = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		video.currentTime += 5;
	};
	const backward = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		video.currentTime -= 5;
	};
	const toggleFullScreen = async () => {
		isFullScreen
			? await document.exitFullscreen()
			: await document.documentElement.requestFullscreen();
		isFullScreen = !isFullScreen;
	};
	const toggleMute = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		const volume = document.getElementById('volume') as HTMLInputElement;
		isMuted = !isMuted;
		isMuted ? (volume.value = '0') : (volume.value = '100');
		video.muted = isMuted;
	};
	const toggleControls = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		if (video.paused) return;
		controlTimer = setTimeout(() => {
			showControls = false;
		}, 1000);
	};
	const handleMouseMove = () => {
		showControls = true;
		clearTimeout(controlTimer);
		toggleControls();
	};
	onMount(() => {
		const video = document.getElementById('video') as HTMLVideoElement;
		const { currentTime, duration } = video;
		({ currentDuration, totalDuration } = getVideoDuration(currentTime, duration));
		handleTimeUpdate();
		handleVolume();
	});
</script>

<main class="w-screen h-screen overflow-hidden relative bg-black" on:mousemove={handleMouseMove}>
	<video
		class="w-full h-full absolute inset-0"
		id="video"
		on:play={handlePlay}
		on:pause={handlePause}
		on:timeupdate={handleTimeUpdate}
	>
		<source src="/api/film/{film.fileId}" type={film.mimetype} />
		<track kind="captions" />
	</video>
	<div class={showControls ? 'block' : 'hidden'}>
		<div class="absolute inset-0 w-full h-full bg-black bg-opacity-50" />
		<div class="absolute top-0 left-0 pl-10 pt-5 flex gap-2">
			<div class="h-12 w-[2px] bg-accent" />
			<div class="text-skin-muted-inverted">
				<h1>Rated U/A</h1>
				<h2>Genre: <span class="text-skin-muted-base">{film.genre}</span></h2>
			</div>
		</div>
		<div class="flex gap-2 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
			<button on:click={backward}>
				<BackwardSolid />
			</button>
			<button on:click={togglePlay}>
				{#if isPlaying}
					<PauseSolid />
				{:else}
					<PlaySolid />
				{/if}
			</button>
			<button on:click={forward}>
				<ForwardSolid />
			</button>
		</div>
		<div class="absolute bottom-0 w-full px-10 py-5 flex flex-col gap-2">
			<div class="flex flex-col gap-2">
				<h1 class="text-5xl font-bold">{film.title}</h1>
				<p class="w-[50%] text-skin-muted-inverted">{film.description}</p>
			</div>
			<div>
				<input
					type="range"
					class="w-full accent-accent h-[6px] cursor-pointer"
					id="time"
					on:input={handleTimeInput}
				/>
			</div>
			<div class="w-full flex justify-between items-center relative">
				<div class="flex items-center gap-1">
					<button on:click={toggleMute}>
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
						on:input={handleVolume}
					/>
					<span class="ml-2"> {currentDuration} / {totalDuration} </span>
				</div>
				<div class="flex gap-2">
					<button>
						<CogSixToothSolid />
					</button>
					<button on:click={toggleFullScreen}>
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
</main>
