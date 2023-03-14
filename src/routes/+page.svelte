<script lang="ts">
	import { goto } from '$app/navigation';
	import DefaultButton from '$lib/components/default-button.svelte';
	import { createGame, joinGame, type GameStore } from '$lib/stores';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	let gameCode: string;
	let game: GameStore | null;

	function handleClick(action: 'create' | 'join') {
		return async function _handleClick() {
			switch (action) {
				case 'create':
					game = await createGame();
					break;
				case 'join':
					if (gameCode) {
						game = await joinGame(gameCode);
					} else {
						console.warn('no game code!');
						return;
					}
					break;
			}
			$game && goto(`/lobby/${$game.id}`);
		};
	}
</script>

<svelte:head>
	<title>Qwixx Clone</title>
</svelte:head>

<main class="entry-wrapper">
	<DefaultButton on:click={handleClick('create')}>Create Game</DefaultButton>
	<div class="form-group">
		<input
			class="default-input"
			type="text"
			placeholder="Join Game Code"
			bind:value={gameCode}
			on:input={(e) => (gameCode = gameCode.toUpperCase())}
			maxlength="5"
		/>
		<DefaultButton on:click={handleClick('join')}>
			<FontAwesomeIcon icon="chevron-right" />
		</DefaultButton>
	</div>
</main>

<style>
	.entry-wrapper {
		display: flex;
		flex-direction: column;
	}
	.form-group {
		display: flex;
	}
	.default-input {
		border-radius: 10px;
		font-size: 16pt;
		height: 60px;
	}
</style>
