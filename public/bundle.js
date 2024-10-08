// src/view.ts
class View {
  $ = {};
  $$ = {};
  constructor() {
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
    this.$$.squares = this.#qsAll('[data-id="square"]');
    this.$.menu.addEventListener("click", () => {
      this.#toggleMenu();
    });
  }
  render(game, stats) {
    const { playersWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner }
    } = game;
    this.#closeAll();
    this.#clearMoves();
    this.#updateScoreboard(playersWithStats[0].wins, playersWithStats[1].wins, ties);
    this.#initializeMoves(moves);
    if (isComplete) {
      this.#openModal(winner);
      return;
    }
    this.#setTurnIndicator(currentPlayer);
  }
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
  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menuBtn.classList.toggle("border");
    const icon = this.#qs("i", this.$.menuBtn);
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
    this.$.modalText.textContent = winner !== null ? `${winner.name} wins!` : "Tie game!";
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
    this.$.ties.textContent = `${ties}`;
  }
  #qs(selector, parent) {
    const el = parent ? parent.querySelector(selector) : document.querySelector(selector);
    if (!el)
      throw new Error("Could not find element");
    return el;
  }
  #qsAll(selector) {
    const elList = document.querySelectorAll(selector);
    if (!elList)
      throw new Error("Could not find elements");
    return elList;
  }
  #delegate(el, selector, eventKey, handler) {
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

// src/store.ts
var initialValue = {
  currentGameMoves: [],
  currentRoundGames: []
};

class Store extends EventTarget {
  storageKey;
  players;
  constructor(storageKey, players) {
    super();
    this.storageKey = storageKey;
    this.players = players;
  }
  playerMove(squareID) {
    const stateClone = structuredClone(this.#getState());
    stateClone.currentGameMoves.push({
      squareID,
      player: this.game.currentPlayer
    });
    this.#saveState(stateClone);
  }
  get game() {
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
      [7, 8, 9]
    ];
    let winner = null;
    for (const player of this.players) {
      const selectedSquareIDs = state.currentGameMoves.filter((move) => move.player.id === player.id).map((move) => move.squareID);
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
        winner
      }
    };
  }
  get stats() {
    const state = this.#getState();
    return {
      playersWithStats: this.players.map((player) => {
        const wins = state.currentRoundGames.filter((game) => game.status.winner?.id === player.id).length || 0;
        return {
          ...player,
          wins
        };
      }),
      ties: state.currentRoundGames.filter((game) => game.status.winner === null).length
    };
  }
  reset() {
    const stateClone = structuredClone(this.#getState());
    const { moves, status } = this.game;
    if (status.isComplete) {
      stateClone.currentRoundGames.push({
        moves,
        status
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
    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event("statechange"));
  }
  #getState() {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialValue;
  }
}

// src/app.ts
function init() {
  const view = new View;
  const store = new Store("t3-storage-key", players);
  view.render(store.game, store.stats);
  store.addEventListener("statechange", () => view.render(store.game, store.stats));
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
    const existingMove = store.game.moves.find((move) => move.squareID === +square.id);
    if (existingMove)
      return;
    store.playerMove(+square.id);
  });
}
var players = [
  { id: 1, name: "Player 1", iconClass: "fa-x", colorClass: "turquoise" },
  { id: 2, name: "Player 2", iconClass: "fa-o", colorClass: "yellow" }
];
window.addEventListener("load", init);
