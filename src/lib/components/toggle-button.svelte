<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ toggle: boolean }>();
	let state = false;

	function handleClick() {
		state = !state;
		dispatch('toggle', state);
	}

	export function toggle(newState: boolean) {
		state = newState;
	}
</script>

<button type="button" class="toggle-button" class:toggle-button--on={state} on:click={handleClick}>
	<slot />
</button>

<style>
	.toggle-button {
		height: 60px;
		padding: 0.5em 1em;
		font-size: 16pt;
		border-radius: 10px;
		box-shadow: 2px 2px 2px grey;
		border: 1px solid gray;
	}
	.toggle-button--on {
		box-shadow: 0px 0px 2px grey;
	}
</style>
