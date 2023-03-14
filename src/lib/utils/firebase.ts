import { db } from '$lib/firebase';
import type { GameStore } from '$lib/stores';
import type { BoxSelection, Die, GameState, GameStatus, Player, Score, ScoreRow } from '$lib/types';
import {
	deleteDoc,
	collection,
	getDocFromServer,
	setDoc,
	type DocumentReference,
	type Firestore,
	type Transaction,
	getCountFromServer
} from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { runTransaction } from 'firebase/firestore';
import { objectsAreEqual, randomNumber } from './base';
import { randomDieNumber, updatePlayerScore } from './game';

export async function addPlayer(gameDocRef: DocumentReference, player: Player) {
	try {
		if (!gameDocRef) {
			throw "`addPlayer` didn't receive a gameDocRef!";
		}
		const joinedPlayerCount = await getCountFromServer(
			collection(db, 'games', gameDocRef.id, 'players')
		);

		const playerDocRef = doc(db, 'games', gameDocRef.id, 'players', player.id);
		await setDoc(playerDocRef, { ...player, joinOrder: joinedPlayerCount.data().count + 1 }); // start counting at 1
		// await runTransaction(db, async (transaction) => {
		// 	const gameDoc = await transaction.get(gameDocRef);
		// 	if (!gameDoc.exists()) {
		// 		throw "Game doesn't exist!";
		// 	}

		// 	transaction.update(gameDocRef, { players: [...gameDoc.data().players, player] });
		// });
		console.log(`Player successfully added to game ${gameDocRef.id}!`);
		return playerDocRef;
	} catch (e) {
		console.log(`Failed to add player to game ${gameDocRef.id}: `, e);
	}
}

// export async function getPlayer(gameDocRef: DocumentReference, playerId: string) {
// 	try {
// 		if (!gameDocRef) {
// 			throw "`getPlayer` didn't receive a gameDocRef!";
// 		}
// 		const playerDocRef = doc(db, 'games', gameDocRef.id, 'players', playerId);
// 		const player = getDocFromServer(playerDocRef)
// 	}
// }

export async function updatePlayer(
	playerDocRef: DocumentReference | null,
	player: Partial<Player>
) {
	try {
		if (!playerDocRef) {
			throw "`updatePlayer` didn't receive a playerDocRef!";
		}
		await runTransaction(db, async (transaction) => {
			const playerDoc = await transaction.get(playerDocRef);
			if (!playerDoc.exists()) {
				throw "Player isn't in this game!";
			}

			transaction.update(playerDocRef, { ...player });
		});
		console.log(`Player successfully updated`);
	} catch (e) {
		console.log(`Failed to update player: `, e);
	}
}

export async function removePlayer(playerDocRef: DocumentReference) {
	try {
		deleteDoc(playerDocRef);
		// await runTransaction(db, async (transaction) => {
		// 	const gameDoc = await transaction.get(gameDocRef);
		// 	if (!gameDoc.exists()) {
		// 		throw "Game doesn't exist!";
		// 	}
		// 	const players = gameDoc.data().players;
		// 	const playerIndex = players.findIndex((p: Player) => p.id === player.id);
		// 	players.splice(playerIndex, 1);

		// 	transaction.update(gameDocRef, { players });
		// });
		console.log(`Player successfully removed from game`);
	} catch (e) {
		console.log(`Failed to remove player: `, e);
	}
}

export async function startGame(gameDocRef: DocumentReference | undefined) {
	try {
		if (!gameDocRef) {
			throw "`startGame` didn't receive a gameDocRef!";
		}
		await runTransaction(db, async (transaction) => {
			const gameDoc = await transaction.get(gameDocRef);
			if (!gameDoc.exists()) {
				throw "Game doesn't exist!";
			}

			const players: Player[] = gameDoc.data().players;
			const joinedPlayers = players.map((p) => ({ ...p, state: 'joined' }));
			const randomIndex = randomNumber(0, joinedPlayers.length - 1);
			joinedPlayers[randomIndex].state = 'current turn';

			transaction.update(gameDocRef, { players: joinedPlayers, state: 'turn ended' });
		});
		console.log(`Game successfully started`);
	} catch (e) {
		console.log(`Failed to start game: `, e);
	}
}

export async function rollDice(gameDocRef: DocumentReference | undefined) {
	try {
		if (!gameDocRef) {
			throw "`rollDice` didn't receive a gameDocRef!";
		}
		await runTransaction(db, async (transaction) => {
			const gameDoc = await transaction.get(gameDocRef);
			if (!gameDoc.exists()) {
				throw "Game doesn't exist!";
			}

			const newDiceRoll = gameDoc
				.data()
				.diceRoll.map((die: Die) => ({ ...die, value: randomDieNumber() }));

			transaction.update(gameDocRef, {
				diceRoll: newDiceRoll,
				diceRolled: true,
				status: 'turn started'
			});
		});
		console.log(`Dice Rolled Successfully`);
	} catch (e) {
		console.log(`Dice failed to roll! `, e);
	}
}

export async function endTurn(
	gameDocRef: DocumentReference | undefined,
	currentPlayerIndex: number
) {
	try {
		if (!gameDocRef) {
			throw "`endTurn` didn't receive a gameDocRef!";
		}
		await runTransaction(db, async (transaction) => {
			const gameDoc = await transaction.get(gameDocRef);
			if (!gameDoc.exists()) {
				throw "Game doesn't exist!";
			}

			// get player
			const players: Player[] = gameDoc.data().players;
			const updatedPlayers = players.map((p) => ({ ...p, state: 'joined' }));

			// update turn to next person
			const nextPlayerIndex =
				currentPlayerIndex === gameDoc.data().players.length - 1 ? 0 : currentPlayerIndex + 1;
			const nextPlayer = players[nextPlayerIndex];
			nextPlayer.state = 'current turn';

			updatedPlayers.splice(nextPlayerIndex, 1, nextPlayer);

			transaction.update(gameDocRef, {
				players: updatedPlayers,
				diceRolled: false,
				status: 'turn ended'
			});
		});
		console.log(`Turn Ended Successfully`);
	} catch (e) {
		console.log(`Turn failed to end! `, e);
	}
}

export async function saveScore(
	gameDocRef: DocumentReference | undefined,
	currentPlayerIndex: number,
	score: Score
) {
	try {
		if (!gameDocRef) {
			throw "`saveScore` didn't receive a gameDocRef!";
		}
		await runTransaction(db, async (transaction) => {
			const gameDoc = await transaction.get(gameDocRef);
			if (!gameDoc.exists()) {
				throw "Game doesn't exist!";
			}

			// get player
			const players: Player[] = gameDoc.data().players;
			const player = players[currentPlayerIndex];

			// save score to player
			player.score = score;

			players.splice(currentPlayerIndex, 1, player);

			transaction.update(gameDocRef, { players });
		});
		console.log(`Score Saved Successfully`);
	} catch (e) {
		console.log(`Score failed to save! `, e);
	}
}

export default {
	addPlayer,
	updatePlayer,
	removePlayer,
	startGame,
	rollDice,
	endTurn,
	saveScore
};
