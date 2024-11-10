import type { Scores } from "../App.tsx";

export default function Scoreboard({ scores }: { scores: Scores }) {
	return (
		<>
			<div
				className="score shadow"
				style={{ backgroundColor: "var(--turquoise)" }}
			>
				<p>Player 1</p>
				<span>{scores.p1Wins} wins</span>
			</div>
			<div
				className="score shadow"
				style={{ backgroundColor: "var(--light-gray)" }}
			>
				<p>Ties</p>
				<span>{scores.ties}</span>
			</div>
			<div
				className="score shadow"
				style={{ backgroundColor: "var(--yellow)" }}
			>
				<p>Player 2</p>
				<span>{scores.p2Wins} wins</span>
			</div>
		</>
	);
}
