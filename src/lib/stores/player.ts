import { writable, type Writable } from 'svelte/store';
import { db } from '$lib/firebase';
import type { Player } from '/types';
import {
	collection,
	doc,
	DocumentReference,
	getCountFromServer,
	getDocFromServer,
	onSnapshot,
	setDoc
} from 'firebase/firestore';
import { addPlayer } from '$lib/utils/firebase';

export type PlayerStore = {
	subscribe: Writable<Player>['subscribe'];
	ref: DocumentReference;
};

let player: PlayerStore | null = null;

function playerStore(playerDoc?: DocumentReference): PlayerStore {
	if (!playerDoc) {
		throw `Can't initialize player store, missing playerDoc!`;
	}
	const { subscribe } = writable({}, (set) => {
		const unsubscribe = onSnapshot(playerDoc, (snapshot) => {
			set(snapshot.data() as Player);
		});

		return () => unsubscribe();
	});

	return {
		subscribe,
		ref: playerDoc
	};
}

export async function getPlayer(gameDocRef: DocumentReference, playerId: string) {
	if (!player) {
		const playerDocRef = doc(db, 'games', gameDocRef.id, 'players', playerId);
		player = playerStore(playerDocRef);
		console.log({ player });
	}
	return player;
}

export async function addPlayerToGame(gameDocRef: DocumentReference, playerInfo: Player) {
	const playerDoc = await addPlayer(gameDocRef, playerInfo);
	player = playerStore(playerDoc);
	return player;
}
