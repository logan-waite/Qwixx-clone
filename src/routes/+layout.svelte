<svelte:head>
	<title>Qwixx Clone</title>
</svelte:head>

<h1 class="title">Qwixx Clone!</h1>
<slot />
<aside>Hello There</aside>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		background-color: lightgray;
	}
</style>
