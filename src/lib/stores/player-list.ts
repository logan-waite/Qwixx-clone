import { db } from '$lib/firebase';
import type { Player } from '$lib/types';
import {
	type DocumentReference,
	onSnapshot,
	collection,
	CollectionReference,
	QueryDocumentSnapshot,
	type DocumentData
} from 'firebase/firestore';
import { type Writable, writable, derived } from 'svelte/store';

export type PlayerListStore = {
	subscribe: Writable<Player[]>['subscribe'];
	// ref: CollectionReference;
};

type PlayerCollectionStore = {
	subscribe: Writable<QueryDocumentSnapshot<DocumentData>[]>['subscribe'];
	ref: CollectionReference;
};

let playerList: PlayerListStore | null = null;

function playerListStore(playerListRef?: CollectionReference) {
	if (!playerListRef) {
		throw `Can't initialize player list store, missing player list collection ref!`;
	}
	const { subscribe } = writable<QueryDocumentSnapshot<DocumentData>[]>([], (set) => {
		console.log('attempting subscription');
		const unsubscribe = onSnapshot(playerListRef, (snapshot) => {
			set(snapshot.docs);
		});

		return () => unsubscribe();
	});

	return {
		subscribe,
		ref: playerListRef
	};
}

let playerCollectionStore: PlayerCollectionStore;
export async function getPlayerList(gameDocRef: DocumentReference) {
	if (!playerList) {
		const playerListRef = collection(db, 'games', gameDocRef.id, 'players');
		playerCollectionStore = playerListStore(playerListRef);
	}
	playerList = derived(playerCollectionStore, (col) =>
		col.map((doc) => {
			console.log(doc.data());
			return doc.data() as Player;
		})
	);
	return playerList;
}
