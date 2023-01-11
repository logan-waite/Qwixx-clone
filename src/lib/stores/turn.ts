import type { Color, BoxSelection } from '$lib/types';
import { writable } from 'svelte/store';
import { dice } from './dice';
import { scores } from './scores';

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
			const isMyTurn = false;

			if (turn.selectedWhiteValue == null && turn.selectedColorValue == null) {
				scores.passTurn();
			} else {
				turn.selectedWhiteValue != null && scores.selectNumber(turn.selectedWhiteValue);
				turn.selectedColorValue != null && scores.selectNumber(turn.selectedColorValue);

				// if the selected number locks a row
			}

			return { ...turn, selectedColorValue: null, selectedWhiteValue: null, isMyTurn };
		});
	}

	function startTurn() {
		update((turn) => {
			return { ...turn, isMyTurn: true };
		});
		dice.rollDice();
	}

	function makeSelection(
		selectingFor: 'white' | 'colored',
		selection: { color: Color; value: number } | null
	) {
		update((turn) => {
			let selectedWhiteValue = turn.selectedWhiteValue;
			let selectedColorValue = turn.selectedColorValue;

			switch (selectingFor) {
				case 'white':
					selectedWhiteValue = selection;
					break;
				case 'colored':
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
