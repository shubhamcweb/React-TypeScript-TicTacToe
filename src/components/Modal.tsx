type Props = {
	message: string;
	onModalClick: any;
};

export default function Modal({ message, onModalClick }: Props) {
	return (
		<div className="modal">
			<div className="modal-content">
				<p>{message}</p>
				<button onClick={onModalClick}>Play again</button>
			</div>
		</div>
	);
}
