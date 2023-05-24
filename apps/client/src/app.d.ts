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
			title: string;
			genre: string;
			description: string;
			fileId: string;
			thumbnailId: string;
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
