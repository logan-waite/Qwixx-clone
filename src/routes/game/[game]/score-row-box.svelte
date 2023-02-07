<script lang="ts">
	import type { BoxSelection, Color } from '$lib/types';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { turn, score } from '$lib/stores/index';

	export let color: Color;
	export let value: number;
	export let isAvailable: boolean = false;
	export let validColorOption: boolean = false;
	export let validWhiteOption: boolean = false;
	export let isLockNumber: boolean = false;
	export let isSelected: boolean = false;

	let hover: boolean = false;

	$: currentScore = $score.scoreRows.find((row) => row.color === color)!;
	$: isScored = currentScore.selectedNumbers.includes(value);
	$: showHighlight = hover && (isAvailable || isSelected) && (validColorOption || validWhiteOption);

	function handleClick() {
		if (isSelected && validWhiteOption) {
			turn.makeSelection('white', null);
		} else if (isSelected && validColorOption) {
			turn.makeSelection('color', null);
		} else if (isSelected && validWhiteOption && validColorOption) {
			makeSelectionWhenBothValid(null);
		} else if (isAvailable && validWhiteOption && validColorOption) {
			makeSelectionWhenBothValid({ color, value, willLock: isLockNumber });
		} else if (isAvailable && validWhiteOption) {
			turn.makeSelection('white', { color, value, willLock: isLockNumber });
		} else if (isAvailable && validColorOption) {
			turn.makeSelection('color', { color, value, willLock: isLockNumber });
		}
	}

	function makeSelectionWhenBothValid(selection: BoxSelection | null) {
		if (selection === null) {
			turn.makeSelection('white', null);
			turn.makeSelection('color', null);
			return;
		}

		// default to white when there is conflict
		if ($turn.selectedWhiteValue && !$turn.selectedColorValue) {
			turn.makeSelection('color', selection);
		} else if (!$turn.selectedWhiteValue && !$turn.selectedColorValue) {
			turn.makeSelection('white', selection);
			turn.makeSelection('color', selection);
		} else {
			turn.makeSelection('white', selection);
		}
	}
</script>

<button
	type="button"
	class={`score-row__box score-row__box--${color} `}
	class:score-row__box--highlight={showHighlight}
	on:mouseenter={() => (hover = true)}
	on:mouseleave={() => (hover = false)}
	on:click={handleClick}
>
	{#if value > -1}
		{value}
	{:else}
		<FontAwesomeIcon icon="unlock" />
	{/if}

	{#if isSelected}
		<FontAwesomeIcon class="score-row__box--selected" icon={['fas', 'x']} />
	{/if}

	{#if isScored}
		<FontAwesomeIcon class="score-row__box--scored" icon={['fas', 'x']} />
	{/if}

	{#if isAvailable && validWhiteOption && !isSelected}
		<FontAwesomeIcon
			class="score-row__box--attention"
			icon={['fad', 'circle-exclamation']}
			style="left: 2px; top: 2px;"
		/>
	{/if}
	{#if isAvailable && validColorOption}
		<FontAwesomeIcon
			class="score-row__box--attention"
			icon={['fad', 'circle-exclamation']}
			style="right: 2px; top: 2px;"
			swapOpacity
		/>
	{/if}
</button>

<style>
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
		position: relative;
		border: none;
	}

	:global(.score-row__box--attention) {
		position: absolute;
		font-size: 10pt;
	}

	:global(.score-row__box--scored) {
		color: black;
		position: absolute;
		opacity: 0.5;
		font-size: 24pt;
	}

	:global(.score-row__box--selected) {
		color: black;
		position: absolute;
		opacity: 0.25;
		font-size: 24pt;
	}

	.score-row__box--highlight {
		border: 2px solid white;
		box-shadow: 0px 0px 1px 2px gray;
		cursor: pointer;
	}

	.score-row__box--red {
		color: red;
		background-color: lightpink;
	}
	.score-row__box--yellow {
		color: gold;
		background-color: lightyellow;
	}
	.score-row__box--green {
		color: green;
		background-color: lightgreen;
	}
	.score-row__box--blue {
		color: blue;
		background-color: lightblue;
	}
</style>
