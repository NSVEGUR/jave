<script lang="ts">
	import { onMount } from 'svelte';
	import Slide_1 from '$lib/images/watch-carousel/1.jpg';
	import Slide_2 from '$lib/images/watch-carousel/2.jpg';
	import Slide_3 from '$lib/images/watch-carousel/3.jpg';
	import ChevronLeft from '$lib/svg/ChevronLeft.svelte';
	import ChevronRight from '$lib/svg/ChevronRight.svelte';
	const slides = [
		{
			img: Slide_1,
			title: 'Virumandi',
			genre: 'Drama',
			description:
				'A reporter researching the death penalty meets Virumandi and Kothala. While listening to their versions of the same story, she realises that Virumandi is being punished for a crime he did not commit.'
		},
		{
			img: Slide_2,
			title: 'Ponniyin Selvan',
			genre: 'Mythological',
			description: `Arulmozhi Varman continues on his quest to become Rajaraja I, the greatest ruler of south India's historic Chola empire.`
		},
		{
			img: Slide_3,
			title: 'Vishwaroopam',
			genre: 'Action',
			description:
				'Vishwaroopam (titled Vishwaroop in Hindi; transl. The magnificent incarnation) is a 2013 Indian action spy film written, directed and produced by Kamal Haasan, who also enacts the lead role. The film has Rahul Bose, Shekhar Kapur, Pooja Kumar, Andrea Jeremiah and Jaideep Ahlawat in supporting roles'
		}
	];
	let curSlideCount = 0;
	const translate = function (slides: NodeListOf<Element>) {
		slides.forEach((slide: any, index) => {
			slide.style.transform = `translateX(${110 * (index - curSlideCount)}%)`;
		});
	};
	const nextSlide = function () {
		const slides = document.querySelectorAll('.watch-slide');
		const maxSlide = slides.length - 1;
		if (curSlideCount == maxSlide) {
			curSlideCount = 0;
		} else {
			curSlideCount++;
		}
		translate(slides);
	};
	const prevSlide = function () {
		const slides = document.querySelectorAll('.watch-slide');
		const maxSlide = slides.length - 1;
		if (curSlideCount == 0) {
			curSlideCount = maxSlide;
		} else {
			curSlideCount--;
		}
		translate(slides);
	};
	onMount(() => {
		const slides = document.querySelectorAll('.watch-slide');
		translate(slides);
	});
</script>

<div
	class="w-screen relative h-[calc(100vh-theme(spacing.16))] overflow-hidden flex justify-center items-center"
>
	{#each slides as slide}
		<div
			class="watch-slide w-full absolute h-full shadow-sm transition-all duration-500 rounded-xl flex flex-col hover:shadow-xl cursor-pointer"
		>
			<img class="object-cover rounded-t-xl h-full" src={slide.img} alt={slide.title} />
			<div class="absolute inset-0 w-full h-full bg-black bg-opacity-30" />
			<div class="absolute bottom-5 left-10 max-w-[50%] flex flex-col gap-2">
				<h1 class="text-5xl font-semibold">{slide.title}</h1>
				<h2 class="text-skin-muted-inverted">{slide.genre}</h2>
				<h2>{slide.description}</h2>
			</div>
		</div>
	{/each}
	<div class="absolute flex w-full justify-between gap-4">
		<button on:click={prevSlide}>
			<ChevronLeft width="40px" height="40px" />
		</button>
		<button on:click={nextSlide}>
			<ChevronRight width="40px" height="40px" />
		</button>
	</div>
</div>
