import blackRook from './black_rook.svg'
import whiteRook from './white_rook.svg'


const Rook = ({ row, column, board, color, handleCellClicked }) => {

    const handleRookClicked = () => {
        const allowedMovements = [];
        let i = column; // move right
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

    const rookImage = color === 'white' ? whiteRook : blackRook 
    return (
        <div 
            onClick={() =>
                handleRookClicked()
            }
        >
            <img src={rookImage} alt="rook" />
        </div>
    )

}

export default Rook
