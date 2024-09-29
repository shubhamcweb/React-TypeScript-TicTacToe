const initialValue = {
	moves: [],
};

export default class Store {
	#state = initialValue;

	constructor(players) {
		this.players = players;
	}

	playerMove(squareID) {
		const state = this.#getState();

		const stateClone = structuredClone(state);

		stateClone.moves.push({
			squareID,
			player: this.game.currentPlayer,
		});

		this.#saveState(stateClone);
	}

	get game() {
		const state = this.#getState();

		const currentPlayer = this.players[state.moves.length % 2];

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
			const selectedSquareIDs = state.moves
				.filter((move) => move.player.id === player.id)
				.map((move) => move.squareID);

			for (const pattern of winningPatterns) {
				if (pattern.every((val) => selectedSquareIDs.includes(val))) {
					winner = player;
				}
			}
		}

		return {
			moves: state.moves,
			currentPlayer,
			status: {
				isComplete: winner !== null || state.moves.length === 9,
				winner,
			},
		};
	}

	reset() {
		this.#saveState(initialValue);
	}

	#getState() {
		return this.#state;
	}

	#saveState(stateOrFn) {
		const prevState = this.#getState();

		let newState;

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

		this.#state = newState;
	}
}
