import blackKing from './black_king.svg'
import whiteKing from './white_king.svg'

const King = ({ row, column, board, color, handleCellClicked }) => {

    const handleKingClicked = () => {
        const allowedMovements = [];
        if (column > 0) {
            if (row > 0 && board[row - 1][column - 1].valueColor !== "white") {
                allowedMovements.push([row - 1, column - 1])
            }
            if (row < 7 && board[row + 1][column - 1].valueColor !== "white") {
                allowedMovements.push([row + 1, column - 1])
            }
            if (board[row][column - 1].valueColor !== "white") {
                allowedMovements.push([row, column - 1])
            }
        }
        if (column < 7) {
            if (row > 0 && board[row - 1][column + 1].valueColor !== "white") {
                allowedMovements.push([row - 1, column + 1])
            }
            if (row < 7 && board[row + 1][column + 1].valueColor !== "white") {
                allowedMovements.push([row + 1, column + 1])
            }
            if (board[row][column + 1].valueColor !== "white") {
                allowedMovements.push([row, column + 1])
            }
        }
        if (row > 0) {
            allowedMovements.push([row - 1, column])
        }
        if (row < 7) {
            allowedMovements.push([row + 1, column])
        }
        handleCellClicked(row, column, allowedMovements)
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