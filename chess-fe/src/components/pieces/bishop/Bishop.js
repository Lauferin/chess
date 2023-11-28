import blackBishop from './black_bishop.svg'
import whiteBishop from './white_bishop.svg'
import { WHITE, BLACK } from '../../../constants'

const Bishop = ({ row, column, board, pieceColor, playerColor, handleCellClicked }) => {

	const handleBishopClicked = (dragging) => {
		const opponentColor = playerColor === WHITE ? BLACK : WHITE;
		const allowedMovements = [];
		let i = row; let j = column; // move right backwards
		while (i < 7 && j < 7) {
			++i; ++j;
			if (board[i][j].value === null) {
				allowedMovements.push([i, j])
			} else {
				if (board[i][j].valueColor === opponentColor) {
					allowedMovements.push([i, j])
				}
				break;
			}    
		}
		i = row; j = column; // move right forward
		while (i > 0 && j < 7) {
			--i; ++j;
			if (board[i][j].value === null) {
				allowedMovements.push([i, j])
			} else {
				if (board[i][j].valueColor === opponentColor) {
					allowedMovements.push([i, j])
				}
				break;
			}    
		}
		i = row; j = column; // move left backwards
		while (i < 7 && j > 0) {
			++i; --j;
			if (board[i][j].value === null) {
				allowedMovements.push([i, j])
			} else {
				if (board[i][j].valueColor === opponentColor) {
					allowedMovements.push([i, j])
				}
				break;
			}    
		}
		i = row; j = column; // move left forward
		while (i > 0 && j > 0) {
			--i; --j;
			if (board[i][j].value === null) {
				allowedMovements.push([i, j])
			} else {
				if (board[i][j].valueColor === opponentColor) {
					allowedMovements.push([i, j])
				}
				break;
			}    
		}
		handleCellClicked(row, column, allowedMovements, dragging)
	}

	const bishopImage = pieceColor === WHITE ? whiteBishop : blackBishop 
	return (
		<div 
			onClick={() =>
				handleBishopClicked(false)
			}
			onDragStart={() =>
				handleBishopClicked(true)
			}
		>
			<img src={bishopImage} alt="bishop" />
		</div>
	)

}

export default Bishop