<script lang="ts">
	import type { Color, DieValue } from '$lib/types';
	import { createArray } from '$lib/utils';

	export let color: Color | 'white' = 'white';
	export let pipColor: 'white' | 'black' = 'black';
	export let value: DieValue = 1;
	export let locked = false;

	$: pips = createArray(value);
</script>

<div class="die" style:background-color={color}>
	{#each pips as pip}
		<div class="die__pip" style:background-color={pipColor} />
	{/each}
</div>

<style>
	.die {
		box-sizing: border-box;
		display: grid;
		grid-template-areas:
			'a . c'
			'e g f'
			'd . b';
		grid-template-rows: repeat(3, 1fr);
		grid-template-columns: repeat(3, 1fr);
		padding: 7px;
		width: 60px;
		height: 60px;
		border-radius: 7px;
		margin: 10px;
	}

	.die__pip {
		display: block;
		align-self: center;
		justify-self: center;
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.die__pip:nth-child(2) {
		grid-area: b;
	}
	.die__pip:nth-child(3) {
		grid-area: c;
	}
	.die__pip:nth-child(4) {
		grid-area: d;
	}
	.die__pip:nth-child(5) {
		grid-area: e;
	}
	.die__pip:nth-child(6) {
		grid-area: f;
	}
	.die__pip:nth-child(odd):last-child {
		grid-area: g;
	}
</style>
