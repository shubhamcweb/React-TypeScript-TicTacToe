import View from "./view.js";
import Store from "./store.js";

const players = [
	{ id: 1, name: "Player 1", iconClass: "fa-x", colorClass: "turquoise" },
	{ id: 2, name: "Player 2", iconClass: "fa-o", colorClass: "yellow" },
];

function init() {
	const view = new View();
	const store = new Store("t3-storage-key", players);

	function initView() {
		view.closeModal();
		view.closeMenu();
		view.clearMoves();
		view.setTurnIndicator(store.game.currentPlayer);
		view.updateScoreboard(
			store.stats.playersWithStats[0].wins,
			store.stats.playersWithStats[1].wins,
			store.stats.ties
		);
		view.initializeMoves(store.game.moves);
	}

	if (store.game.status.isComplete) store.reset();
	initView();

	window.addEventListener("storage", () => {
		initView();
		if (store.game.status.isComplete) {
			view.openModal(store.game.status.winner);
		}
		console.log("State changed from the other tab.");
	});

	view.bindGameResetEvent(() => {
		store.reset();
		initView();
	});

	view.bindNewRoundEvent(() => {
		store.newRound();
		initView();
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
