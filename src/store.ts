import type {
	Player,
	InitialState,
	GameState,
	Move,
	GameStatus,
} from "./types";

type playerWithWins = Player & { wins: number };

export type DerivedStats = {
	playersWithStats: playerWithWins[];
	ties: number;
};

export type DerivedGame = {
	moves: Move[];
	currentPlayer: Player;
	status: GameStatus;
};

const initialValue: InitialState = {
	currentGameMoves: [],
	currentRoundGames: [],
};

export default class Store extends EventTarget {
	constructor(
		private readonly storageKey: string,
		private readonly players: Player[]
	) {
		super();
	}

	playerMove(squareID: number) {
		const stateClone = structuredClone(this.#getState());

		stateClone.currentGameMoves.push({
			squareID,
			player: this.game.currentPlayer,
		});

		this.#saveState(stateClone);
	}

	get game(): DerivedGame {
		const state = this.#getState();

		const currentPlayer = this.players[state.currentGameMoves.length % 2];

		const winningPatterns = [
			[1, 2, 3],
			[1, 5, 9],
			[1, 4, 7],
			[2, 5, 8],
			[3, 5, 7],
			[3, 6, 9],
			[4, 5, 6],
			[7, 8, 9],
		];

		let winner = null;

		for (const player of this.players) {
			const selectedSquareIDs = state.currentGameMoves
				.filter((move) => move.player.id === player.id)
				.map((move) => move.squareID);

			for (const pattern of winningPatterns) {
				if (pattern.every((val) => selectedSquareIDs.includes(val))) {
					winner = player;
				}
			}
		}

		return {
			moves: state.currentGameMoves,
			currentPlayer,
			status: {
				isComplete: winner !== null || state.currentGameMoves.length === 9,
				winner,
			},
		};
	}

	get stats(): DerivedStats {
		const state = this.#getState();

		return {
			playersWithStats: this.players.map((player) => {
				const wins =
					state.currentRoundGames.filter(
						(game) => game.status.winner?.id === player.id
					).length || 0;

				return {
					...player,
					wins,
				};
			}),
			ties: state.currentRoundGames.filter(
				(game) => game.status.winner === null
			).length,
		};
	}

	reset() {
		const stateClone = structuredClone(this.#getState());

		const { moves, status } = this.game;

		if (status.isComplete) {
			stateClone.currentRoundGames.push({
				moves,
				status,
			});
		}

		stateClone.currentGameMoves = [];

		this.#saveState(stateClone);
	}

	newRound() {
		const stateClone = structuredClone(this.#getState());

		stateClone.currentGameMoves = [];
		stateClone.currentRoundGames = [];

		this.#saveState(stateClone);
	}

	#saveState(stateOrFn: GameState | ((prevState: GameState) => GameState)) {
		const prevState = this.#getState();

		let newState: GameState;

		switch (typeof stateOrFn) {
			case "object":
				newState = stateOrFn;
				break;
			case "function":
				newState = stateOrFn(prevState);
				break;
			default:
				throw new Error("Invalid argument passed to #saveState");
		}

		window.localStorage.setItem(this.storageKey, JSON.stringify(newState));

		this.dispatchEvent(new Event("statechange"));
	}

	#getState(): GameState {
		const item: string | null = window.localStorage.getItem(this.storageKey);
		return item ? (JSON.parse(item) as GameState) : initialValue;
	}
}
