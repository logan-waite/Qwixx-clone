<script lang="ts">
	export let to: string = '/';
</script>

<a class="link-button" href={to}>
	<slot />
</a>

<style>
	.link-button {
		padding: 0.5em 1em;
		font-size: 16pt;
		border-radius: 10px;
		box-shadow: 2px 2px 2px grey;
		border: 1px solid gray;
		background-color: whitesmoke;
		text-decoration: none;
	}
	.link-button:active {
		box-shadow: 0px 0px 2px grey;
	}
</style>
