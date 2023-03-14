import { writable } from 'svelte/store';
import { randomDieNumber } from '$lib/utils/game';
import type { Die } from '$lib/types';

const diceList: Die[] = [
	{ value: 1, color: 'white', pipColor: 'black' }, //, locked: false },
	{ value: 2, color: 'white', pipColor: 'black' }, //, locked: false },
	{ value: 3, color: 'yellow', pipColor: 'black' }, //, locked: false },
	{ value: 4, color: 'red', pipColor: 'white' }, //, locked: false },
	{ value: 5, color: 'green', pipColor: 'white' }, //, locked: false },
	{ value: 6, color: 'blue', pipColor: 'white' } //, locked: false }
];

function createDice() {
	const { subscribe, update } = writable(diceList);

	const rollDice = () => {
		update((dice) => dice.map((die) => ({ ...die, value: randomDieNumber() })));
	};

	return {
		subscribe,
		rollDice
	};
}

export const dice = createDice();
