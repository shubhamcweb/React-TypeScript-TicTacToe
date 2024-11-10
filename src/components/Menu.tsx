import { useState } from "react";
import classNames from "classnames";

type Props = any;

export default function Menu({ onResetActionClick }: Props) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
			<button className="menu-btn">
				Actions
				<i
					className={classNames(
						"fa-solid",
						menuOpen ? "fa-chevron-up" : "fa-chevron-down"
					)}
				></i>
			</button>

			{menuOpen && (
				<div className="menu-items border">
					<button onClick={() => onResetActionClick("reset")}>Reset</button>
					<button onClick={() => onResetActionClick("newRound")}>
						New Round
					</button>
				</div>
			)}
		</div>
	);
}
