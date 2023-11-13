import blackQueen from './black_queen.svg'
import whiteQueen from './white_queen.svg'

const Queen = ({ row, column, board, color, handleCellClicked }) => {

    const handleQueenClicked = () => {
        const allowedMovements = [];

        // bishop movements
        let i = row; // move right backwards
        let j = column
        while (i < 7 && j < 7) {
            ++i;
            ++j;
            if (board[i][j].value === null) {
                allowedMovements.push([i, j])
            } else {
                if (board[i][j].valueColor === "black") {
                    allowedMovements.push([i, j])
                }
                break;
            }    
        }
        i = row; // move right forward
        j = column
        while (i > 0 && j < 7) {
            --i;
            ++j;
            if (board[i][j].value === null) {
                allowedMovements.push([i, j])
            } else {
                if (board[i][j].valueColor === "black") {
                    allowedMovements.push([i, j])
                }
                break;
            }    
        }
        i = row; // move left backwards
        j = column
        while (i < 7 && j > 0) {
            ++i;
            --j;
            if (board[i][j].value === null) {
                allowedMovements.push([i, j])
            } else {
                if (board[i][j].valueColor === "black") {
                    allowedMovements.push([i, j])
                }
                break;
            }    
        }
        i = row; // move left forward
        j = column
        while (i > 0 && j > 0) {
            --i;
            --j;
            if (board[i][j].value === null) {
                allowedMovements.push([i, j])
            } else {
                if (board[i][j].valueColor === "black") {
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
                if (board[row][i].valueColor === "black") {
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
                if (board[row][i].valueColor === "black") {
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
                if (board[i][column].valueColor === "black") {
                    allowedMovements.push([i, column])
                }
                break;
            }
        }
        i = row; // move forward
        while (i > 0) {
            --i;
            console.log(i, board[row][i].valueColor)
            if (board[i][column].value === null) {
                allowedMovements.push([i, column])
            } else {
                if (board[i][column].valueColor === "black") {
                    allowedMovements.push([i, column])
                }
                break;
            }
        }

        console.log("allowed", allowedMovements)
        handleCellClicked(row, column, allowedMovements)
    }

    const queenImage = color === 'white' ? whiteQueen : blackQueen 
    return (
        <div 
            onClick={() =>
                handleQueenClicked()
            }
        >
            <img src={queenImage} alt="queen" />
        </div>
    )

}

export default Queen