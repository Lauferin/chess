import "../Piece.css";
import blackBishop from './black_bishop.svg'
import whiteBishop from './white_bishop.svg'
import { WHITE } from '../../../constants'

const Bishop = ({ row, column, pieceColor, handleCellClicked }) => {

	const bishopImage = pieceColor === WHITE ? whiteBishop : blackBishop 
	return (
		<div className="piece-image"
			onClick={() => handleCellClicked(row, column, false)}
			onDragStart={() => handleCellClicked(row, column, true)}
		>
			<img src={bishopImage} alt="bishop" />
		</div>
	)

}

export default Bishop