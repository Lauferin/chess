import { WHITE } from '../../../constants';
import blackPawn from './black_pawn.svg';
import whitePawn from './white_pawn.svg';

const Pawn = ({ row, column, pieceColor, handleCellClicked }) => {

	const pawnImage = pieceColor === WHITE ? whitePawn : blackPawn 
	return (
		<div 
			onClick={() => handleCellClicked(row, column, false)}
			onDragStart={() => handleCellClicked(row, column, true)}
		>
			<img src={pawnImage} alt="pawn" />
		</div>
	)

}

export default Pawn
