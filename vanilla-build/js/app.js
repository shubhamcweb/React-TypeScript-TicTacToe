import View from "./view.js";
import Store from "./store.js";

const players = [
	{ id: 1, name: "Player 1", iconClass: "fa-x", colorClass: "turquoise" },
	{ id: 2, name: "Player 2", iconClass: "fa-o", colorClass: "yellow" },
];

function init() {
	const view = new View();
	const store = new Store("t3-storage-key", players);

	// First load of the document
	view.render(store.game, store.stats);

	// Current tab state changes
	store.addEventListener("statechange", () =>
		view.render(store.game, store.stats)
	);

	// Different tab state changes
	window.addEventListener("storage", () => {
		view.render(store.game, store.stats);
		console.log("State changed from the other tab.");
	});

	view.bindGameResetEvent(() => {
		store.reset();
	});

	view.bindNewRoundEvent(() => {
		store.newRound();
	});

	view.bindPlayerMoveEvent((square) => {
		const existingMove = store.game.moves.find(
			(move) => move.squareID === +square.id
		);

		if (existingMove) return;

		store.playerMove(+square.id);
	});
}

window.addEventListener("load", init);
