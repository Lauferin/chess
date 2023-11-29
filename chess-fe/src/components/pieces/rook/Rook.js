import { WHITE } from '../../../constants';
import blackRook from './black_rook.svg'
import whiteRook from './white_rook.svg'

const Rook = ({ row, column, pieceColor, handleCellClicked }) => {

    const rookImage = pieceColor === WHITE ? whiteRook : blackRook 
    return (
        <div
            onClick={() => handleCellClicked(row, column, false)}
			onDragStart={() => handleCellClicked(row, column, true)}
        >
            <img src={rookImage} alt="rook" />
        </div>
    )

}

export default Rook;
