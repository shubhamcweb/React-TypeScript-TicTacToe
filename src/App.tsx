import { useEffect, useState } from "react";
import Footer from "./components/Footer.tsx";
import Menu from "./components/Menu.tsx";
import Modal from "./components/Modal.tsx";
import Scoreboard from "./components/Scoreboard.tsx";
import Squares from "./components/Squares.tsx";
import Turns from "./components/Turns.tsx";

import type { Games } from "./types.ts";

const initialValue = { moves: [], scores: { p1Wins: 0, p2Wins: 0, ties: 0 } };
const localStorageKey = "react-t3-storage-key";

export default function App() {
	const [game, setGame] = useState<Games>(() => {
		const savedGame = window.localStorage.getItem(localStorageKey);
		return savedGame ? JSON.parse(savedGame) : initialValue;
	});

	useEffect(() => {
		window.localStorage.setItem(localStorageKey, JSON.stringify(game));
	}, [game]);

	useEffect(() => {
		function handleStorageChange(event: StorageEvent) {
			if (event.key === localStorageKey) {
				const updatedGame = event.newValue ? JSON.parse(event.newValue) : game;
				setGame(updatedGame);
			}
		}
		window.addEventListener("storage", handleStorageChange);

		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	const currentPlayer = (game.moves.length % 2) + 1;
	let winner: number | null = null;

	function isComplete(): boolean {
		if (game.moves.length === 9) {
			return true;
		}

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

		const p1Moves = game.moves.filter((_, index) => index % 2 === 0);
		const p2Moves = game.moves.filter((_, index) => index % 2 === 1);

		[p1Moves, p2Moves].forEach((playerMoves) => {
			for (const pattern of winningPatterns) {
				if (pattern.every((val) => playerMoves.includes(val))) {
					winner = playerMoves === p1Moves ? 1 : 2;
				}
			}
		});

		return winner ? true : false;
	}

	function handlePlayerMove(squareId: number): void {
		if (game.moves.includes(squareId)) {
			return;
		}
		const updatedGame = structuredClone(game);
		updatedGame.moves.push(squareId);
		setGame(updatedGame);
	}

	function handleResetAction(actionType?: "reset" | "newRound"): void {
		if (actionType === "newRound") {
			setGame(initialValue);
			return;
		}

		const updatedGame = structuredClone(game);

		updatedGame.moves = [];

		if (winner === 1) {
			updatedGame.scores.p1Wins++;
		} else if (winner === 2) {
			updatedGame.scores.p2Wins++;
		} else if (game.moves.length === 9) {
			updatedGame.scores.ties++;
		}

		setGame(updatedGame);
	}

	return (
		<>
			<main>
				<div className="grid">
					<Turns player={currentPlayer} />
					<Menu onResetActionClick={handleResetAction} />
					<Squares onSquareClick={handlePlayerMove} moves={game.moves} />
					<Scoreboard scores={game.scores} />
				</div>
			</main>
			<Footer />

			{isComplete() && (
				<Modal
					onModalClick={handleResetAction}
					message={winner ? `Player ${winner} wins!` : `Tie game!`}
				/>
			)}
		</>
	);
}
