import { writable } from 'svelte/store';
import { randomDieNumber } from '$lib/utils';
import type { Die } from '$lib/types';

const diceList: Die[] = [
	{ value: 2, color: 'white', pipColor: 'black', locked: false },
	{ value: 1, color: 'white', pipColor: 'black', locked: false },
	{ value: 4, color: 'yellow', pipColor: 'black', locked: false },
	{ value: 3, color: 'red', pipColor: 'white', locked: false },
	{ value: 6, color: 'green', pipColor: 'white', locked: false },
	{ value: 5, color: 'blue', pipColor: 'white', locked: false }
];

function createDice() {
	const { subscribe, set, update } = writable(diceList);

	const rollDice = () => {
		update((dice) => dice.map((die) => ({ ...die, value: randomDieNumber() })));
	};

	return {
		subscribe,
		rollDice
	};
}

export const dice = createDice();
