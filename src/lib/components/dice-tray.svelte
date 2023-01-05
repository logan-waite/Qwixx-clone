<script lang="ts">
	import Die from '$lib/components/die.svelte';
	import { dice } from '$lib/stores/dice';
</script>

<div class="dice-tray">
	{#each $dice as { value, color, pipColor, locked }}
		<Die {value} {color} {pipColor} {locked} />
	{/each}
</div>

<style>
	.dice-tray {
		box-sizing: border-box;
		border: 1px solid gray;
		width: 512px;
		max-width: 100%;
		height: fit-content;
		min-height: 192px;
		border-radius: 25px;
		box-shadow: 5px 5px 8px gray inset;
		background-color: darkgray;
		padding: 15px;
		display: flex;
		flex-wrap: wrap;
	}
</style>
