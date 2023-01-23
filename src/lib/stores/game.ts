import { db } from '$lib/firebase';
import { writable, type Writable } from 'svelte/store';
import {
	collection,
	doc,
	getCountFromServer,
	getDocFromServer,
	onSnapshot,
	setDoc,
	type DocumentReference
} from 'firebase/firestore';
import { createArray, randomLetter } from '$lib/utils';
import type { Color, DieValue } from '$lib/types';

type GameState = {
	gameEnded: boolean;
	players: Array<{
		name: string;
		score: number;
		currentTurn: boolean;
	}>;
	diceRoll: Array<{ value: number; color: string }>;
};

const initialGameState = {
	gameEnded: false,
	players: [
		{
			name: 'Fred Astaire',
			score: 0,
			currentTurn: false
		}
	],
	diceRoll: [
		{ value: 1, color: 'white' },
		{ value: 2, color: 'white' },
		{ value: 3, color: 'yellow' },
		{ value: 4, color: 'red' },
		{ value: 5, color: 'green' },
		{ value: 6, color: 'blue' }
	]
};

type GameStore = {
	subscribe: Writable<GameState>['subscribe'];
	endGame: () => void;
};

function gameStore(gameDoc: DocumentReference): GameStore {
	const { subscribe, update } = writable(initialGameState, (set) => {
		const unsubscribe = onSnapshot(gameDoc, (snapshot) => {
			set(snapshot.data() as GameState);
		});

		return () => unsubscribe();
	});

	function endGame() {
		update((game) => ({ ...game, gameEnded: true }));
	}

	return {
		subscribe,
		endGame
	};
}

let game: GameStore;

export async function setupGameStore(gameCode?: string): Promise<GameStore | null> {
	if (game) {
		console.log('game store already exists!');
		return game;
	}

	if (gameCode) {
		console.log(`attempting to join game with code ${gameCode}`);
		const existingGameDoc = doc(db, 'games', gameCode);
		const gameDoc = await getDocFromServer(existingGameDoc);
		if (gameDoc.exists()) {
			game = gameStore(existingGameDoc);
			console.log('game joined');
			return game;
		} else {
			console.error(`Unable to find game with game code "${gameCode}"`);
			return null;
		}
	} else {
		console.log('attempting to create game');
		// generate a new code and check to see if it's being used
		const activeGames = (await getCountFromServer(collection(db, 'games'))).data().count;

		for (const _ in createArray(activeGames + 1)) {
			const code = createArray(5, randomLetter).join('');
			const gameDoc = await getDocFromServer(doc(db, 'games', code));
			if (!gameDoc.exists()) {
				const newGameDoc = doc(db, 'games', code);
				await setDoc(newGameDoc, initialGameState);
				game = gameStore(newGameDoc);
				console.log(`game created with code ${code}`);
				return game;
			}
		}
		// If we reach here, we were unable to get a valid code
		console.error('unable to generate a valid game code');
		return null;
	}
}

// export const game = setupGameStore();
