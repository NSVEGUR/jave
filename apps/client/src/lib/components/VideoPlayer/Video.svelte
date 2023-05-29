<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	import video from './video';
	export const Video = writable(video);
</script>

<script lang="ts">
	import Player from './Player.svelte';
	export let details: App.Video;
	let currentDuration = '00:00';
	let totalDuration = '00:00';
	let isPlaying = false;
	let showControls = true;
	let controlTimer: NodeJS.Timeout;
	const toggleControls = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		if (video.paused) return;
		controlTimer = setTimeout(() => {
			showControls = false;
		}, 3000);
	};
	const handleMouseMove = () => {
		showControls = true;
		clearTimeout(controlTimer);
		toggleControls();
	};
</script>

<main class="w-screen h-screen overflow-hidden relative bg-black" on:mousemove={handleMouseMove}>
	<video
		class="w-full h-full absolute inset-0"
		id="video"
		bind:playbackRate={$Video.playbackRate}
		bind:currentTime={$Video.timestamp}
		on:play={() => {
			isPlaying = true;
		}}
		on:pause={() => {
			isPlaying = false;
		}}
		on:timeupdate={() => {
			({ currentDuration, totalDuration } = $Video.handleTimeUpdate());
		}}
		poster="/api/film/{details.thumbnailId}/thumbnail"
	>
		<source src="/api/film/{details.fileId}" type={details.mimetype} />
		<track kind="captions" />
	</video>
	{#if showControls}
		<Player {currentDuration} {totalDuration} {isPlaying} {showControls} {details} />
	{/if}
</main>
