import blackBishop from './black_bishop.svg'
import whiteBishop from './white_bishop.svg'

const Bishop = ({ row, column, board, color, player, handleCellClicked }) => {

	const handleBishopClicked = () => {
		const opponent = player === "white" ? "black" : "white";
		const allowedMovements = [];
		let i = row; let j = column; // move right backwards
		while (i < 7 && j < 7) {
			++i; ++j;
			if (board[i][j].value === null) {
				allowedMovements.push([i, j])
			} else {
				if (board[i][j].valueColor === opponent) {
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
				if (board[i][j].valueColor === opponent) {
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
				if (board[i][j].valueColor === opponent) {
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
				if (board[i][j].valueColor === opponent) {
					allowedMovements.push([i, j])
				}
				break;
			}    
		}
		handleCellClicked(row, column, allowedMovements)
	}

	const bishopImage = color === 'white' ? whiteBishop : blackBishop 
	return (
		<div 
			onClick={() =>
				handleBishopClicked()
			}
		>
			<img src={bishopImage} alt="bishop" />
		</div>
	)

}

export default Bishop