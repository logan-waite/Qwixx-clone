import type { Score, ScoreRow, BoxSelection } from '$lib/types';
import { writable } from 'svelte/store';
import { pipe, map, sumPlus } from '$lib/utils/base';

export const initialScore: Score = {
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

	function selectNumber({ color, value, willLock }: BoxSelection) {
		update((score) => {
			const newScoreRows = score.scoreRows.map((scoreRow) => {
				if (color === scoreRow.color) {
					const selectedNumbers = [...scoreRow.selectedNumbers, value];
					if (willLock) {
						selectedNumbers.push(-1);
						scoreRow.locked = true;
					}
					return { ...scoreRow, selectedNumbers };
				}

				return scoreRow;
			});
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

export const score = createScore();

export function calculateFinalScore(score: Score): number {
	const finalScore = pipe(
		map((row: ScoreRow) => row.selectedNumbers.reduce((total, _, i) => total + i + 1, 0)),
		sumPlus(score.passedTurns * -5)
	)(score.scoreRows);

	return finalScore;
}
