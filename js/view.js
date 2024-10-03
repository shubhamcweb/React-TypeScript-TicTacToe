export default class View {
	$ = {};
	$$ = {};

	constructor() {
		// Single elements
		this.$.menu = this.#qs('[data-id="menu"]');
		this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
		this.$.menuItems = this.#qs('[data-id="menu-items"]');
		this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
		this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
		this.$.modal = this.#qs('[data-id="modal"]');
		this.$.modalText = this.#qs('[data-id="modal-text"]');
		this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
		this.$.turn = this.#qs('[data-id="turn"]');
		this.$.p1Wins = this.#qs('[data-id="p1-wins"]');
		this.$.p2Wins = this.#qs('[data-id="p2-wins"]');
		this.$.ties = this.#qs('[data-id="ties"]');
		this.$.grid = this.#qs('[data-id="grid"]');

		// Element lists
		this.$$.squares = this.#qsAll('[data-id="square"]');

		// UI-only event listeners
		this.$.menu.addEventListener("click", () => {
			this.#toggleMenu();
		});
	}

	render(game, stats) {
		const { playersWithStats, ties } = stats;
		const {
			moves,
			currentPlayer,
			status: { isComplete, winner },
		} = game;

		this.#closeAll();
		this.#clearMoves();
		this.#updateScoreboard(
			playersWithStats[0].wins,
			playersWithStats[1].wins,
			ties
		);
		this.#initializeMoves(moves);

		if (isComplete) {
			this.#openModal(winner);
			return;
		}

		this.#setTurnIndicator(currentPlayer);
	}

	/**
	 * Register all event listeners
	 */
	bindGameResetEvent(handler) {
		this.$.resetBtn.addEventListener("click", handler);
		this.$.modalBtn.addEventListener("click", handler);
	}

	bindNewRoundEvent(handler) {
		this.$.newRoundBtn.addEventListener("click", handler);
	}

	bindPlayerMoveEvent(handler) {
		this.#delegate(this.$.grid, '[data-id="square"]', "click", handler);
	}

	/**
	 * DOM helper methods
	 */
	#toggleMenu() {
		this.$.menuItems.classList.toggle("hidden");
		this.$.menuBtn.classList.toggle("border");

		const icon = this.$.menuBtn.querySelector("i");

		icon.classList.toggle("fa-chevron-down");
		icon.classList.toggle("fa-chevron-up");
	}

	#handlePlayerMove(squareEl, player) {
		const icon = document.createElement("i");
		icon.classList.add("fa-solid", player.iconClass, player.colorClass);

		squareEl.replaceChildren(icon);
	}

	#initializeMoves(moves) {
		this.$$.squares.forEach((square) => {
			const existingMove = moves.find((move) => move.squareID === +square.id);

			if (existingMove) {
				this.#handlePlayerMove(square, existingMove.player);
			}
		});
	}

	#openModal(winner) {
		this.$.modal.classList.remove("hidden");
		this.$.modalText.textContent =
			winner !== null ? `${winner.name} wins!` : "Tie game!";
	}

	#closeAll() {
		if (!this.$.menuItems.classList.contains("hidden")) {
			this.#toggleMenu();
		}
		this.$.modal.classList.add("hidden");
	}

	#clearMoves() {
		this.$$.squares.forEach((square) => square.replaceChildren());
	}

	#setTurnIndicator(player) {
		const icon = document.createElement("i");
		const label = document.createElement("p");

		icon.classList.add("fa-solid", player.iconClass, player.colorClass);
		label.textContent = `${player.name}, you're up!`;
		label.classList.add(player.colorClass);

		this.$.turn.replaceChildren(icon, label);
	}

	#updateScoreboard(p1Wins, p2Wins, ties) {
		this.$.p1Wins.textContent = `${p1Wins} wins`;
		this.$.p2Wins.textContent = `${p2Wins} wins`;
		this.$.ties.textContent = ties;
	}

	#qs(selector, parent) {
		const el = parent
			? parent.querySelector(selector)
			: document.querySelector(selector);

		if (!el) throw new Error("Could not find element");

		return el;
	}

	#qsAll(selector) {
		const elList = document.querySelectorAll(selector);

		if (!elList) throw new Error("Could not find elements");

		return elList;
	}

	#delegate(el, selector, eventKey, handler) {
		el.addEventListener(eventKey, (event) => {
			if (event.target.matches(selector)) {
				handler(event.target);
			}
		});
	}
}
