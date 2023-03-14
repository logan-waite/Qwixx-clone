import type { BoxSelection } from '$lib/types';
import { objectsAreEqual } from '$lib/utils/base';
import { writable } from 'svelte/store';
import { dice } from './dice';
import { score } from './score';

type Turn = {
	isMyTurn: boolean;
	selectedWhiteValue: BoxSelection | null;
	selectedColorValue: BoxSelection | null;
	turnPassed: boolean;
};

const initialTurn: Turn = {
	isMyTurn: false,
	selectedWhiteValue: null,
	selectedColorValue: null,
	turnPassed: false
};

function createTurn() {
	const { subscribe, update } = writable(initialTurn);

	function endTurn() {
		update((turn) => {
			if (turn.selectedWhiteValue == null && turn.selectedColorValue == null) {
				score.passTurn();
			} else if (
				objectsAreEqual(turn.selectedWhiteValue, turn.selectedColorValue) &&
				turn.selectedWhiteValue !== null
			) {
				score.selectNumber(turn.selectedWhiteValue);
			} else {
				turn.selectedWhiteValue != null && score.selectNumber(turn.selectedWhiteValue);
				turn.selectedColorValue != null && score.selectNumber(turn.selectedColorValue);
			}

			return { ...turn, selectedColorValue: null, selectedWhiteValue: null, isMyTurn: false };
		});
	}

	function startTurn() {
		update((turn) => {
			return { ...turn, isMyTurn: true };
		});
	}

	function makeSelection(selectingFor: 'white' | 'color', selection: BoxSelection | null) {
		update((turn) => {
			let selectedWhiteValue = turn.selectedWhiteValue;
			let selectedColorValue = turn.selectedColorValue;

			switch (selectingFor) {
				case 'white':
					selectedWhiteValue = selection;
					break;
				case 'color':
					selectedColorValue = selection;
					break;
			}

			return { ...turn, selectedColorValue, selectedWhiteValue };
		});
	}

	function setPassTurn(turnPassed: boolean) {
		update((turn) => {
			return { ...turn, turnPassed };
		});
	}

	return {
		subscribe,
		endTurn,
		startTurn,
		makeSelection,
		setPassTurn
	};
}

export const turn = createTurn();
