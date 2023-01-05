<script lang="ts">
	import type { Color } from '$lib/types';
	import { dice } from '$lib/stores/dice';
	import { scores } from '$lib/stores/scores';
	import { beforeUpdate, afterUpdate } from 'svelte';
	import { createArray } from '$lib/utils';
	import ScoreRowBox from './score-row-box.svelte';

	/** Props */
	export let ascOrder: boolean = true;
	export let color: Color = 'red';

	let whiteValue: number;
	let colorValue1: number;
	let colorValue2: number;

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

	$: currentScore = $scores.find((score) => score.color === color)!;
	$: rightmostNumber = ascOrder
		? Math.max(...currentScore.selectedNumbers)
		: Math.min(...currentScore.selectedNumbers);

	function isValidOption(boxNumber: number, isRolledNumber: boolean): boolean {
		// is valid if number is to the right of the rightmost number

		const isLocked = currentScore.locked;

		return !isLocked && isRolledNumber;
	}
</script>

<div class={`score-row score-row--${color}`}>
	{#each boxes as boxNumber}
		<ScoreRowBox
			value={boxNumber}
			{color}
			isAvailable={ascOrder ? boxNumber > rightmostNumber : boxNumber < rightmostNumber}
			validColorOption={isValidOption(
				boxNumber,
				colorValue1 === boxNumber || colorValue2 === boxNumber
			)}
			validWhiteOption={isValidOption(boxNumber, whiteValue === boxNumber)}
		/>
	{/each}
	<div class={`score-row__box score-row__box--${color}`}>
		<ScoreRowBox value={-1} {color} validColorOption={false} validWhiteOption={false} />
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
