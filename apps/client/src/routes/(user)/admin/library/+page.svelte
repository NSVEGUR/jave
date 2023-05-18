<script lang="ts">
	import VideoCameraSvg from '$lib/components/SVG/VideoCameraSVG.svelte';
	import ImageSvg from '$lib/components/SVG/ImageSVG.svelte';
	import XSvg from '$lib/components/SVG/XSVG.svelte';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { snackbar } from '$lib/stores/snackbar';
	interface CharacterProps {
		id: number;
		name: string;
		description: string;
		timestamps: {
			from: string;
			to: string;
		}[];
		video?: FileList;
		image?: FileList;
	}
	interface FilmProps {
		title: string;
		genre: string;
		description: string;
		video?: FileList;
		thumbnail?: FileList;
	}
	let characters: CharacterProps[] = [
		{
			id: 1,
			name: '',
			description: '',
			timestamps: [],
			video: undefined,
			image: undefined
		}
	];
	function selectCharacter(e: Event) {
		let id = parseInt((e.target as HTMLSelectElement).value);
		id = id ? id : 1;
		selected = id;
	}
	function addCharacter(e: Event) {
		let id = 1;
		for (let i = 1; i <= 1024; i++) {
			if (!characters.map(({ id }) => id).includes(i)) {
				id = i;
				break;
			}
		}
		characters.push({
			id,
			name: '',
			description: '',
			timestamps: [],
			video: undefined,
			image: undefined
		});
		const select = document.getElementById('character-select') as HTMLSelectElement;
		setTimeout(() => {
			select.value = id.toString();
			selected = id;
		}, 5);
		characters = [...characters];
	}
	const handleForm = (({ data, cancel }) => {
		const { video, thumbnail, ...filmBody } = film;
		data.append('filmBody', JSON.stringify(filmBody));
		if (!video || !video[0] || video[0].size == 0) {
			snackbar.error('A film must contain a video');
			return cancel();
		}
		if (!thumbnail || !thumbnail[0] || thumbnail[0].size == 0) {
			snackbar.error('A film must contain a thumbnail');
			return cancel();
		}
		const charactersObj = [];
		for (const character of characters) {
			const { video, image, name, description, timestamps } = character;
			const id = character.name.length > 0 ? character.name : `Character-${character.id}`;
			if (name.length < 3) {
				snackbar.error(`${id}'s name must contain at least 2 characters`);
				return cancel();
			}
			if (description.length < 5) {
				snackbar.error(`${id}'s description must contain at least 5 characters`);
				return cancel();
			}
			if (timestamps.length < 1) {
				snackbar.error(`${id}'s must contain at least one timestamp`);
				return cancel();
			}
			if (!video || !video[0] || video[0].size == 0) {
				snackbar.error(`A character must contain a video`);
				return cancel();
			}
			if (!image || !image[0] || image[0].size == 0) {
				snackbar.error('A character must contain an image');
				return cancel();
			}
			const parsedTimeStamps: {
				from: number;
				to: number;
			}[] = [];
			for (const { from, to } of timestamps) {
				const f = parseInt(from, 10);
				const t = parseInt(to, 10);
				if (!f || !t) {
					snackbar.error('from and to timestamps must be parsable to int');
					return cancel();
				}
				parsedTimeStamps.push({ from: f, to: t });
			}
			const charactersBody = {
				name,
				description,
				timestamps: parsedTimeStamps
			};
			charactersObj.push(charactersBody);
			data.append('character', video[0]);
			data.append('image', image[0]);
		}
		data.append('characterBody', JSON.stringify(charactersObj));
		return async function ({ result }) {
			if (result.type === 'success') {
				characters = [
					{
						id: 1,
						name: '',
						description: '',
						timestamps: [],
						video: undefined,
						image: undefined
					}
				];
				selected = undefined;
				film = {
					title: '',
					genre: '',
					description: ''
				};
				return snackbar.success('Film uploaded successfully');
			}
			if (result.type === 'error') {
				return snackbar.error('There is some server error, try again later');
			}
		};
	}) satisfies SubmitFunction;
	let selected: number | undefined;
	let film: FilmProps = {
		title: '',
		genre: '',
		description: ''
	};
	$: timestamps = selected ? characters.filter(({ id }) => id === selected)[0].timestamps : [];
</script>

<form
	action="?/upload"
	use:enhance={handleForm}
	method="POST"
	class="w-screen h-[calc(100vh-theme(spacing.16))] flex flex-col items-center justify-center gap-10"
>
	<div class="w-full flex items-center justify-center">
		<div class="flex flex-col gap-2 w-full px-10 max-w-[500px]">
			<h1 class="text-2xl font-medium text-accent text-center mb-5">Main Film</h1>
			<div class="flex gap-2">
				<div class="flex flex-col gap-2 w-full">
					<label for="title">Title</label>
					<input
						type="text"
						name="title"
						id="title"
						bind:value={film.title}
						required
						class="p-2 rounded-md bg-muted w-full outline-none"
					/>
				</div>
				<div class="flex flex-col gap-2 w-full">
					<label for="genre">Genre</label>
					<input
						type="text"
						name="genre"
						id="genre"
						bind:value={film.genre}
						required
						class="p-2 rounded-md bg-muted w-full outline-none"
					/>
				</div>
			</div>
			<div class="flex flex-col gap-2 w-full">
				<label for="description">Description</label>
				<textarea
					name="description"
					id="description"
					bind:value={film.description}
					rows="5"
					class="p-2 rounded-md bg-muted w-full outline-none"
				/>
			</div>
			<div class="flex gap-2 mt-3">
				<div class="flex flex-col w-full items-center">
					<label for="film" class="cursor-pointer flex flex-col items-center text-accent">
						<input
							type="file"
							accept="video/mp4,video/x-m4v,video/*"
							name="film"
							id="film"
							bind:files={film.video}
							hidden
						/>
						<VideoCameraSvg />
						<span class=" text-skin-muted-inverted">Upload Film</span>
					</label>
					{#if film.video && film.video[0]}
						<p>{film.video[0].name}</p>
					{/if}
				</div>
				<div class="flex flex-col w-full items-center">
					<label
						for="thumbnail"
						class="cursor-pointer flex flex-col items-center text-accent"
					>
						<input
							type="file"
							accept=".png,.jpeg,.jpg,.svg"
							name="thumbnail"
							id="thumbnail"
							bind:files={film.thumbnail}
							hidden
						/>
						<ImageSvg />
						<span class="text-skin-muted-inverted ">Add Thumbnail</span>
					</label>
					{#if film.thumbnail && film.thumbnail[0]}
						<p>{film.thumbnail[0].name}</p>
					{/if}
				</div>
			</div>
			<select
				on:change={selectCharacter}
				class="p-1 bg-muted rounded-md text-skin-base my-2"
				id="character-select"
			>
				<option selected>Choose a character to edit</option>
				{#each characters as character (character.id)}
					{@const name =
						character.name.length > 0 ? character.name : `Character-${character.id}`}
					<option value={character.id}>{name}</option>
				{/each}
			</select>
			<button
				class="bg-accent text-skin-inverted rounded-md p-2 w-full mt-3"
				on:click|preventDefault={addCharacter}
			>
				Add Character
			</button>
		</div>
		{#each characters as character (character.id)}
			{#if character.id === selected}
				{@const name =
					character.name.length > 0 ? character.name : `Character-${character.id}`}
				<div class="flex flex-col gap-2 my-10 w-full max-w-[500px] px-10">
					<div class="flex justify-between">
						<h1 class="text-xl font-medium">{name}</h1>
						<button
							on:click|preventDefault={() => {
								if (character.id != 1) {
									characters = [
										...characters.filter(({ id }) => character.id != id)
									];
									selected = undefined;
								}
							}}
							class="bg-error text-skin-base p-1 w-7 h-7 grid place-items-center rounded-full"
						>
							<XSvg />
						</button>
					</div>
					<div class="flex flex-col gap-2 w-full">
						<label for="characterName">Name</label>
						<input
							type="text"
							name="characterName"
							bind:value={character.name}
							required
							class="p-2 rounded-md bg-muted w-full outline-none"
						/>
					</div>
					<div class="flex flex-col gap-2 w-full">
						<label for="characterDescription">Description</label>
						<textarea
							name="characterDescription"
							bind:value={character.description}
							rows="2"
							class="p-2 rounded-md bg-muted w-full outline-none"
						/>
					</div>
					<div class="flex gap-2 mt-3">
						<div class="flex flex-col w-full items-center">
							<label
								for="video{character.id}"
								class="cursor-pointer flex flex-col items-center text-accent"
							>
								<input
									type="file"
									accept="video/mp4,video/x-m4v,video/*"
									name="video{character.id}"
									id="video{character.id}"
									bind:files={character.video}
									hidden
								/>
								<VideoCameraSvg />
								<span class=" text-skin-muted-inverted">Upload Film</span>
							</label>
							{#if character.video && character.video[0]}
								<p>{character.video[0].name}</p>
							{/if}
						</div>
						<div class="flex flex-col w-full items-center">
							<label
								for="image{character.id}"
								class="cursor-pointer flex flex-col items-center text-accent"
							>
								<input
									type="file"
									accept=".png,.jpeg,.jpg,.svg"
									name="image{character.id}"
									id="image{character.id}"
									bind:files={character.image}
									hidden
								/>
								<ImageSvg />
								<span class="text-skin-muted-inverted ">Add Image</span>
							</label>
							{#if character.image && character.image[0]}
								<p>{character.image[0].name}</p>
							{/if}
						</div>
					</div>
					{#each timestamps as timestamp}
						<div class="flex gap-2 w-full">
							<input
								type="number"
								name="from"
								class="p-2 rounded-md bg-muted w-full outline-none"
								placeholder="from"
								bind:value={timestamp.from}
							/>
							<input
								type="number"
								name="to"
								class="p-2 rounded-md bg-muted w-full outline-none"
								placeholder="to"
								bind:value={timestamp.to}
							/>
						</div>
					{/each}
					<button
						class=" bg-muted text-accent rounded-md p-2 w-full mt-3"
						on:click|preventDefault={() => {
							for (const { from, to } of timestamps) {
								if (from.length < 0 || to.length < 0) {
									return snackbar.error(
										'Please fill the previous timestamp before adding new one'
									);
								}
								const f = parseInt(from, 10);
								const t = parseInt(to, 10);
								if (!f || !t) {
									return snackbar.error(
										'from and to timestamps must be parsable to int'
									);
								}
							}
							timestamps.push({
								from: '',
								to: ''
							});
							timestamps = [...timestamps];
						}}
					>
						Add Timestamp
					</button>
				</div>
			{/if}
		{/each}
	</div>
	<button
		type="submit"
		class="border-[1px] border-accent font-bold text-accent hover:bg-accent hover:text-skin-inverted p-1 px-3 rounded-2xl transition-all duration-200"
	>
		Upload
	</button>
</form>
