<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import DefaultButton from '$lib/components/default-button.svelte';
	import ToggleButton from '$lib/components/toggle-button.svelte';
	import { getGameStore, initialScore, joinGame, type GameStore } from '$lib/stores';
	import type { Player, SavedPlayer } from '$lib/types';
	import { generateGuid, getFromLocal, saveToLocal } from '$lib/utils/base';
	import { addPlayer, removePlayer, setGameStatus, updatePlayer } from '$lib/utils/firebase';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	export const ssr = false;

	export let data: PageData;
	let game: GameStore | null = getGameStore();
	let name: string;
	let savedPlayer = getFromLocal<SavedPlayer>('player');
	let leavingGame = false;

	let player: Player | null;
	$: player = null;
	$: playerIndex = $game?.players.findIndex((p) => p.id === player?.id);

	let readyToStart: boolean;
	$: if ($game) {
		readyToStart = $game.players.length > 1 && $game.players.every((p) => p.state === 'ready');
	}

	$: if ($game?.status === 'in progress') {
		goto(`/game/${$game?.id}`);
	}

	onMount(async () => {
		game ??= await joinGame(data.gameCode);

		if (game && $game) {
			if (savedPlayer) {
				name = savedPlayer.name;
				const existingPlayer = $game.players.find((p) => p.id === savedPlayer.id);
				if (existingPlayer) {
					player = existingPlayer;
				} else {
					player = {
						...savedPlayer,
						score: initialScore,
						state: $game.players.length ? 'waiting' : 'ready'
					};
					addPlayer(game.ref, player);
				}
			} else {
				name = 'Player ' + ($game.players.length + 1);
				player = {
					id: generateGuid(),
					name,
					score: initialScore,
					state: $game.players.length ? 'waiting' : 'ready'
				};
				addPlayer(game.ref, player);
			}
		}
	});

	beforeNavigate((navigation) => {
		const continuingToGame = navigation.to?.route.id === '/game/[code]';
		if (!continuingToGame) {
			leavingGame = true;
		}
	});

	onDestroy(() => {
		if (leavingGame && game && player) {
			removePlayer(game?.ref, player);
			// empty player store as well
		}
	});

	function handleChangeName() {
		if (player) {
			player.name = name;
			saveToLocal('player', { id: player.id, name: player.name });
			if (game) {
				updatePlayer(game?.ref, player);
			}
		}
	}

	function handleToggleReady({ detail: state }: CustomEvent<boolean>) {
		if (game && player) {
			updatePlayer(game?.ref, { ...player, state: state ? 'ready' : 'waiting' });
		}
	}

	function handleStartGame() {
		setGameStatus(game?.ref, 'in progress');
		goto(`/game/${$game?.id}`);
	}
</script>

<h2>Game Code: {data.gameCode}</h2>

<input class="default-input" type="text" placeholder="Name" bind:value={name} />
<button type="button" on:click={handleChangeName}>Change Name</button>

<ul>
	Joined Players
	{#each $game?.players ?? [] as player}
		<li>{player.name} {player.state === 'ready' ? 'ready' : ''}</li>
	{/each}
</ul>

{#if playerIndex === 0}
	<DefaultButton disabled={!readyToStart} on:click={() => handleStartGame()}
		>Start Game</DefaultButton
	>
{:else if playerIndex && playerIndex > 0}
	<ToggleButton on:toggle={handleToggleReady}>Ready</ToggleButton>
{/if}
