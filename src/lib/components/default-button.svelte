<script lang="ts">
</script>

<button class="default-button" on:click>
	<slot />
</button>

<style>
	.default-button {
		height: 60px;
		padding: 0.5em 1em;
		font-size: 16pt;
		border-radius: 10px;
		box-shadow: 2px 2px 2px grey;
		border: 1px solid gray;
	}
	.default-button:active {
		box-shadow: 0px 0px 2px grey;
	}
</style>
