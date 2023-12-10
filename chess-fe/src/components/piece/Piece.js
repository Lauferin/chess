import { useDrag, useDrop } from 'react-dnd';
import Rook from '../pieces/rook/Rook.js';
import Pawn from '../pieces/pawn/Pawn.js';
import Queen from '../pieces/queen/Queen.js';
import King from '../pieces/king/King.js';
import Knight from '../pieces//knight/Knight.js';
import Bishop from '../pieces/bishop/Bishop.js';
import { PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING } from "../../constants";


const Piece = ({ nature, row, column, board, pieceColor, playerColor, handleCellClicked }) => {

	// const [{ isDragging }, drag] = useDrag({
	const [, drag] = useDrag({
		type: 'object',
	});

	const [, drop] = useDrop({
		accept: 'object',
		drop: () => handleCellClicked(row, column, [], false),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	});

	const PieceComponent = {
		[ROOK]: Rook,
		[PAWN]: Pawn,
		[QUEEN]: Queen,
		[KING]: King,
		[KNIGHT]: Knight,
		[BISHOP]: Bishop,
	}[nature];

	return (
		<div ref={(node) => drag(drop(node))}>
			{PieceComponent && (
				<PieceComponent pieceColor={pieceColor} row={row} column={column} handleCellClicked={handleCellClicked} />
			)}
			{!PieceComponent && (
				<div style={{ width: '100%', height: '100%' }} ref={drop} onClick={() => handleCellClicked(row, column, [], false)}>
					&nbsp;
				</div>
			)}
		</div>
	);
};

export default Piece;
