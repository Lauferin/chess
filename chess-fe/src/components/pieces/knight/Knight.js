import blackKnight from './black_knight.svg'
import whiteKnight from './white_knight.svg'

const Knight = ({ row, column, board, color, player, handleCellClicked }) => {

	const handleKnightClicked = (dragging) => {
		const allowedMovements = [];
		if (row > 0) { // one forward, two right and left
			if (column < 6 && board[row - 1][column + 2].valueColor !== player) {
				allowedMovements.push([row - 1, column + 2])
			}
			if (column > 1 && board[row - 1][column - 1].valueColor !== player) {
				allowedMovements.push([row - 1, column - 2])
			}
			if (row > 1) { // two forward, right and left
				if (column < 7 && board[row - 2][column + 1].valueColor !== player) {
					allowedMovements.push([row - 2, column + 1])
				}
				if (column > 0 && board[row - 2][column - 1].valueColor !== player) {
					allowedMovements.push([row - 2, column - 1])
				}
			}
		}
		if (row < 7) { // one backwards, two right and left
			if (column < 6 && board[row + 1][column + 2].valueColor !== player) {
				allowedMovements.push([row + 1, column + 2])
			}
			if (column > 1 && board[row + 1][column - 2].valueColor !== player) {
				allowedMovements.push([row + 1, column - 2])
			}
			if (row < 6) { // two backwards, right and left
				if (column < 7 && board[row + 2][column + 1].valueColor !== player) {
					allowedMovements.push([row + 2, column + 1])
				}
				if (column > 0 && board[row + 2][column - 1].valueColor !== player) {
					allowedMovements.push([row + 2, column - 1])
				}
			}
		}
		handleCellClicked(row, column, allowedMovements, dragging)
	}

	const knightImage = color === 'white' ? whiteKnight : blackKnight 
	return (
		<div 
			onClick={() =>
				handleKnightClicked(false)
			}
			onDragStart={() =>
				handleKnightClicked(true)
			}
		>
			<img src={knightImage} alt="knight" />
		</div>
	)
}

export default Knight
