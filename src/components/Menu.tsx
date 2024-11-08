import { useState } from "react";
import classNames from "classnames";

type Props = any;

export default function Menu({ onResetClick, onNewRoundClick }: Props) {
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
					<button onClick={onResetClick}>Reset</button>
					<button onClick={onNewRoundClick}>New Round</button>
				</div>
			)}
		</div>
	);
}
