import { BLACK, WHITE } from '../../../constants';
import blackPawn from './black_pawn.svg';
import whitePawn from './white_pawn.svg';


const Pawn = ({ row, column, board, pieceColor, playerColor, handleCellClicked }) => {

	const handlePawnClicked = (dragging) => {
		const opponentColor = playerColor === WHITE ? BLACK : WHITE;
		const allowedMovements = [];
		if (board[row - 1][column].value === null) {
			allowedMovements.push([row - 1, column]);
			if (row === 6 && board[row - 2][column].value === null) {
				allowedMovements.push([row - 2, column]);
			}
		}
		if (column > 0 && board[row - 1][column - 1].valueColor === opponentColor ) {
			allowedMovements.push([row - 1, column - 1]);
		}
		if (column < 7 && board[row - 1][column + 1].valueColor === opponentColor ) {
			allowedMovements.push([row - 1, column + 1]);
		}
		// add rule of crazy pawn
		handleCellClicked(row, column, allowedMovements, dragging);
	}

	const pawnImage = pieceColor === WHITE ? whitePawn : blackPawn 
	return (
		<div 
			onClick={() =>
				handlePawnClicked(false)
			}
			onDragStart={() =>
				handlePawnClicked(true)
			}
		>
			<img src={pawnImage} alt="pawn" />
		</div>
	)

}

export default Pawn
