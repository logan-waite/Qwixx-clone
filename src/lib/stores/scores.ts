import type { Color, ScoreRow } from '$lib/types';
import { writable } from 'svelte/store';

const initialScore: ScoreRow[] = [
	{
		color: 'red',
		selectedNumbers: [],
		locked: false
	},
	{
		color: 'yellow',
		selectedNumbers: [],
		locked: false
	},
	{
		color: 'green',
		selectedNumbers: [],
		locked: false
	},
	{
		color: 'blue',
		selectedNumbers: [],
		locked: false
	}
];

function createScore() {
	const { subscribe, update } = writable(initialScore);

	function selectNumber(color: Color, number: number) {
		update((scores) => {
			return scores.map((score) =>
				color === score.color
					? { ...score, selectedNumbers: [...score.selectedNumbers, number] }
					: score
			);
		});
	}

	return {
		subscribe,
		selectNumber
	};
}

export const scores = createScore();
