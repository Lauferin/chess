import "../Piece.css";
import { WHITE } from '../../../constants';
import blackQueen from './black_queen.svg'
import whiteQueen from './white_queen.svg'

const Queen = ({ row, column, pieceColor, handleCellClicked }) => {

	const queenImage = pieceColor === WHITE ? whiteQueen : blackQueen 
	return (
		<div className="piece-image"
			onClick={() => handleCellClicked(row, column, false)}
			onDragStart={() => handleCellClicked(row, column, true)}
		>
			<img src={queenImage} alt="queen" />
		</div>
	)

}

export default Queen