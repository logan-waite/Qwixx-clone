<script lang="ts">
	import type { Colors } from '$lib/types';
	import Icon from '$lib/components/icon/icon.svelte';

	export let ascOrder: boolean = true;
	export let color: Colors = 'red';

	const boxes = Array(11)
		.fill(0)
		.map((_, i) => (ascOrder ? i + 2 : 12 - i));
</script>

<div class={`score-row ${color}`}>
	<!-- class={`score-row ${color}`} -->
	{#each boxes as boxNumber}
		<div class="score-row__box">
			{boxNumber}
		</div>
	{/each}
	<div class="score-row__box">
		<Icon icon="lock" />
	</div>
</div>

<style>
	.score-row {
		border: 1px solid blue;
		border-radius: 7px;
		display: flex;
		justify-content: space-between;
		margin: 5px;
	}
	.score-row__box {
		height: 40px;
		width: 40px;
		text-align: center;
		vertical-align: middle;
		line-height: 40px;
		font-size: 20pt;
	}
	.red {
		color: red;
	}
</style>
