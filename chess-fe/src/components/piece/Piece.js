import Rook from '../pieces/rook/Rook.js'
import Pawn from '../pieces/pawn/Pawn.js'
import Queen from '../pieces/queen/Queen.js'
import King from '../pieces/king/King.js'
import Knight from '../pieces//knight/Knight.js'
import Bishop from '../pieces/bishop/Bishop.js'


const Piece = ({ nature, row, column, board, color, handleCellClicked }) => {

	switch(nature) {
		case "rook": return (<div><Rook color={color} row={row} column={column} board={board} handleCellClicked={handleCellClicked} /></div>);
		case "pawn": return (<div><Pawn color={color} row={row} column={column} board={board} handleCellClicked={handleCellClicked} /></div>);
		case "queen": return (<div><Queen color={color} row={row} column={column} board={board} handleCellClicked={handleCellClicked} /></div>);
		case "king": return (<div><King color={color} row={row} column={column} board={board} handleCellClicked={handleCellClicked} /></div>);
		case "knight": return (<div><Knight color={color} row={row} column={column} board={board} handleCellClicked={handleCellClicked} /></div>);
		case "bishop": return (<div><Bishop color={color} row={row} column={column} board={board} handleCellClicked={handleCellClicked} /></div>);
		default: return(<div onClick={() => handleCellClicked(row, column, [])}>&nbsp;</div>);
	}
}

export default Piece
