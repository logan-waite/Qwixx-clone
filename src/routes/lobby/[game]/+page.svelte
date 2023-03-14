<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import DefaultButton from '$lib/components/default-button.svelte';
	import ToggleButton from '$lib/components/toggle-button.svelte';
	import {
		addPlayerToGame,
		getGameStore,
		getPlayer,
		initialScore,
		joinGame,
		type GameStore,
		type PlayerStore
	} from '$lib/stores';
	import { getPlayerList, type PlayerListStore } from '$lib/stores/player-list';
	import type { SavedPlayer } from '$lib/types';
	import { generateGuid, getFromLocal, objectIsEmpty, saveToLocal } from '$lib/utils/base';
	import { removePlayer, startGame, updatePlayer } from '$lib/utils/firebase';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	export const ssr = false;

	export let data: PageData;
	let game: GameStore | null = getGameStore();
	let name: string;
	let savedPlayer = getFromLocal<SavedPlayer>('player');
	let leavingGame = false;

	let player: PlayerStore | null;
	let playerList: PlayerListStore | null;

	let readyToStart: boolean;
	$: if ($game) {
		readyToStart = $game.players.length > 1 && $game.players.every((p) => p.state === 'ready');
	}

	$: if ($game?.status !== 'starting') {
		// goto(`/game/${$game?.id}`);
	}

	$: {
		console.log('playerLIst', $playerList);
	}

	onMount(async () => {
		game ??= await joinGame(data.gameCode);

		if (game && $game) {
			playerList = await getPlayerList(game.ref);
			if (savedPlayer) {
				name = savedPlayer.name;
				const existingPlayer = await getPlayer(game?.ref, savedPlayer.id);
				if (objectIsEmpty(existingPlayer)) {
					player = existingPlayer;
				} else {
					const playerInfo = {
						...savedPlayer,
						score: initialScore,
						state: $game.players.length ? 'joined' : 'ready'
					};
					player = await addPlayerToGame(game.ref, playerInfo);
				}
			} else {
				name = 'Player ' + ($game.players.length + 1);
				const playerInfo = {
					id: generateGuid(),
					name,
					score: initialScore,
					state: $game.players.length ? 'joined' : 'ready'
				};
				player = await addPlayerToGame(game.ref, playerInfo);
			}
		}
	});

	beforeNavigate((navigation) => {
		const continuingToGame = navigation.to?.route.id === '/game/[game]';
		if (!continuingToGame) {
			leavingGame = true;
		}
	});

	onDestroy(() => {
		if (leavingGame && game && player) {
			removePlayer(player.ref);
			// empty player store as well
		}
	});

	function handleChangeName() {
		if ($player) {
			$player.name = name;
			saveToLocal('player', { id: $player.id, name: $player.name });
			if (player) {
				updatePlayer(player.ref, $player);
			}
		}
	}

	function handleToggleReady({ detail: state }: CustomEvent<boolean>) {
		if (player) {
			updatePlayer(player?.ref, { state: state ? 'ready' : 'joined' });
		}
	}

	function handleStartGame() {
		startGame(game?.ref);
		goto(`/game/${$game?.id}`);
	}
</script>

<svelte:head>
	<title>Qwixx Clone | {data.gameCode} Lobby</title>
</svelte:head>

<h2>Game Code: {data.gameCode}</h2>

<input class="default-input" type="text" placeholder="Name" bind:value={name} />
<button type="button" on:click={handleChangeName}>Change Name</button>

<ul>
	Joined Players
	{#each $game?.players ?? [] as player}
		<li>{player.name} {player.state === 'ready' ? 'ready' : ''}</li>
	{/each}
</ul>

<!-- {#if joinOrder === 0}
	<DefaultButton disabled={!readyToStart} on:click={() => handleStartGame()}
		>Start Game</DefaultButton
	>
{:else if playerIndex && playerIndex > 0}
	<ToggleButton on:toggle={handleToggleReady}>Ready</ToggleButton>
{/if} -->
