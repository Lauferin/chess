import blackBishop from './black_bishop.svg'
import whiteBishop from './white_bishop.svg'

const Bishop = ({ row, column, board, color, handleCellClicked }) => {

    const handleBishopClicked = () => {
        const allowedMovements = [];
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
        console.log("allowed", allowedMovements)
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