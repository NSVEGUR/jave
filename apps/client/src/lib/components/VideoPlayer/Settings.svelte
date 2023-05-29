<script lang="ts">
	import { elasticScale } from '$lib/transitions/scale';
	import PlayCircle from '$lib/svg/PlayCircle.svelte';
	import AdjustmentsHorizontal from '$lib/svg/AdjustmentsHorizontal.svelte';
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
	import ChevronLeft from '$lib/svg/ChevronLeft.svelte';
	import Check from '$lib/svg/Check.svelte';
	import { Video } from './Video.svelte';
	let hyperlinks = [
		{
			name: 'Playback Speed',
			icon: PlayCircle,
			active: false
		},
		{
			name: 'Quality',
			icon: AdjustmentsHorizontal,
			active: false
		}
	];
	let playbackSpeeds: {
		name: 'Normal' | number;
		active: boolean;
	}[] = [
		{
			name: 0.25,
			active: $Video.playbackRate === 0.25
		},
		{
			name: 0.5,
			active: $Video.playbackRate === 0.5
		},
		{
			name: 0.75,
			active: $Video.playbackRate === 0.75
		},
		{
			name: 'Normal',
			active: $Video.playbackRate === 1.0
		},
		{
			name: 1.25,
			active: $Video.playbackRate === 1.25
		},
		{
			name: 1.5,
			active: $Video.playbackRate === 1.5
		},
		{
			name: 1.75,
			active: $Video.playbackRate === 1.75
		},
		{
			name: 2,
			active: $Video.playbackRate === 2.0
		}
	];
	let videoQuality: {
		name: 'Auto' | number;
		active: boolean;
	}[] = [
		{
			name: 2040,
			active: $Video.quality === 2040
		},
		{
			name: 1080,
			active: $Video.quality === 1080
		},
		{
			name: 720,
			active: $Video.quality === 720
		},
		{
			name: 480,
			active: $Video.quality === 480
		},
		{
			name: 360,
			active: $Video.quality === 360
		},
		{
			name: 240,
			active: $Video.quality === 240
		},
		{
			name: 144,
			active: $Video.quality === 144
		},
		{
			name: 'Auto',
			active: $Video.quality === 'Auto'
		}
	];
	let active = false;
	const toggleHyperlink = (index: number, activate: boolean) => {
		hyperlinks[index].active = activate;
		hyperlinks = [...hyperlinks];
		active = activate;
	};
	const setPlaybackSpeed = (index: number) => {
		playbackSpeeds.forEach((speed, i) => {
			speed.active = false;
		});
		playbackSpeeds[index].active = true;
		if (playbackSpeeds[index].name === 'Normal') {
			$Video.playbackRate = 1.0;
		} else {
			$Video.playbackRate = playbackSpeeds[index].name as number;
		}
	};
	const setVideoQuality = (index: number) => {
		videoQuality.forEach((quality, i) => {
			quality.active = false;
		});
		videoQuality[index].active = true;
		if (videoQuality[index].name === 'Auto') {
			$Video.quality = 'Auto';
		} else {
			$Video.quality = videoQuality[index].name as number;
		}
	};
</script>

<div
	class="absolute bottom-20 min-w-[250px] right-0 bg-black bg-opacity-50 backdrop-blur-lg rounded-md flex flex-col p-2 gap-2"
	in:elasticScale
	id="settings-menu"
>
	{#if !active}
		{#each hyperlinks as { name, icon }, i}
			<button
				class="flex gap-2 justify-between items-center p-1"
				on:click={() => {
					toggleHyperlink(i, true);
				}}
			>
				<div class="flex gap-2">
					<svelte:component this={icon} />
					<h1 class="text-skin-muted-base">{name}</h1>
				</div>
				<ChevronRight width="16px" height="16px" />
			</button>
		{/each}
	{/if}
	{#if hyperlinks[0].active}
		<div class="flex flex-col gap-2">
			<button
				class="flex gap-2 items-center"
				on:click={() => {
					toggleHyperlink(0, false);
				}}
			>
				<ChevronLeft width="16px" height="16px" />
				<span>{hyperlinks[0].name}</span>
			</button>
			{#each playbackSpeeds as { name, active }, i}
				<button
					class="flex items-center p-1 gap-2"
					on:click={() => {
						setPlaybackSpeed(i);
					}}
				>
					{#if active}
						<Check />
					{/if}
					<div class="flex gap-2 {!active && 'ml-7'}">
						<h1 class="text-skin-muted-base">
							{name === 'Normal' ? name : name + 'x'}
						</h1>
					</div>
				</button>
			{/each}
		</div>
	{/if}
	{#if hyperlinks[1].active}
		<div class="flex flex-col gap-2">
			<button
				class="flex gap-2 items-center"
				on:click={() => {
					toggleHyperlink(1, false);
				}}
			>
				<ChevronLeft width="16px" height="16px" />
				<span>{hyperlinks[1].name}</span>
			</button>
			{#each videoQuality as { name, active }, i}
				<button
					class="flex items-center p-1 gap-2"
					on:click={() => {
						setVideoQuality(i);
					}}
				>
					{#if active}
						<Check />
					{/if}
					<div class="flex gap-2 {!active && 'ml-7'}">
						<h1 class="text-skin-muted-base">{name == 'Auto' ? name : name + 'p'}</h1>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
