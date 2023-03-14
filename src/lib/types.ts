export type Color = 'yellow' | 'red' | 'blue' | 'green';

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export type Die = {
	value: DieValue;
	color: Color | 'white';
	pipColor: 'white' | 'black';
	// locked: boolean;
};

export type ScoreRow = {
	color: Color;
	selectedNumbers: number[];
	locked: boolean;
};

export type Score = {
	passedTurns: number;
	scoreRows: ScoreRow[];
};

export type BoxSelection = { color: Color; value: number; willLock: boolean };

export type Player = {
	id: string;
	name: string;
	score: Score;
	state: 'joined' | 'ready' | 'current turn';
	joinOrder: number;
	turnOrder: number;
};

export type SavedPlayer = Pick<Player, 'id' | 'name'>;

export type GameStatus = 'starting' | 'turn started' | 'turn ended' | 'ended';

export type GameState = {
	id: string;
	status: GameStatus;
	players: Array<Player>;
	diceRolled: boolean;
	diceRoll: Array<Die>;
};
