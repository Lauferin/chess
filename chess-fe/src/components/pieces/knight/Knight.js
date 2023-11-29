import { WHITE } from '../../../constants';
import blackKnight from './black_knight.svg'
import whiteKnight from './white_knight.svg'

const Knight = ({ row, column, pieceColor, handleCellClicked }) => {

	const knightImage = pieceColor === WHITE ? whiteKnight : blackKnight 
	return (
		<div 
			onClick={() => handleCellClicked(row, column, false)}
			onDragStart={() => handleCellClicked(row, column, true)}
		>
			<img src={knightImage} alt="knight" />
		</div>
	)
}

export default Knight
