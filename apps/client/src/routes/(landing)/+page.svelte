<script lang="ts">
	import WatchCarousel from '$lib/components/WatchCarousel.svelte';
	import Mockup from '$lib/images/mockup.png';
	import VRExperience from '$lib/images/vr-experience.png';
	import Children from '$lib/images/children.png';
	import Logo from '$lib/images/logo.png';
	import Plus from '$lib/svg/Plus.svelte';
	import X from '$lib/svg/X.svelte';
	const faqs = [
		{
			question: 'What is Jave?',
			answer: 'Amet id qui sit elit duis sunt do excepteur magna ea pariatur mollit ullamco.'
		},
		{
			question: 'How much we cost?',
			answer: 'Consequat pariatur irure id do esse et eu minim ullamco.'
		},
		{
			question: 'Where can I watch?',
			answer: 'Aute anim reprehenderit excepteur nisi nisi pariatur consectetur.'
		},
		{
			question: 'What is unique in Jave?',
			answer: 'Voluptate Lorem ipsum quis quis adipisicing tempor in qui veniam do culpa ad ut.'
		}
	];
	let faqTogglers = faqs.map(() => false);
	const hyperlinks = [
		{
			name: 'Watch Now',
			link: '/user'
		},
		{
			name: 'Store',
			link: '/user/store'
		},
		{
			name: 'Library',
			link: '/user/library'
		},
		{
			name: 'Account',
			link: '/user/account'
		},
		{
			name: 'Contact Us',
			link: '/contact-us'
		}
	];
</script>

<div class="h-screen overflow-scroll">
	<WatchCarousel />
	<div class="p-10 flex flex-col gap-32">
		<section class="flex w-full justify-evenly items-center">
			<div class=" h-72">
				<img src={VRExperience} alt="vr-experience" class="w-full h-full object-cover" />
			</div>
			<div class="flex flex-col gap-3 max-w-[40%]">
				<h1 class="text-3xl font-bold">
					Experience movies like <span class="text-4xl text-accent">NEVER BEFORE</span>.
				</h1>
				<p class="text-xl">
					Watch the movies in the characters point of view, stream it with virtual reality
					to dive in.
				</p>
			</div>
		</section>
		<section class="flex w-full justify-evenly items-center">
			<div class="flex flex-col gap-2 max-w-[40%]">
				<h1 class="text-3xl font-bold">Watch Anywhere.</h1>
				<p class="text-xl">
					Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
				</p>
			</div>
			<div class="h-60">
				<img src={Mockup} alt="mockup-movies" class="w-full h-full object-cover" />
			</div>
		</section>
		<section class="flex w-full justify-evenly items-center">
			<div class=" h-52 rounded-xl">
				<img
					src={Children}
					alt="vr-experience"
					class="w-full h-full object-cover rounded-xl"
				/>
			</div>
			<div class="flex flex-col gap-3 max-w-[40%]">
				<h1 class="text-3xl font-bold">Create profile for kids</h1>
				<p class="text-xl">
					Send children on adventures with their favorite characters in a space made just
					for them—free with your membership.
				</p>
			</div>
		</section>
		<section class="p-20">
			<h1 class="text-center text-5xl font-bold">Frequently Asked Questions</h1>
			<div class="flex flex-col gap-2 my-10">
				{#each faqs as faq, i}
					<button
						on:click={() => {
							faqTogglers[i] = !faqTogglers[i];
							faqTogglers = [...faqTogglers];
						}}
						class="w-full rounded-md bg-muted p-2"
					>
						<h1 class="flex justify-between text-xl font-medium">
							{i + 1}. {faq.question}{' '}
							<span>
								{#if faqTogglers[i]}
									<X size="24px" />
								{:else}
									<Plus />
								{/if}
							</span>
						</h1>
						<div
							class="grid pl-5 {faqTogglers[i]
								? 'grid-rows-[1fr] py-5'
								: 'grid-rows-[0fr]'} transition-all duration-200"
						>
							<h1 class="overflow-hidden text-left text-skin-complementary">
								{faq.answer}
							</h1>
						</div>
					</button>
				{/each}
			</div>
			<div class="flex flex-col items-center gap-3">
				<h1 class="font-medium text-lg">Ready to Dive into JAVE?</h1>
				<div class="flex gap-2">
					<a
						href="/user/signup"
						class="border-[1px] border-accent p-2 bg-transparent text-accent rounded-md"
					>
						Signup
					</a>
					<a
						href="/user/login"
						class="border-[1px] border-accent p-2 bg-accent text-skin-inverted rounded-md"
					>
						Signin
					</a>
				</div>
			</div>
		</section>
	</div>
	<footer class="w-full text-skin-muted mb-10">
		<div
			class="grid grid-cols-3 p-4 justify-items-center -md:grid-cols-2 -sm:grid-cols-1 -md:gap-10 -sm:justify-items-start"
		>
			<div class="flex flex-col gap-5">
				<div class="flex items-end">
					<img class="h-12" src={Logo} alt="logo" />
					<h1 class="text-xl font-bold text-accent">ave</h1>
				</div>
				<p class="w-60">
					Jave is an OTT Platform, with which provides users to experience movies in never
					before way.
				</p>
			</div>
			<div>
				<h1 class="font-secondary font-bold text-xl text-skin-base">Quick Links</h1>
				<ul class="mt-5 flex flex-col gap-1">
					{#each hyperlinks as hyperlink}
						<li class="hover:text-accent hover:scale-105 transition-all duration-200">
							<a href={hyperlink.link}>{hyperlink.name}</a>
						</li>
					{/each}
				</ul>
			</div>
			<div class="-md:col-span-2 -sm:col-span-1">
				<h1 class="font-secondary font-bold text-xl text-skin-base">Contact Us</h1>
				<p class="w-60 mt-5">support@jave.in</p>
				<p>Chennai, TamilNadu, India.</p>
			</div>
		</div>
		<div class="w-full flex flex-col justify-center items-center py-5 gap-3">
			<h4 class="-sm:text-sm">© 2023 Jave | Powered by Dhisai</h4>
			<ul class="flex gap-5 -sm:text-sm" />
		</div>
	</footer>
	<footer />
</div>
