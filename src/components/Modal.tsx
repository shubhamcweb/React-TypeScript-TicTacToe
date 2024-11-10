type ModalProps = {
	message: string;
	onModalClick: (actionType?: "reset" | "newRound" | undefined) => void;
};

export default function Modal({ message, onModalClick }: ModalProps) {
	return (
		<div className="modal">
			<div className="modal-content">
				<p>{message}</p>
				<button onClick={() => onModalClick()}>Play again</button>
			</div>
		</div>
	);
}
