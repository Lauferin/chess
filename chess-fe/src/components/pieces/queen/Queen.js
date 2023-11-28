import { BLACK, WHITE } from '../../../constants';
import blackQueen from './black_queen.svg'
import whiteQueen from './white_queen.svg'

const Queen = ({ row, column, board, pieceColor, playerColor, handleCellClicked }) => {

	const handleQueenClicked = (dragging) => {
		const opponentColor = playerColor === WHITE ? BLACK : WHITE;
		const allowedMovements = [];

		// bishop movements
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

		// tower movements
		i = column; // move right
		while (i < 7) {
			++i;
			if (board[row][i].value === null) {
				allowedMovements.push([row, i])
			} else {
				if (board[row][i].valueColor === opponentColor) {
					allowedMovements.push([row, i])
				}
				break;
			}
		}
		i = column; // move left
		while (i > 0) {
			--i;
			if (board[row][i].value === null) {
				allowedMovements.push([row, i])
			} else {
				if (board[row][i].valueColor === opponentColor) {
					allowedMovements.push([row, i])
				}
				break;
			}
		}
		i = row; // move backwards
		while (i < 7) {
			++i;
			if (board[i][column].value === null) {
				allowedMovements.push([i, column])
			} else {
				if (board[i][column].valueColor === opponentColor) {
					allowedMovements.push([i, column])
				}
				break;
			}
		}
		i = row; // move forward
		while (i > 0) {
			--i;
			if (board[i][column].value === null) {
				allowedMovements.push([i, column])
			} else {
				if (board[i][column].valueColor === opponentColor) {
					allowedMovements.push([i, column])
				}
				break;
			}
		}

		handleCellClicked(row, column, allowedMovements, dragging)
	}

	const queenImage = pieceColor === WHITE ? whiteQueen : blackQueen 
	return (
		<div 
			onClick={() =>
				handleQueenClicked(false)
			}
			onDragStart={() =>
				handleQueenClicked(true)
			}
		>
			<img src={queenImage} alt="queen" />
		</div>
	)

}

export default Queen