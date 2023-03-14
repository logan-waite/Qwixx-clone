import type { BoxSelection, Color, DieValue, Player, Score, ScoreRow } from '$lib/types';
import { objectsAreEqual, randomNumber } from '$lib/utils/base';

export function randomDieNumber(): DieValue {
	return randomNumber(1, 6) as DieValue;
}

export function getValueByColor(color: Color) {
	return function getValue<T extends { color: Color; value: number }>(container: T | T[] | null) {
		if (Array.isArray(container)) {
			const colorObj = container.find((v) => v.color === color);
			return colorObj?.value ?? null;
		} else if (container?.color && container.color === color) {
			return container.value;
		} else {
			return null;
		}
	};
}

type PlayerScoreValues = {
	whiteValue: BoxSelection | null;
	colorValue: BoxSelection | null;
};

function updateScoreRows(scoreRows: ScoreRow[], ...selections: Array<BoxSelection | null>) {
	return scoreRows.map((scoreRow) => {
		const selection = selections.find((s) => s?.color === scoreRow.color);
		if (selection) {
			const { value, willLock } = selection;
			const selectedNumbers = [...scoreRow.selectedNumbers, value];
			if (willLock) {
				selectedNumbers.push(-1);
				scoreRow.locked = true;
			}
			return { ...scoreRow, selectedNumbers };
		}

		return scoreRow;
	});
}

export function updatePlayerScore(
	score: Score,
	{ whiteValue, colorValue }: PlayerScoreValues
): Score {
	if (whiteValue == null && colorValue == null) {
		return { ...score, passedTurns: score.passedTurns + 1 };
	} else if (objectsAreEqual(whiteValue, colorValue) && whiteValue !== null) {
		const newScoreRows = updateScoreRows(score.scoreRows, whiteValue);
		return { ...score, scoreRows: newScoreRows };
	} else {
		const newScoreRows = updateScoreRows(score.scoreRows, whiteValue, colorValue);
		return { ...score, scoreRows: newScoreRows };
	}
}
