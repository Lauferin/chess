import Rook from '../pieces/rook/Rook.js'
import Pawn from '../pieces/pawn/Pawn.js'
import Queen from '../pieces/queen/Queen.js'
import King from '../pieces/king/King.js'
import Knight from '../pieces//knight/Knight.js'
import Bishop from '../pieces/bishop/Bishop.js'
import { useDrag, useDrop } from 'react-dnd';


const Piece = ({ nature, row, column, board, color, player, handleCellClicked }) => {

	// const [{ isDragging }, drag] = useDrag({
	const [, drag] = useDrag({
		type: 'object',
	});

	const [, drop] = useDrop({
		accept: "object",
		drop: () => handleCellClicked(row, column, [], false),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	});

	switch(nature) {
		case "rook": return (<div ref={(node) => drag(drop(node))}><Rook color={color} row={row} column={column} board={board} player={player} handleCellClicked={handleCellClicked} /></div>);
		case "pawn": return (<div ref={(node) => drag(drop(node))}><Pawn color={color} row={row} column={column} board={board} player={player} handleCellClicked={handleCellClicked} /></div>);
		case "queen": return (<div ref={(node) => drag(drop(node))}><Queen color={color} row={row} column={column} board={board} player={player} handleCellClicked={handleCellClicked} /></div>);
		case "king": return (<div ref={(node) => drag(drop(node))}><King color={color} row={row} column={column} board={board} player={player} handleCellClicked={handleCellClicked} /></div>);
		case "knight": return (<div ref={(node) => drag(drop(node))}><Knight color={color} row={row} column={column} board={board} player={player} handleCellClicked={handleCellClicked} /></div>);
		case "bishop": return (<div ref={(node) => drag(drop(node))}><Bishop color={color} row={row} column={column} board={board} player={player} handleCellClicked={handleCellClicked} /></div>);
		default:
			return (
				<div ref={drop} onClick={() => handleCellClicked(row, column, [], false)}>
					&nbsp;
				</div>
			);
	}
}

export default Piece
