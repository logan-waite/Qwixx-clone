<script lang="ts">
	import type { Color } from '$lib/types';
	import { dice } from '$lib/stores/dice';
	import { scores } from '$lib/stores/scores';
	import { turn } from '$lib/stores/turn';
	import { beforeUpdate, afterUpdate } from 'svelte';
	import { createArray, getValueByColor, min, max } from '$lib/utils';
	import ScoreRowBox from './score-row-box.svelte';

	/** Props */
	export let ascOrder: boolean = true;
	export let color: Color = 'red';

	let whiteValue: number;
	let colorValue1: number;
	let colorValue2: number;

	const getColorValue = getValueByColor(color);

	/** Get Box Values */
	const boxes = createArray(11, 0).map((_, i) => (ascOrder ? i + 2 : 12 - i));

	beforeUpdate(() => {
		/** Find Available Score Options */
		const whiteDice = $dice.filter((die) => die.color === 'white');
		const colorDie = $dice.find((die) => die.color === color)!;

		whiteValue = whiteDice[0].value + whiteDice[1].value;
		colorValue1 = whiteDice[0].value + colorDie.value;
		colorValue2 = whiteDice[1].value + colorDie.value;
	});

	$: currentScore = $scores.scoreRows.find((score) => score.color === color)!;
	$: selectedColorNumber = getColorValue($turn.selectedColorValue);
	$: selectedWhiteNumber = getColorValue($turn.selectedWhiteValue);
	$: rightmostNumber = ascOrder
		? max(...currentScore.selectedNumbers, selectedColorNumber, selectedWhiteNumber)
		: min(...currentScore.selectedNumbers, selectedColorNumber, selectedWhiteNumber);
	$: {
	}
</script>

<div class={`score-row score-row--${color}`}>
	{#each boxes as boxNumber, i}
		{@const numberIsFree = i + 1 === boxes.length ? currentScore.selectedNumbers.length >= 5 : true}
		<ScoreRowBox
			value={boxNumber}
			{color}
			isAvailable={ascOrder ? boxNumber > rightmostNumber : boxNumber < rightmostNumber}
			validColorOption={numberIsFree &&
				!currentScore.locked &&
				(colorValue1 === boxNumber || colorValue2 === boxNumber)}
			validWhiteOption={selectedColorNumber == null &&
				numberIsFree &&
				!currentScore.locked &&
				whiteValue === boxNumber}
		/>
	{/each}
	<ScoreRowBox
		value={-1}
		isAvailable={false}
		{color}
		validColorOption={true}
		validWhiteOption={true}
		on:click={() => console.log('lock')}
	/>
</div>

<style>
	.score-row {
		/* border-radius: 7px; */
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
		padding: 7px;
	}

	/* red */
	.score-row--red {
		background-color: red;
	}

	/* yellow */
	.score-row--yellow {
		background-color: gold;
	}

	/* green */
	.score-row--green {
		background-color: green;
	}

	/* blue */
	.score-row--blue {
		background-color: blue;
	}
</style>
