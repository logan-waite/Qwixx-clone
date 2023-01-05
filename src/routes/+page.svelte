<script lang="ts">
	import '$lib/icon-library';
	import Die from '$lib/components/die.svelte';
	import ScoreRow from '$lib/components/score-row.svelte';
	import { dice } from '$lib/stores/dice';
	import { createArray } from '$lib/utils';
</script>

<svelte:head>
	<title>Qwixx Clone</title>
</svelte:head>

<h1 class="title">Qwixx Clone!</h1>

<main class="game-wrapper">
	<div class="dice-tray">
		{#each $dice as die}
			<Die {...die} />
		{/each}
	</div>
	<div class="actions">
		<button class="roll-button" on:click={dice.rollDice}>Roll Dice</button>
		<div class="empty-rolls">
			<h5>Scores Not Taken</h5>
			<div class="empty-roll-marker__wrapper">
				{#each createArray(4) as box}
					<div class="empty-roll-marker" />
				{/each}
			</div>
		</div>
	</div>
	<div class="scorecard">
		<ScoreRow color="red" ascOrder={true} />
		<ScoreRow color="yellow" ascOrder={true} />
		<ScoreRow color="green" ascOrder={false} />
		<ScoreRow color="blue" ascOrder={false} />
	</div>
</main>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		background-color: lightgray;
	}
	.game-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
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
	.actions {
		padding: 15px;
		display: flex;
		justify-content: space-between;
		width: 70%;
	}
	.roll-button {
		height: 60px;
		padding: 0.5em 1em;
		font-size: 16pt;
		border-radius: 10px;
		box-shadow: 2px 2px 2px grey;
		border: 1px solid gray;
	}
	.roll-button:active {
		box-shadow: 0px 0px 2px grey;
	}
	.empty-rolls {
		text-align: center;
	}
	.empty-rolls h5 {
		margin: 0px;
		margin-bottom: 5px;
	}
	.empty-roll-marker__wrapper {
		display: flex;
	}
	.empty-roll-marker {
		height: 30px;
		width: 30px;
		background-color: white;
		border-radius: 10px;
		border: 1px solid black;
		margin: 0px 5px;
	}
	.scorecard {
		/* width: 512px; */
		/* padding: 10px; */
		/* margin-top: 10px; */
	}
</style>
