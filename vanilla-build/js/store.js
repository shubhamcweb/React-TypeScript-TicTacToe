const initialValue = {
	moves: [],
};

export default class Store {
	#state = initialValue;

	constructor() {}

	get game() {
		return "dummy value";
	}

	#getState() {
		return this.#state;
	}

	#saveState(stateOrFn) {
		const prevState = this.#getState;

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
