<script lang="ts">
	import type { Colors } from '$lib/types';
	import Icon from '$lib/components/icon/icon.svelte';

	export let ascOrder: boolean = true;
	export let color: Colors = 'red';

	const boxes = Array(11)
		.fill(0)
		.map((_, i) => (ascOrder ? i + 2 : 12 - i));
</script>

<div class={`score-row score-row--${color}`}>
	<!-- class={`score-row ${color}`} -->
	{#each boxes as boxNumber}
		<div class={`score-row__box score-row__box--${color}`}>
			{boxNumber}
		</div>
	{/each}
	<div class={`score-row__box score-row__box--${color}`}>
		<Icon icon="unlock" />
	</div>
</div>

<style>
	.score-row {
		/* border-radius: 7px; */
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
		padding: 7px;
	}
	.score-row__box {
		box-sizing: border-box;
		height: 50px;
		width: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20pt;
		margin: 2px;
		border-radius: 5px;
	}

	/* red */
	.score-row--red {
		color: red;
		background-color: red;
	}
	.score-row__box--red {
		background-color: lightpink;
	}

	/* yellow */
	.score-row--yellow {
		color: gold;
		background-color: gold;
	}
	.score-row__box--yellow {
		background-color: lightyellow;
	}

	/* green */
	.score-row--green {
		color: green;
		background-color: green;
	}
	.score-row__box--green {
		background-color: lightgreen;
	}

	/* blue */
	.score-row--blue {
		color: blue;
		background-color: blue;
	}
	.score-row__box--blue {
		background-color: lightblue;
	}
</style>
