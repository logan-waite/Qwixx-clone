import type { Color, ScoreRow, BoxSelection } from '$lib/types';
import { writable } from 'svelte/store';

type Score = {
	passedTurns: number;
	scoreRows: ScoreRow[];
};

const initialScore: Score = {
	passedTurns: 0,
	scoreRows: [
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
	]
};

function createScore() {
	const { subscribe, update } = writable(initialScore);

	function selectNumber({ color, value }: BoxSelection) {
		update((score) => {
			const newScoreRows = score.scoreRows.map((score) =>
				color === score.color
					? { ...score, selectedNumbers: [...score.selectedNumbers, value] }
					: score
			);
			return { ...score, scoreRows: newScoreRows };
		});
	}

	function passTurn() {
		update((score) => {
			return { ...score, passedTurns: score.passedTurns + 1 };
		});
	}

	return {
		subscribe,
		selectNumber,
		passTurn
	};
}

export const scores = createScore();
