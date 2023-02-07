<script lang="ts">
	import { beforeNavigate } from '$app/navigation';

	// Navigation rules will go here
	beforeNavigate((navigation) => {
		console.log({ navigation });
	});
</script>

<svelte:head>
	<title>Qwixx Clone</title>
</svelte:head>

<h1 class="title">Qwixx Clone!</h1>
<slot />

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		background-color: lightgray;
	}
</style>
