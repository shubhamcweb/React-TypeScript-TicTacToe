import View from "./view.js";
import Store from "./store.js";

const App = {
	$: {
		menu: document.querySelector('[data-id="menu"]'),
		menuBtn: document.querySelector('[data-id="menu-btn"]'),
		menuItems: document.querySelector('[data-id="menu-items"]'),
		resetBtn: document.querySelector('[data-id="reset-btn"]'),
		newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
		squares: document.querySelectorAll('[data-id="squares"]'),
		modal: document.querySelector('[data-id="modal"]'),
		modalText: document.querySelector('[data-id="modal-text"]'),
		modalBtn: document.querySelector('[data-id="modal-btn"]'),
		turn: document.querySelector('[data-id="turn"]'),
	},

	state: {
		moves: [],
	},

	getGameStatus(moves) {
		const p1Moves = moves
			.filter((move) => move.playerID === 1)
			.map((move) => move.squareID);
		const p2Moves = moves
			.filter((move) => move.playerID === 2)
			.map((move) => move.squareID);

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

		winningPatterns.forEach((pattern) => {
			const p1Wins = pattern.every((val) => p1Moves.includes(val));
			const p2Wins = pattern.every((val) => p2Moves.includes(val));

			if (p1Wins) winner = 1;
			if (p2Wins) winner = 2;
		});

		return {
			status:
				moves.length === 9 || winner !== null ? "complete" : "in-progress",
			winner,
		};
	},

	init() {
		App.registerEventListners();
	},

	registerEventListners() {
		// actions menu toggle
		App.$.menu.addEventListener("click", () => {
			App.$.menuItems.classList.toggle("hidden");
			App.$.menuBtn.classList.toggle("border");
		});

		// TODO
		App.$.resetBtn.addEventListener("click", () => {
			console.log("reset-btn was clicked");
		});

		// TODO
		App.$.newRoundBtn.addEventListener("click", () => {
			console.log("new-round-btn was clicked");
		});

		App.$.modalBtn.addEventListener("click", () => {
			App.state.moves = [];
			App.$.squares.forEach((square) => square.replaceChildren());
			App.$.modal.classList.add("hidden");
		});

		App.$.squares.forEach((square) => {
			square.addEventListener("click", () => {
				// Check if there's already a play, if so, return early
				const hasMove = (squareID) => {
					const existingMove = App.state.moves.find(
						(move) => move.squareID === squareID
					);
					return existingMove !== undefined;
				};

				if (hasMove(+square.id)) return;

				// Determine which player icon to add to the square
				const lastMove = App.state.moves.at(-1);
				const getOppositePlayer = (playerID) => (playerID === 1 ? 2 : 1);
				const currentPlayer =
					App.state.moves.length === 0
						? 1
						: getOppositePlayer(lastMove.playerID);
				const nextPlayer = getOppositePlayer(currentPlayer);

				const squareIcon = document.createElement("i");
				const turnIcon = document.createElement("i");
				const turnLabel = document.createElement("p");
				turnLabel.textContent = `Player ${nextPlayer}, you're up!`;

				if (currentPlayer === 1) {
					squareIcon.classList.add("fa-solid", "fa-x", "turquoise");
					turnIcon.classList.add("fa-solid", "fa-o");
					App.$.turn.classList.replace("turquoise", "yellow");
				} else {
					squareIcon.classList.add("fa-solid", "fa-o", "yellow");
					turnIcon.classList.add("fa-solid", "fa-x");
					App.$.turn.classList.replace("yellow", "turquoise");
				}

				App.$.turn.replaceChildren(turnIcon, turnLabel);

				App.state.moves.push({
					squareID: +square.id,
					playerID: currentPlayer,
				});

				square.appendChild(squareIcon);

				// Check for a winner or tie game
				const game = App.getGameStatus(App.state.moves);

				let msg = "";
				if (game.status === "complete") {
					if (game.winner) {
						msg = `Player ${game.winner} wins!`;
					} else {
						msg = `Tie game!`;
					}
					App.$.modalText.textContent = msg;
					App.$.modal.classList.remove("hidden");
				}
			});
		});
	},
};

// window.addEventListener("load", App.init);

const players = [
	{ id: 1, name: "Player 1", iconClass: "fa-x", colorClass: "turquoise" },
	{ id: 2, name: "Player 2", iconClass: "fa-o", colorClass: "yellow" },
];

function init() {
	const view = new View();
	const store = new Store(players);

	console.log(store.game);

	view.bindGameResetEvent((event) => {
		view.closeModal();
		view.clearMoves();

		store.reset();

		view.setTurnIndicator(store.game.currentPlayer);
	});

	view.bindNewRoundEvent((event) => {
		console.log("New Round Event");
		console.log(event);
	});

	view.bindPlayerMoveEvent((square) => {
		const existingMove = store.game.moves.find(
			(move) => move.squareID === +square.id
		);

		if (existingMove) return;

		// Place icon of the current player on the square
		view.handlePlayerMove(square, store.game.currentPlayer);

		// Advance to the next state by pushing a move to the moves array
		store.playerMove(+square.id);

		if (store.game.status.isComplete) {
			view.openModal(store.game.status.winner);
			return;
		}

		// Set the next player's turn indicator
		view.setTurnIndicator(store.game.currentPlayer); // this is the updated current player
	});
}

window.addEventListener("load", init);
