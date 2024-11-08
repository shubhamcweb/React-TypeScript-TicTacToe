import classNames from "classnames";

type Props = any;

export default function Squares({ onSquareClick, moves }: Props) {
	return (
		<>
			{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
				const player = moves.includes(squareId)
					? (moves.indexOf(squareId) % 2) + 1
					: null;

				return (
					<div
						key={squareId}
						className="square shadow"
						onClick={() => onSquareClick(squareId)}
					>
						{player && (
							<i
								className={classNames(
									"fa-solid",
									player % 2 ? "fa-x turquoise" : "fa-o yellow"
								)}
							></i>
						)}
					</div>
				);
			})}
		</>
	);
}
