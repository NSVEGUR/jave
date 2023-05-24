<script lang="ts">
	import VideoCamera from '$lib/svg/VideoCamera.svelte';
	import Image from '$lib/svg/Image.svelte';
	import X from '$lib/svg/X.svelte';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { snackbar } from '$lib/stores/snackbar';
	interface CharacterProps {
		id: number;
		name: string;
		description: string;
		timestamps: {
			start: string;
			end: string;
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
	let characters: CharacterProps[] = [];
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
		setTimeout(() => {
			const select = document.getElementById('character-select') as HTMLSelectElement;
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
			if (type) {
				if (!video || !video[0] || video[0].size == 0) {
					snackbar.error(`A character must contain a video`);
					return cancel();
				}
				data.append('character', video[0]);
			}
			if (!image || !image[0] || image[0].size == 0) {
				snackbar.error('A character must contain an image');
				return cancel();
			}
			if (type) {
				const parsedTimeStamps: {
					start: number;
					end: number;
				}[] = [];
				for (const { start, end } of timestamps) {
					if (start.length <= 0 || end.length <= 0) {
						snackbar.error('Please fill the previous timestamp before adding new one');
						return cancel();
					}
					const parsedStart = parseInt(start, 10);
					const parsedEnd = parseInt(end, 10);
					if (parsedStart != 0 && !parsedStart) {
						return snackbar.error('start timestamp must be parsable to int');
					}
					if (parsedEnd != 0 && !parsedEnd) {
						return snackbar.error('end timestamp must be parsable to int');
					}
					parsedTimeStamps.push({ start: parsedStart, end: parsedEnd });
				}
				const charactersBody = {
					name,
					description,
					timestamps: parsedTimeStamps
				};
				charactersObj.push(charactersBody);
			} else {
				charactersObj.push({ name, description });
			}
			data.append('image', image[0]);
		}
		data.append('characterBody', JSON.stringify(charactersObj));
		if (type) {
			data.append('type', 'JAVE');
		} else {
			data.append('type', 'NORMAL');
		}
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
	let type: boolean = false;
</script>

<form
	action="?/upload"
	use:enhance={handleForm}
	method="POST"
	class="w-screen h-[calc(100vh-theme(spacing.16))] flex flex-col items-center justify-center gap-10"
>
	<div class="w-full flex items-center justify-center">
		<div class="flex flex-col gap-2 w-full px-10 max-w-[500px]">
			<h1 class="text-2xl font-medium text-accent text-center mb-5">Film</h1>
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
						<VideoCamera />
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
						<Image />
						<span class="text-skin-muted-inverted ">Add Thumbnail</span>
					</label>
					{#if film.thumbnail && film.thumbnail[0]}
						<p>{film.thumbnail[0].name}</p>
					{/if}
				</div>
			</div>
			<div>
				<input type="checkbox" class=" accent-accent" bind:checked={type} />
				<label for="type">Jave Film</label>
			</div>
			<select
				on:change={selectCharacter}
				class="p-1 bg-muted rounded-md grid text-skin-base my-2 {characters.length <= 0 &&
					'hidden'}"
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
				class="bg-muted text-accent rounded-md p-2 w-full mt-3"
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
								const removed = characters.filter(({ id }) => character.id != id);
								characters = [...removed];
								selected =
									removed.length > 0 ? removed[removed.length - 1].id : undefined;
							}}
							class="bg-error text-skin-base p-1 w-7 h-7 grid place-items-center rounded-full"
						>
							<X />
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
						{#if type}
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
									<VideoCamera />
									<span class=" text-skin-muted-inverted">Upload Video</span>
								</label>
								{#if character.video && character.video[0]}
									<p>{character.video[0].name}</p>
								{/if}
							</div>
						{/if}
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
								<Image />
								<span class="text-skin-muted-inverted ">Add Image</span>
							</label>
							{#if character.image && character.image[0]}
								<p>{character.image[0].name}</p>
							{/if}
						</div>
					</div>
					{#if type}
						{#each timestamps as timestamp}
							<div class="flex gap-2 w-full">
								<input
									type="number"
									name="from"
									class="p-2 rounded-md bg-muted w-full outline-none"
									placeholder="start"
									min="0"
									bind:value={timestamp.start}
								/>
								<input
									type="number"
									name="to"
									min="0"
									class="p-2 rounded-md bg-muted w-full outline-none"
									placeholder="end"
									bind:value={timestamp.end}
								/>
							</div>
						{/each}
						<button
							class=" bg-muted text-accent rounded-md p-2 w-full mt-3"
							on:click|preventDefault={() => {
								for (const { start, end } of timestamps) {
									if (start.length <= 0 || end.length <= 0) {
										return snackbar.error(
											'Please fill the previous timestamp before adding new one'
										);
									}
									const parsedStart = parseInt(start, 10);
									const parsedEnd = parseInt(end, 10);
									if (parsedStart != 0 && !parsedStart) {
										return snackbar.error(
											'start timestamp must be parsable to int'
										);
									}
									if (parsedEnd != 0 && !parsedEnd) {
										return snackbar.error(
											'end timestamp must be parsable to int'
										);
									}
								}
								timestamps.push({
									start: '',
									end: ''
								});
								timestamps = [...timestamps];
							}}
						>
							Add Timestamp
						</button>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
	<button
		type="submit"
		class="font-bold text-skin-inverted bg-accent p-2 px-3 rounded-md min-w-[420px]"
	>
		Upload
	</button>
</form>
