<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import Die from './die.svelte';
	import ScoreRow from './score-row.svelte';
	import DefaultButton from '$lib/components/default-button.svelte';
	import {
		dice,
		turn,
		calculateFinalScore,
		score,
		type GameStore,
		getGameStore,
		joinGame
	} from '$lib/stores/index';
	import { createArray, getFromLocal } from '$lib/utils/base';
	import { beforeUpdate, onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { Player, SavedPlayer } from '$lib/types';
	import { goto } from '$app/navigation';

	let game: GameStore | null = getGameStore();
	let player: Player | null;
	export let data: PageData;

	onMount(async () => {
		if (!game) {
			game ??= await joinGame(data.gameCode);
			const savedPlayer = getFromLocal<SavedPlayer>('player');
			if (savedPlayer) {
				const playerInGame = !!$game?.players.find((player) => player.id === savedPlayer.id);
				if (!playerInGame) {
					goto('/');
				}
			}
		}
	});
	function handleActionClick() {
		// check for adding scores
		$turn.isMyTurn ? turn.endTurn() : turn.startTurn();
	}

	$: availableColors = $score.scoreRows.filter((row) => !row.locked).map((row) => row.color);

	beforeUpdate(() => {
		if ($score.passedTurns === 4 || availableColors.length === 2) {
			game?.endGame();
		}
	});
</script>

{#if game}
	<main class="game-wrapper">
		<div class="dice-tray">
			{#each $dice as die}
				{#if die.color === 'white' || availableColors.includes(die.color)}
					<Die {...die} />
				{/if}
			{/each}
		</div>
		<div class="actions">
			<div class="buttons">
				<DefaultButton on:click={handleActionClick}>
					{#if $turn.isMyTurn}
						End Turn
					{:else}
						Roll Dice
					{/if}
				</DefaultButton>
			</div>
			{#if $game?.status === 'ended'}
				<h4>Game Over!</h4>
				<h5>Final Score: {calculateFinalScore($score)}</h5>
			{/if}
			<div class="empty-rolls">
				<h5>Turns Passed</h5>
				<div class="empty-roll-marker__wrapper">
					{#each createArray(4) as box, i}
						<div class="empty-roll-marker">
							{#if $score.passedTurns >= i + 1}
								<FontAwesomeIcon icon={['fas', 'x']} />
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="scorecard">
			<div class="lock-boxes"><h5>At least 5 X's</h5></div>
			<ScoreRow color="red" ascOrder={true} />
			<ScoreRow color="yellow" ascOrder={true} />
			<ScoreRow color="green" ascOrder={false} />
			<ScoreRow color="blue" ascOrder={false} />
		</div>
	</main>
{/if}

<style>
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
		width: 100%;
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
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.scorecard {
		position: relative;
	}
	.lock-boxes {
		top: -12px;
		right: 7px;
		width: 106px;
		height: 110%;
		border: 1px solid black;
		position: absolute;
		text-align: center;
		border-radius: 5px;
	}
	.lock-boxes h5 {
		margin: 0px;
		margin-bottom: 5px;
		pointer-events: none;
	}
</style>
