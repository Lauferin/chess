import { BLACK, WHITE } from '../../../constants';
import blackRook from './black_rook.svg'
import whiteRook from './white_rook.svg'


const Rook = ({ row, column, board, pieceColor, playerColor, handleCellClicked }) => {

    const handleRookClicked = (dragging) => {
		const opponentColor = playerColor === WHITE ? BLACK : WHITE;
        const allowedMovements = [];
        let i = column; // move right
        while (i < 7) {
            ++i;
            if (board[row][i].value === null) {
                allowedMovements.push([row, i]);
            } else {
                if (board[row][i].valueColor === opponentColor) {
                    allowedMovements.push([row, i]);
                }
                break;
            }
        }
        i = column; // move left
        while (i > 0) {
            --i;
            if (board[row][i].value === null) {
                allowedMovements.push([row, i]);
            } else {
                if (board[row][i].valueColor === opponentColor) {
                    allowedMovements.push([row, i]);
                }
                break;
            }
        }
        i = row; // move backwards
        while (i < 7) {
            ++i;
            if (board[i][column].value === null) {
                allowedMovements.push([i, column]);
            } else {
                if (board[i][column].valueColor === opponentColor) {
                    allowedMovements.push([i, column]);
                }
                break;
            }
        }
        i = row; // move forward
        while (i > 0) {
            --i;
            if (board[i][column].value === null) {
                allowedMovements.push([i, column]);
            } else {
                if (board[i][column].valueColor === opponentColor) {
                    allowedMovements.push([i, column]);
                }
                break;
            }
        }
        handleCellClicked(row, column, allowedMovements, dragging);
    }

    const rookImage = pieceColor === WHITE ? whiteRook : blackRook 
    return (
        <div 
            onClick={() =>
                handleRookClicked(false)
            }
			onDragStart={() =>
				handleRookClicked(true)
			}
        >
            <img src={rookImage} alt="rook" />
        </div>
    )

}

export default Rook;
