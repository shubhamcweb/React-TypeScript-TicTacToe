import { useState } from "react";
import Footer from "./components/Footer.tsx";
import Menu from "./components/Menu.tsx";
import Modal from "./components/Modal.tsx";
import Scoreboard from "./components/Scoreboard.tsx";
import Squares from "./components/Squares.tsx";
import Turns from "./components/Turns.tsx";

import type { Games } from "./types.ts";

export default function App() {
	const [game, setGame] = useState<Games>({
		moves: [],
		scores: { p1Wins: 0, p2Wins: 0, ties: 0 },
	});
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
		const updatedGame = { ...game };
		updatedGame.moves.push(squareId);
		setGame(updatedGame);
	}

	function handleResetEvent() {
		const updatedGame = { ...game };
		if (winner) {
			winner === 1 ? updatedGame.scores.p1Wins++ : updatedGame.scores.p2Wins++;
		} else if (updatedGame.moves.length === 9) {
			updatedGame.scores.ties++;
		}
		updatedGame.moves = [];

		setGame(updatedGame);
	}

	function handleNewRoundEvent() {
		const updatedGame = { ...game };
		updatedGame.moves = [];
		updatedGame.scores = { p1Wins: 0, p2Wins: 0, ties: 0 };
		setGame(updatedGame);
	}

	return (
		<>
			<main>
				<div className="grid">
					<Turns player={currentPlayer} />
					<Menu
						onResetClick={handleResetEvent}
						onNewRoundClick={handleNewRoundEvent}
					/>
					<Squares onSquareClick={handlePlayerMove} moves={game.moves} />
					<Scoreboard scores={game.scores} />
				</div>
			</main>
			<Footer />

			{isComplete() && (
				<Modal
					onModalClick={handleResetEvent}
					message={winner ? `Player ${winner} wins!` : `Tie game!`}
				/>
			)}
		</>
	);
}
