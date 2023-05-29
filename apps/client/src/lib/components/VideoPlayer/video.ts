import { getVideoDuration } from '$lib/utils/date';

class Video {
	playbackRate: number;
	quality: number | 'Auto';
	timestamp: number;
	constructor() {
		this.playbackRate = 1.0;
		this.quality = 'Auto';
		this.timestamp = 0;
	}
	togglePlay = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		video.paused ? video.play() : video.pause();
	};
	handleVolume = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		const volume = document.getElementById('volume') as HTMLInputElement;
		if (!volume) return;
		video.volume = +volume.value / 100;
	};
	toggleMute = (isMuted: boolean) => {
		const video = document.getElementById('video') as HTMLVideoElement;
		const volume = document.getElementById('volume') as HTMLInputElement;
		if (!volume) return isMuted;
		isMuted = !isMuted;
		isMuted ? (volume.value = '0') : (volume.value = '100');
		video.muted = isMuted;
		return isMuted;
	};
	handleTimeInput = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		const time = document.getElementById('time') as HTMLInputElement;
		if (!time) return;
		const { duration } = video;
		video.currentTime = (+time.value / 100) * duration;
	};
	forward = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		video.currentTime += 5;
	};
	backward = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		video.currentTime -= 5;
	};
	handleTimeUpdate = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		const { currentTime, duration } = video;
		const time = document.getElementById('time') as HTMLInputElement;
		if (!time)
			return {
				currentDuration: '00:00',
				totalDuration: '00:00'
			};
		time.value = (currentTime / duration) * 100 + '';
		return getVideoDuration(currentTime, duration);
	};
	toggleFullScreen = async (isFullScreen: boolean) => {
		isFullScreen
			? await document.exitFullscreen()
			: await document.documentElement.requestFullscreen();
		return !isFullScreen;
	};
	getDuration = () => {
		const video = document.getElementById('video') as HTMLVideoElement;
		const { currentTime, duration } = video;
		return getVideoDuration(currentTime, duration);
	};
}

export default new Video();
