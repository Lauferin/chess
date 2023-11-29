import { WHITE } from '../../../constants';
import blackKing from './black_king.svg'
import whiteKing from './white_king.svg'

const King = ({ row, column, pieceColor, handleCellClicked }) => {

	const kingImage = pieceColor === WHITE ? whiteKing : blackKing
	return (
		<div 
			onClick={() => handleCellClicked(row, column, false)}
			onDragStart={() => handleCellClicked(row, column, true)}
		>
			<img src={kingImage} alt="king" />
		</div>
	)

}

export default King