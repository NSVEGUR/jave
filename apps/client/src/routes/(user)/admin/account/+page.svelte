<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-xl font-medium">Role: {data.user.role}</h1>
<h1 class="text-xl font-medium">Email: {data.user.email}</h1>
<form action="/logout" method="POST">
	<button class="bg-accent p-2 rounded-lg text-skin-inverted">Logout</button>
</form>
