<script lang="ts">
	import type { Color } from '$lib/types';
	import { dice, turn, game, score } from '$lib/stores/index';

	import { beforeUpdate } from 'svelte';
	import { createArray, getValueByColor, min, max, objectsAreEqual } from '$lib/utils';
	import ScoreRowBox from './score-row-box.svelte';

	/** Props */
	export let ascOrder: boolean = true;
	export let color: Color = 'red';

	let whiteValue: number;
	let colorValue1: number;
	let colorValue2: number;
	let rowWillLock: boolean;

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

	$: currentScore = $score.scoreRows.find((row) => row.color === color)!;
	$: selectedWhiteNumber = getColorValue($turn.selectedWhiteValue);
	$: selectedColorNumber = getColorValue($turn.selectedColorValue);
	$: rightmostNumber = ascOrder
		? max(...currentScore.selectedNumbers, selectedColorNumber, selectedWhiteNumber)
		: min(...currentScore.selectedNumbers, selectedColorNumber, selectedWhiteNumber);
	$: {
		const whiteWillLock =
			$turn.selectedWhiteValue?.color === color && !!$turn.selectedWhiteValue?.willLock;
		const colorWillLock =
			$turn.selectedColorValue?.color === color && !!$turn.selectedColorValue?.willLock;
		rowWillLock = whiteWillLock || colorWillLock;
	}
	$: markedBoxes =
		currentScore.selectedNumbers.length +
		(selectedWhiteNumber == null ? 0 : 1) +
		(selectedColorNumber == null ? 0 : 1);
</script>

<div class={`score-row score-row--${color}`}>
	<!-- {@debug currentScore} -->
	{#each boxes as boxNumber, i}
		{@const numberIsFree = i + 1 === boxes.length ? markedBoxes >= 5 : true}
		{@const willLock = i + 1 === boxes.length}
		{@const isSelected =
			objectsAreEqual($turn.selectedWhiteValue, { color, value: boxNumber, willLock }) ||
			objectsAreEqual($turn.selectedColorValue, { color, value: boxNumber, willLock })}

		<ScoreRowBox
			value={boxNumber}
			{color}
			isAvailable={!$game.gameEnded &&
				$turn.isMyTurn &&
				(ascOrder ? boxNumber > rightmostNumber : boxNumber < rightmostNumber)}
			{isSelected}
			isLockNumber={willLock}
			validColorOption={numberIsFree &&
				!currentScore.locked &&
				(colorValue1 === boxNumber || colorValue2 === boxNumber)}
			validWhiteOption={selectedColorNumber == null &&
				numberIsFree &&
				!currentScore.locked &&
				whiteValue === boxNumber}
		/>
	{/each}
	<ScoreRowBox value={-1} isSelected={rowWillLock} {color} />
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
