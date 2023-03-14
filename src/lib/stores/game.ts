import { db } from '$lib/firebase';
import { get, writable, type Writable } from 'svelte/store';
import {
	collection,
	doc,
	DocumentReference,
	getCountFromServer,
	getDocFromServer,
	onSnapshot,
	setDoc
} from 'firebase/firestore';
import { createArray, randomLetter } from '$lib/utils/base';
import type { GameState } from '$lib/types';

const initialGameState: GameState = {
	id: '',
	status: 'starting',
	players: [],
	diceRolled: false,
	diceRoll: [
		{ value: 1, color: 'white', pipColor: 'black' }, //, locked: false },
		{ value: 2, color: 'white', pipColor: 'black' }, //, locked: false },
		{ value: 3, color: 'yellow', pipColor: 'black' }, //, locked: false },
		{ value: 4, color: 'red', pipColor: 'white' }, //, locked: false },
		{ value: 5, color: 'green', pipColor: 'white' }, //, locked: false },
		{ value: 6, color: 'blue', pipColor: 'white' } //, locked: false }
	]
};

export type GameStore = {
	subscribe: Writable<GameState>['subscribe'];
	endGame: () => void;
	ref: DocumentReference;
};

function gameStore({
	gameDoc,
	code,
	existingGameState
}: {
	gameDoc?: DocumentReference;
	code?: string;
	existingGameState?: GameState;
} = {}): GameStore {
	if (!gameDoc) {
		throw new Error('No game doc passed to game store!');
	}
	const gameState = code
		? { ...(existingGameState ?? initialGameState), id: code }
		: existingGameState ?? initialGameState;
	const { subscribe, update } = writable(gameState, (set) => {
		const unsubscribe = onSnapshot(gameDoc, (snapshot) => {
			set(snapshot.data() as GameState);
		});

		return () => unsubscribe();
	});

	function endGame() {
		update((game) => ({ ...game, gameEnded: true }));
		// remove document from collection
	}

	return {
		subscribe,
		endGame,
		ref: gameDoc
	};
}

let game: GameStore | null = null;

export function getGameStore() {
	return game;
}

export async function joinGame(gameCode: string) {
	if (!gameCode) {
		console.log('No game code entered!');
		return null;
	}

	console.log(`attempting to join game with code ${gameCode}`);
	const existingGameDoc = doc(db, 'games', gameCode);
	const gameDoc = await getDocFromServer(existingGameDoc);
	if (gameDoc.exists()) {
		game = gameStore({ gameDoc: gameDoc.ref, existingGameState: gameDoc.data() as GameState });
		console.log(`game ${gameCode} successfully joined!`);
		return game;
	} else {
		console.error(`Unable to find game with game code "${gameCode}"`);
		return null;
	}
}

export async function createGame() {
	console.log('attempting to create game');
	// generate a new code and check to see if it's being used
	const activeGames = (await getCountFromServer(collection(db, 'games'))).data().count;

	for (const _ in createArray(activeGames + 1)) {
		const code = createArray(5, randomLetter).join('');
		const gameDoc = await getDocFromServer(doc(db, 'games', code));
		if (!gameDoc.exists()) {
			const newGameDoc = doc(db, 'games', code);
			game = gameStore({ gameDoc: newGameDoc, code });
			await setDoc(newGameDoc, get(game));
			console.log(`game created with code ${code}`);
			return game;
		}
	}
	// If we reach here, we were unable to get a valid code
	console.error('unable to generate a valid game code');
	return null;
}
