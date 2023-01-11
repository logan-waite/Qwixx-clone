<script lang="ts">
	import type { Color } from '$lib/types';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { scores } from '$lib/stores/scores';
	import { turn } from '$lib/stores/turn';
	import { objectsAreEqual } from '$lib/utils';

	export let color: Color;
	export let value: number;
	export let isAvailable: boolean;
	export let validColorOption: boolean;
	export let validWhiteOption: boolean;

	let hover: boolean = false;

	$: currentScore = $scores.scoreRows.find((score) => score.color === color)!;

	$: isSelected =
		objectsAreEqual($turn.selectedWhiteValue, { color, value }) ||
		objectsAreEqual($turn.selectedColorValue, { color, value });

	$: isScored = currentScore.selectedNumbers.includes(value);
	$: showHighlight = hover && (isAvailable || isSelected) && (validColorOption || validWhiteOption);

	function handleClick() {
		console.log('click');
		if (isSelected && validWhiteOption) {
			turn.makeSelection('white', null);
		} else if (isSelected && validColorOption) {
			turn.makeSelection('colored', null);
		} else if (isAvailable && validWhiteOption) {
			turn.makeSelection('white', { color, value });
		} else if (isAvailable && validColorOption) {
			turn.makeSelection('colored', { color, value });
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
