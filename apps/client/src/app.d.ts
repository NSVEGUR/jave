// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace svelte.JSX {
		interface SvelteInputProps {
			webkitdirectory?: boolean;
		}
	}
	namespace App {
		interface Film {
			id: string;
			type: string;
			title: string;
			genre: string;
			description: string;
			fileId: string;
			thumbnailId: string;
			size: number;
			mimetype: string;
			createdAt: string;
			characters: Character[];
			type: 'JAVE' | 'NORMAL';
		}
		interface Character {
			id: string;
			type: string;
			genre: string;
			name: string;
			description: string;
			filmId: string;
			fileId: string;
			imageId: string;
			size: number;
			mimetype: string;
			createdAt: string;
			timestamps: Timestamp[];
		}
		interface Video {
			id: string;
			filmId: string;
			type: string;
			title: string;
			genre: string;
			description: string;
			fileId: string;
			thumbnailId: string;
			size: number;
			mimetype: string;
			createdAt: string;
			characters?: Character[];
			timestamps?: Timestamp[];
		}
		interface Timestamp {
			start: number;
			end: number;
		}
		interface Locals {
			user: {
				email: string;
				name: string;
				role: string;
			};
		}
	}
}

export {};
