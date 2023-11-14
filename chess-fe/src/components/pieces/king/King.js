import blackKing from './black_king.svg'
import whiteKing from './white_king.svg'

const King = ({ row, column, board, color, handleCellClicked }) => {

	const handleKingClicked = () => {
		const allowedMovements = [];
		if (column > 0) {
			if (row > 0 && board[row - 1][column - 1].valueColor !== "white" && !isCheck(row - 1, column - 1)) {
				allowedMovements.push([row - 1, column - 1])
			}
			if (row < 7 && board[row + 1][column - 1].valueColor !== "white" && !isCheck(row + 1, column - 1)) {
				allowedMovements.push([row + 1, column - 1])
			}
			if (board[row][column - 1].valueColor !== "white" && !isCheck(row, column - 1)) {
				allowedMovements.push([row, column - 1])
			}
		}
		if (column < 7) {
			if (row > 0 && board[row - 1][column + 1].valueColor !== "white" && !isCheck(row - 1, column + 1)) {
				allowedMovements.push([row - 1, column + 1])
			}
			if (row < 7 && board[row + 1][column + 1].valueColor !== "white" && !isCheck(row + 1, column + 1)) {
				allowedMovements.push([row + 1, column + 1])
			}
			if (board[row][column + 1].valueColor !== "white" && !isCheck(row, column + 1)) {
				allowedMovements.push([row, column + 1])
			}
		}
		if (row > 0 && !isCheck(row - 1, column)) {
			allowedMovements.push([row - 1, column])
		}
		if (row < 7 && !isCheck(row + 1, column)) {
			allowedMovements.push([row + 1, column])
		}
		handleCellClicked(row, column, allowedMovements)
	}

	const isCheck = (possibleRow, possibleColumn) => {

		// threatens from rook
		let i = possibleColumn; // move right
		while (i < 7) {
			++i;
			if (board[possibleRow][i].value !== null) {
				if (isRookOrQueen(board[possibleRow][i])) {
					return true;
				}
				break;
			}
		}
		i = possibleColumn; // move left
		while (i > 0) {
			--i;
			if (board[possibleRow][i].value !== null) {
				if (isRookOrQueen(board[possibleRow][i])) {
					return true;
				}
				break;
			}
		}
		i = possibleRow; // move backwards
		while (i < 7) {
			++i;
			if (board[i][possibleColumn].value !== null) {
				if (isRookOrQueen(board[i][possibleColumn])) {
					return true;
				}
				break;
			}
		}
		i = possibleRow; // move forward
		while (i > 0) {
			--i;
			if (board[i][possibleColumn].value !== null) {
				if (isRookOrQueen(board[i][possibleColumn])) {
					return true;
				}
				break;
			}
		}

		// threatens from bishop
		i = possibleRow; let j = possibleColumn; // move right backwards
		while (i < 7 && j < 7) {
			++i; ++j;
			if (board[i][j].value !== null) {
				if (isBishopOrQueen(board[i][j])) {
					return true;
				}
				break;
			}    
		}
		i = possibleRow; j = possibleColumn; // move right forward
		while (i > 0 && j < 7) {
			--i; ++j;
			console.log("aaa", possibleRow, possibleColumn, i, j)
			if (board[i][j].value !== null) {
				console.log("bbb")
				if (isBishopOrQueen(board[i][j])) {
					console.log("ccc")
					return true;
				}
				break;
			}    
		}
		i = possibleRow; j = possibleColumn; // move left backwards
		while (i < 7 && j > 0) {
			++i; --j;
			if (board[i][j].value !== null) {
				if (isBishopOrQueen(board[i][j])) {
					return true;
				}
				break;
			}    
		}
		i = possibleRow; j = possibleColumn; // move left forward
		while (i > 0 && j > 0) {
			--i; --j;
			if (board[i][j].value !== null) {
				if (isBishopOrQueen(board[i][j])) {
					return true;
				}
				break;
			}    
		}

		return false;
	}

	const isRookOrQueen = (position) => {
		return position.valueColor === "black" && (position.value === "rook" || position.value === "queen")
	}

	const isBishopOrQueen = (position) => {
		return position.valueColor === "black" && (position.value === "bishop" || position.value === "queen")
	}

	const kingImage = color === 'white' ? whiteKing : blackKing

	return (
		<div 
			onClick={() =>
				handleKingClicked()
			}
		>
			<img src={kingImage} alt="king" />
		</div>
	)

}

export default King