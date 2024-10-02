import View from "./view.js";
import Store from "./store.js";

const players = [
	{ id: 1, name: "Player 1", iconClass: "fa-x", colorClass: "turquoise" },
	{ id: 2, name: "Player 2", iconClass: "fa-o", colorClass: "yellow" },
];

function init() {
	const view = new View();
	const store = new Store(players);

	view.bindGameResetEvent((event) => {
		view.closeModal();
		view.clearMoves();

		store.reset();

		view.setTurnIndicator(store.game.currentPlayer);
		view.updateScoreboard(
			store.stats.playersWithStats[0].wins,
			store.stats.playersWithStats[1].wins,
			store.stats.ties
		);
	});

	view.bindNewRoundEvent((event) => {
		store.newRound();

		view.clearMoves();
		view.setTurnIndicator(store.game.currentPlayer);
		view.updateScoreboard(
			store.stats.playersWithStats[0].wins,
			store.stats.playersWithStats[1].wins,
			store.stats.ties
		);
	});

	view.bindPlayerMoveEvent((square) => {
		view.closeMenu();

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
		view.setTurnIndicator(store.game.currentPlayer);
	});
}

window.addEventListener("load", init);
