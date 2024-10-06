export type Player = {
	id: number;
	name: string;
	iconClass: string;
	colorClass: string;
};

export type Move = {
	squareID: number;
	player: Player;
};

export type GameStatus = {
	isComplete: boolean;
	winner: Player | null;
};

export type Game = {
	moves: Move[];
	status: GameStatus;
};

export type GameState = {
	currentGameMoves: Move[];
	currentRoundGames: Game[];
};

export type InitialState = {
	currentGameMoves: never[];
	currentRoundGames: never[];
};
