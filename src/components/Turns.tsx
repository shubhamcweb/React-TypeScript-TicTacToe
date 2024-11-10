import classNames from "classnames";

export default function Turns({ player }: { player: number }) {
	return (
		<div className="turn">
			<i
				className={classNames(
					"fa-solid",
					player % 2 ? "fa-x turquoise" : "fa-o yellow"
				)}
			></i>
			<p className={classNames(player % 2 ? "turquoise" : "yellow")}>
				Player {player}, you're up!
			</p>
		</div>
	);
}
