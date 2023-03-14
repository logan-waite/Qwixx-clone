<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import Die from './die.svelte';
	import ScoreRow from './score-row.svelte';
	import DefaultButton from '$lib/components/default-button.svelte';
	import {
		calculateFinalScore,
		score,
		type GameStore,
		getGameStore,
		joinGame,
		turn
	} from '$lib/stores/index';
	import { createArray, getFromLocal } from '$lib/utils/base';
	import { beforeUpdate, onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { Player, SavedPlayer, Die as DieData } from '$lib/types';
	import { goto } from '$app/navigation';
	import fb from '$lib/utils/firebase';
	import { updatePlayerScore } from '$lib/utils/game';
	import ToggleButton from '$lib/components/toggle-button.svelte';

	export let data: PageData;
	let game: GameStore | null = getGameStore();
	let playerIndex: number = -1;
	let player: Player | null;
	$: if ($game && playerIndex > -1) {
		player = $game?.players[playerIndex];
	}

	let dice: DieData[] = [];
	$: if ($game?.diceRoll) {
		dice = $game.diceRoll;
	}

	let scoreUpdated = false;
	$: {
		console.log('score updated?', scoreUpdated);
	}
	$: if ($game?.status === 'turn started') {
		scoreUpdated = false;
	}
	$: if ($game?.status === 'turn ended' && !scoreUpdated) {
		console.log('turn ended');
		if (player) {
			const newScore = updatePlayerScore(player.score, {
				whiteValue: $turn.selectedWhiteValue,
				colorValue: $turn.selectedColorValue
			});
			fb.saveScore(game?.ref, playerIndex, newScore);
			scoreUpdated = true;
		}
	}

	onMount(async () => {
		if (!game) {
			game ??= await joinGame(data.gameCode);
		}

		if ($game) {
			const savedPlayer = getFromLocal<SavedPlayer>('player');
			if (savedPlayer) {
				playerIndex = $game.players.findIndex((player) => player.id === savedPlayer.id);
				if (playerIndex === -1) {
					goto('/');
				} else {
					player = player = $game?.players[playerIndex];
				}
			}
		}
	});

	$: availableColors = $score.scoreRows.filter((row) => !row.locked).map((row) => row.color);

	beforeUpdate(() => {
		if ($score.passedTurns === 4 || availableColors.length === 2) {
			game?.endGame();
		}
	});

	async function handleRollDice() {
		await fb.rollDice(game?.ref);
		turn.startTurn();
	}

	async function handleEndTurn() {
		if (player) {
			await fb.endTurn(game?.ref, playerIndex);
			turn.endTurn();
		}
	}

	async function handleReady() {
		if (player) {
			await fb.updatePlayer(game?.ref, {
				...player,
				state: player.state === 'ready' ? 'joined' : 'ready'
			});
		}
	}
</script>

<svelte:head>
	<title>Qwixx Clone | {data.gameCode} Game</title>
</svelte:head>

{#if game}
	<main class="game-wrapper">
		<div class="dice-tray">
			{#each dice as die}
				{#if die.color === 'white' || availableColors.includes(die.color)}
					<Die {...die} />
				{/if}
			{/each}
		</div>
		<div class="actions">
			<div class="buttons">
				<!-- 
					If current turn and dice not rolled,
						show "Roll Dice"
					If current turn and dice rolled,
						show "End Turn"
					If not current turn and dice aren't rolled,
						show disabled button (text?)
					If not current turn and dice have been rolled,
						show "Save Selection" (with some kind of success indicator)
				-->
				{#if player?.state === 'current turn' && !$game?.diceRolled}
					<DefaultButton on:click={handleRollDice}>Roll Dice</DefaultButton>
				{:else if player?.state === 'current turn' && $game?.diceRolled}
					<DefaultButton
						on:click={handleEndTurn}
						disabled={!$game.players.every(
							(p) => p.state === 'ready' || p.state === 'current turn'
						)}>End Turn</DefaultButton
					>
				{:else if (player?.state === 'ready' || player?.state === 'joined') && $game?.diceRolled}
					<ToggleButton on:toggle={handleReady}>Ready</ToggleButton>
				{:else}
					<DefaultButton disabled>Default Text Here</DefaultButton>
				{/if}
			</div>
			{#if $game?.status === 'ended'}
				<h4>Game Over!</h4>
				<h5>Final Score: {calculateFinalScore($score)}</h5>
			{:else}
				{player?.state}
			{/if}
			<div class="empty-rolls">
				<h5>Turns Passed</h5>
				<div class="empty-roll-marker__wrapper">
					{#each createArray(4) as box, i}
						<div class="empty-roll-marker">
							{#if player && player.score.passedTurns >= i + 1}
								<FontAwesomeIcon icon={['fas', 'x']} />
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="scorecard">
			<div class="lock-boxes"><h5>At least 5 X's</h5></div>
			<ScoreRow color="red" ascOrder={true} {game} {player} />
			<ScoreRow color="yellow" ascOrder={true} {game} {player} />
			<ScoreRow color="green" ascOrder={false} {game} {player} />
			<ScoreRow color="blue" ascOrder={false} {game} {player} />
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
