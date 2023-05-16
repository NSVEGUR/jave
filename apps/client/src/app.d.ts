// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace svelte.JSX {
		interface SvelteInputProps {
			webkitdirectory?: boolean;
		}
	}
	namespace App {
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
