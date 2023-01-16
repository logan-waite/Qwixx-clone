import { writable } from 'svelte/store';

const initialGameState = {
	gameEnded: false
};

function createGame() {
	const { subscribe, update } = writable(initialGameState);

	function endGame() {
		update((game) => ({ ...game, gameEnded: true }));
	}

	return {
		subscribe,
		endGame
	};
}

export const game = createGame();
