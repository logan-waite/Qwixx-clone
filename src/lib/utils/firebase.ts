import { db } from '$lib/firebase';
import type { GameStore } from '$lib/stores';
import type { GameState, GameStatus, Player } from '$lib/types';
import type { DocumentReference, Firestore } from 'firebase/firestore';
import { runTransaction } from 'firebase/firestore';

export async function addPlayer(gameDocRef: DocumentReference, player: Player) {
	try {
		await runTransaction(db, async (transaction) => {
			const gameDoc = await transaction.get(gameDocRef);
			if (!gameDoc.exists()) {
				throw "Game doesn't exist!";
			}

			transaction.update(gameDocRef, { players: [...gameDoc.data().players, player] });
		});
		console.log(`Player successfully added to game ${gameDocRef.id}!`);
	} catch (e) {
		console.log(`Failed to add player to game ${gameDocRef.id}: `, e);
	}
}

export async function updatePlayer(gameDocRef: DocumentReference, player: Player) {
	try {
		await runTransaction(db, async (transaction) => {
			const gameDoc = await transaction.get(gameDocRef);
			if (!gameDoc.exists()) {
				throw "Game doesn't exist!";
			}

			const updatedPlayerList = gameDoc
				.data()
				.players.map((p: Player) => (p.id === player.id ? player : p));

			transaction.update(gameDocRef, { players: updatedPlayerList });
		});
		console.log(`Player successfully updated`);
	} catch (e) {
		console.log(`Failed to update player: `, e);
	}
}

export async function removePlayer(gameDocRef: DocumentReference, player: Player) {
	try {
		await runTransaction(db, async (transaction) => {
			const gameDoc = await transaction.get(gameDocRef);
			if (!gameDoc.exists()) {
				throw "Game doesn't exist!";
			}
			const players = gameDoc.data().players;
			const playerIndex = players.findIndex((p: Player) => p.id === player.id);
			players.splice(playerIndex, 1);

			transaction.update(gameDocRef, { players });
		});
		console.log(`Player successfully removed from game`);
	} catch (e) {
		console.log(`Failed to remove player: `, e);
	}
}

export async function setGameStatus(gameDocRef: DocumentReference | undefined, status: GameStatus) {
	try {
		if (!gameDocRef) {
			throw "`setGameStatus` didn't receive a gameDocRef!";
		}
		await runTransaction(db, async (transaction) => {
			const gameDoc = await transaction.get(gameDocRef);
			if (!gameDoc.exists()) {
				throw "Game doesn't exist!";
			}

			transaction.update(gameDocRef, { status });
		});
		console.log(`Player successfully removed from game`);
	} catch (e) {
		console.log(`Failed to remove player: `, e);
	}
}
