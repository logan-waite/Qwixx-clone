export type Color = 'yellow' | 'red' | 'blue' | 'green';

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export type Die = {
	value: DieValue;
	color: Color | 'white';
	pipColor: 'white' | 'black';
	locked: boolean;
};

export type ScoreRow = {
	color: Color;
	selectedNumbers: number[];
	locked: boolean;
};
