import type { Move, Player } from "./types";
import type { DerivedGame, DerivedStats } from "./store";

export default class View {
	$: Record<string, Element> = {};
	$$: Record<string, NodeListOf<Element>> = {};

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

	render(game: DerivedGame, stats: DerivedStats) {
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
	bindGameResetEvent(handler: EventListener) {
		this.$.resetBtn.addEventListener("click", handler);
		this.$.modalBtn.addEventListener("click", handler);
	}

	bindNewRoundEvent(handler: EventListener) {
		this.$.newRoundBtn.addEventListener("click", handler);
	}

	bindPlayerMoveEvent(handler: (el: Element) => void) {
		this.#delegate(this.$.grid, '[data-id="square"]', "click", handler);
	}

	/**
	 * DOM helper methods
	 */
	#toggleMenu() {
		this.$.menuItems.classList.toggle("hidden");
		this.$.menuBtn.classList.toggle("border");

		const icon = this.#qs("i", this.$.menuBtn);

		icon.classList.toggle("fa-chevron-down");
		icon.classList.toggle("fa-chevron-up");
	}

	#handlePlayerMove(squareEl: Element, player: Player) {
		const icon = document.createElement("i");
		icon.classList.add("fa-solid", player.iconClass, player.colorClass);

		squareEl.replaceChildren(icon);
	}

	#initializeMoves(moves: Move[]) {
		this.$$.squares.forEach((square) => {
			const existingMove = moves.find((move) => move.squareID === +square.id);

			if (existingMove) {
				this.#handlePlayerMove(square, existingMove.player);
			}
		});
	}

	#openModal(winner: Player | null) {
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

	#setTurnIndicator(player: Player) {
		const icon = document.createElement("i");
		const label = document.createElement("p");

		icon.classList.add("fa-solid", player.iconClass, player.colorClass);
		label.textContent = `${player.name}, you're up!`;
		label.classList.add(player.colorClass);

		this.$.turn.replaceChildren(icon, label);
	}

	#updateScoreboard(p1Wins: number, p2Wins: number, ties: number) {
		this.$.p1Wins.textContent = `${p1Wins} wins`;
		this.$.p2Wins.textContent = `${p2Wins} wins`;
		this.$.ties.textContent = `${ties}`;
	}

	#qs(selector: string, parent?: Element) {
		const el = parent
			? parent.querySelector(selector)
			: document.querySelector(selector);

		if (!el) throw new Error("Could not find element");

		return el;
	}

	#qsAll(selector: string) {
		const elList = document.querySelectorAll(selector);

		if (!elList) throw new Error("Could not find elements");

		return elList;
	}

	#delegate(
		el: Element,
		selector: string,
		eventKey: string,
		handler: (el: Element) => void
	) {
		el.addEventListener(eventKey, (event) => {
			if (!(event.target instanceof Element)) {
				throw new Error("Event target not found");
			}
			if (event.target.matches(selector)) {
				handler(event.target);
			}
		});
	}
}
