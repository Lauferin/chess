import React, { useState, useEffect, Fragment } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "./ChessBoard.css";
import Piece from '../piece/Piece.js';
import Promotion from "../promotion/Promotion";
import axios from "axios";
import { WHITE, BLACK, CHECKMATE_PLAYER, CHECKMATE_OPPONENT, MOVEMENTS_URL, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING } from "../../constants";
// import { DRAWN } from "../../constants";

const PLAYER = true;
const OPPONENT = false;

const ChessBoard = ({ game, playerColor, endGame }) => {

	const [board, setBoard] = useState([]);
	const [picked, setPicked] = useState(null);
	const [allowedMovements, setAllowedMovements] = useState([]);
	const [pawnToPromote, setPawnToPromote] = useState(null); // -1: no column with pawn to promote
	const [turn, setTurn] = useState(null);
	const [lastMovement, setLastMovement] = useState(null);
	const [recentlyMoved, setRecentlyMoved] = useState([])
	const opponentColor = playerColor === WHITE ? BLACK : WHITE;
	const [movedPieces, setMovedPieces] = useState([false, null, null, false, null, null, null, false])


	const handleCellClicked = (rowIndex, columnIndex, dragging) => {
		if (turn === OPPONENT) {
			return;
		}
		console.log("row", rowIndex, "column", columnIndex)
		const cellBoard = board[rowIndex][columnIndex]
		if (picked) {  // If a cell was previously picked
			const { pickedRow, pickedColumn } = picked;
			const pickedCell = board[pickedRow][pickedColumn];
			if (pickedRow === rowIndex && pickedColumn === columnIndex) { // it's the same piece
				if (!dragging) { // not dragging, so the intention is to deselect it
					setPicked(null); // not picked anymore
					pickedCell.cellColor = !!((pickedRow + pickedColumn) % 2) === playerColor ? 'white' : 'gray'; // reset its color
					setPawnToPromote(-1);
				}
			} else { // it's not the piece
				if (cellBoard.valueColor === playerColor) { // if it's another piece and it's also the player's, change
					setPicked({ pickedRow: rowIndex, pickedColumn: columnIndex });
					board[rowIndex][columnIndex].cellColor = 'red';    
					pickedCell.cellColor = !!((pickedRow + pickedColumn) % 2) === playerColor ? 'white' : 'gray'; // reset its color
					setPawnToPromote(-1);
				} else { // it wants to move there
					console.log("allowed", allowedMovements)
					if (includesArray(allowedMovements, [pickedRow, pickedColumn], [rowIndex, columnIndex])) { // it's legal
						if (rowIndex === 0 && pickedCell.value === PAWN) { // a pawn has got to the edge
							setPawnToPromote(columnIndex)
						} else { // move!!!
							move(rowIndex, columnIndex, null);
							return;
						}
					}
				}
			}
		} else { // no cell previously picked
			if (cellBoard.value && cellBoard.valueColor === playerColor) {
				setPicked({ pickedRow: rowIndex, pickedColumn: columnIndex });
				cellBoard.cellColor = 'red'; 
			} else {
				console.log("opponent piece!")
			}
		}
		setBoard([...board]); 
	}

	const isPlayerPiece = (board, row, column, player) => {
		return board[row][column].value !== null && board[row][column].valueColor === player
	}

	const calculatePawnAllowedMovements = (board, row, column, playerColor, turn) => {
		const opponentColor = playerColor === WHITE ? BLACK : WHITE;
		const movements = [];
		const forward = turn ? 1 : -1;
		const initialPosition = turn ? 6 : 1;
		if (board[row - forward][column].value === null) {
			movements.push([row - forward, column]);
			if (row === initialPosition && board[row - 2 * forward][column].value === null) {
				movements.push([row - 2 * forward, column]);
			}
		}
		if (column > 0 && board[row - forward][column - 1].valueColor === opponentColor) {
			movements.push([row - forward, column - 1]);
		}
		if (column < 7 && board[row - forward][column + 1].valueColor === opponentColor) {
			movements.push([row - forward, column + 1]);
		}
		// add rule of crazy pawn
		return movements;					
	}

	const calculateKnightAllowedMovements = (board, row, column, playerColor) => {
		const movements = [];
		if (row > 0) { // one forward, two right and left
			if (column < 6 && board[row - 1][column + 2].valueColor !== playerColor) {
				movements.push([row - 1, column + 2]);
			}
			if (column > 1 && board[row - 1][column - 2].valueColor !== playerColor) {
				movements.push([row - 1, column - 2]);
			}
			if (row > 1) { // two forward, right and left
				if (column < 7 && board[row - 2][column + 1].valueColor !== playerColor) {
					movements.push([row - 2, column + 1]);
				}
				if (column > 0 && board[row - 2][column - 1].valueColor !== playerColor) {
					movements.push([row - 2, column - 1]);
				}
			}
		}
		if (row < 7) { // one backwards, two right and left
			if (column < 6 && board[row + 1][column + 2].valueColor !== playerColor) {
				movements.push([row + 1, column + 2]);
			}
			if (column > 1 && board[row + 1][column - 2].valueColor !== playerColor) {
				movements.push([row + 1, column - 2]);
			}
			if (row < 6) { // two backwards, right and left
				if (column < 7 && board[row + 2][column + 1].valueColor !== playerColor) {
					movements.push([row + 2, column + 1]);
				}
				if (column > 0 && board[row + 2][column - 1].valueColor !== playerColor) {
					movements.push([row + 2, column - 1]);
				}
			}
		}
		return movements;
	}

	const calculateBishopAllowedMovements = (board, row, column, playerColor) => {
		const opponentColor = playerColor === WHITE ? BLACK : WHITE;
		const movements = [];
		let i = row; let j = column; // move right backwards
		while (i < 7 && j < 7) {
			++i; ++j;
			if (board[i][j].value === null) {
				movements.push([i, j]);
			} else {
				if (board[i][j].valueColor === opponentColor) {
					movements.push([i, j]);
				}
				break;
			}    
		}
		i = row; j = column; // move right forward
		while (i > 0 && j < 7) {
			--i; ++j;
			if (board[i][j].value === null) {
				movements.push([i, j]);
			} else {
				if (board[i][j].valueColor === opponentColor) {
					movements.push([i, j]);
				}
				break;
			}    
		}
		i = row; j = column; // move left backwards
		while (i < 7 && j > 0) {
			++i; --j;
			if (board[i][j].value === null) {
				movements.push([i, j]);
			} else {
				if (board[i][j].valueColor === opponentColor) {
					movements.push([i, j]);
				}
				break;
			}    
		}
		i = row; j = column; // move left forward
		while (i > 0 && j > 0) {
			--i; --j;
			if (board[i][j].value === null) {
				movements.push([i, j]);
			} else {
				if (board[i][j].valueColor === opponentColor) {
					movements.push([i, j]);
				}
				break;
			}
		}
		return movements;
	}

	const calculateRookAllowedMovements = (board, row, column, playerColor) => {
		const opponentColor = playerColor === WHITE ? BLACK : WHITE;
		const movements = [];
		let i = column; // move right
		while (i < 7) {
			++i;
			if (board[row][i].value === null) {
				movements.push([row, i]);
			} else {
				if (board[row][i].valueColor === opponentColor) {
					movements.push([row, i]);
				}
				break;
			}
		}
		i = column; // move left
		while (i > 0) {
			--i;
			if (board[row][i].value === null) {
				movements.push([row, i]);
			} else {
				if (board[row][i].valueColor === opponentColor) {
					movements.push([row, i]);
				}
				break;
			}
		}
		i = row; // move backwards
		while (i < 7) {
			++i;
			if (board[i][column].value === null) {
				movements.push([i, column]);
			} else {
				if (board[i][column].valueColor === opponentColor) {
					movements.push([i, column]);
				}
				break;
			}
		}
		i = row; // move forward
		while (i > 0) {
			--i;
			if (board[i][column].value === null) {
				movements.push([i, column]);
			} else {
				if (board[i][column].valueColor === opponentColor) {
					movements.push([i, column]);
				}
				break;
			}
		}
		return movements;
	}

	const calculateKingAllowedMovements = (board, row, column, playerColor, turn) => {
		const movements = [];
		if (column > 0) {
			if (row > 0 && board[row - 1][column - 1].valueColor !== playerColor) {
				movements.push([row - 1, column - 1]);
			}
			if (row < 7 && board[row + 1][column - 1].valueColor !== playerColor) {
				movements.push([row + 1, column - 1]);
			}
			if (board[row][column - 1].valueColor !== playerColor) {
				movements.push([row, column - 1]);
			}
		}
		if (column < 7) {
			if (row > 0 && board[row - 1][column + 1].valueColor !== playerColor) {
				movements.push([row - 1, column + 1])
			}
			if (row < 7 && board[row + 1][column + 1].valueColor !== playerColor) {
				movements.push([row + 1, column + 1]);
			}
			if (board[row][column + 1].valueColor !== playerColor) {
				movements.push([row, column + 1]);
			}
		}
		if (row > 0 && board[row - 1][column].valueColor !== playerColor) {
			movements.push([row - 1, column]);
		}
		if (row < 7 && board[row + 1][column].valueColor !== playerColor) {
			movements.push([row + 1, column]);
		}
		if (turn && movedPieces[column] === false) {
			if (isCastlingAllowed(board, row, column, 0)) {
				movements.push([7, column - 2]);
			}
			if (isCastlingAllowed(board, row, column, 7)) {
				movements.push([7, column + 2]);
			}	
		}
		return movements;
	}

	const isCastlingAllowed = (board, row, column, rook) => {
		return true
	}

	const getPiecePosition = (board, piece, color) => {
		for (let row = 0; row < board.length; ++row) {
			for (let column = 0; column < board.length; ++column) {
				if (board[row][column].value === piece && board[row][column].valueColor === color)
					return {"row": row, "column": column};
			}
		}
	}

	const getAllowedMovements = (board, playerColor, player) => {
		const opponentColor = playerColor === WHITE ? BLACK : WHITE;
		const opponent = player === true ? false : true;
		const movements = calculateAllowedMovements(board, playerColor, player);
		const movementsWithoutCheck = [];
		movements.forEach(movement => {
			const newBoard = JSON.parse(JSON.stringify(board));
			newBoard[movement.movement[0]][movement.movement[1]].value = newBoard[movement.piece[0]][movement.piece[1]].value;
			newBoard[movement.movement[0]][movement.movement[1]].valueColor = newBoard[movement.piece[0]][movement.piece[1]].valueColor;
			newBoard[movement.piece[0]][movement.piece[1]].value = null
			newBoard[movement.piece[0]][movement.piece[1]].valueColor = null
			const king = getPiecePosition(newBoard, KING, playerColor);
			const opponentMovements = calculateAllowedMovements(newBoard, opponentColor, opponent);
			if (!opponentMovements.some(e => e.movement[0] === king.row && e.movement[1] === king.column)) {
				movementsWithoutCheck.push(movement);
			}
		})
		return movementsWithoutCheck;
	}

	const calculateAllowedMovements = (board, player, turn) => {
		let movements = [];
		for (let row = 0; row < board.length; ++row) {
			for (let column = 0; column < board.length; ++column) {
				if (isPlayerPiece(board, row, column, player)) {
					switch(board[row][column].value) {
						case PAWN:
							movements = movements.concat(addPiecePosition(row, column, calculatePawnAllowedMovements(board, row, column, player, turn)));
						break;
						case KNIGHT:
							movements = movements.concat(addPiecePosition(row, column, calculateKnightAllowedMovements(board, row, column, player)));
						break;
						case BISHOP:
							movements = movements.concat(addPiecePosition(row, column, calculateBishopAllowedMovements(board, row, column, player)));
						break;
						case ROOK:
							movements = movements.concat(addPiecePosition(row, column, calculateRookAllowedMovements(board, row, column, player)));
						break;
						case QUEEN:
							movements = movements.concat(addPiecePosition(row, column, calculateBishopAllowedMovements(board, row, column, player)));
							movements = movements.concat(addPiecePosition(row, column, calculateRookAllowedMovements(board, row, column, player)));
						break;
						case KING:
							movements = movements.concat(addPiecePosition(row, column, calculateKingAllowedMovements(board, row, column, player, turn)));
						break;
						default:
					}
				}
			}
		}
		return movements;
	}

	const addPiecePosition = (row, column, movements) => {
		const completeMovements = movements.map(movement => {
			return {"piece": [row, column], "movement": movement}
		})
		return completeMovements
	}

	const includesArray = (allMovements, pieceData, movementData) => { // includes doesn't work because it's another object.
		return allMovements.some(e => e.piece[0] === pieceData[0] && e.piece[1] === pieceData[1] &&
									  e.movement[0] === movementData[0] && e.movement[1] === movementData[1]);
	}

	const paintRecentlyMoved = (pickedRow, pickedColumn, movementRow, movementColumn) => {
		recentlyMoved.forEach(cell => {
			board[cell.row][cell.column].cellColor = !!((cell.row + cell.column) % 2) === playerColor ? 'white' : 'gray'; // reset color
		})
		board[pickedRow][pickedColumn].cellColor = !!((pickedRow + pickedColumn) % 2) === playerColor ? 'yellow' : 'yellowgreen'; // paint recently color
		board[movementRow][movementColumn].cellColor = !!((movementRow + movementColumn) % 2) === playerColor ? 'yellow' : 'yellowgreen'; // paint recent color
		setRecentlyMoved([{"row": pickedRow, "column": pickedColumn}, {"row": movementRow, "column": movementColumn}]);
	}

	const move = (row, column, promoted) => {
		const cellBoard = board[row][column];
		const { pickedRow, pickedColumn } = picked;
		const pickedCell = board[pickedRow][pickedColumn];
		if (pickedCell.value === KING) {
			movedPieces[pickedColumn] = true;
			if (Math.abs(pickedColumn - column) > 1) {
				const rookColumn = pickedColumn < 5 ? 0 : 7;
				board[pickedRow][pickedColumn - 1].value = board[pickedRow][rookColumn].value;
				board[pickedRow][pickedColumn - 1].valueColor = board[pickedRow][rookColumn].valueColor;
				board[pickedRow][rookColumn].value = null;
				board[pickedRow][rookColumn].valueColor = null;
				movedPieces[pickedColumn] = true;
				movedPieces[rookColumn] = true;
				setMovedPieces([...movedPieces]);
			}
		}
		if (pickedCell.value === ROOK) {
			movedPieces[pickedColumn] = true;
			setMovedPieces([...movedPieces]);
		}
		cellBoard.value = promoted ? promoted : pickedCell.value;
		cellBoard.valueColor = pickedCell.valueColor;
		pickedCell.value = null;
		pickedCell.valueColor = null;
		console.log(pickedRow, pickedColumn, board[pickedRow][pickedColumn].value)

		setPicked(null);
		paintRecentlyMoved(pickedRow, pickedColumn, row, column);
		setBoard([...board]);
		sendMovement(parse(pickedRow, pickedColumn), parse(row, column), promoted);
	}

	const moveOpponent = (data) => {
		const piece = unParse(data.piece);
		const movement = unParse(data.movement);
		const pickedCell = board[piece.row][piece.column];
		const movementCell = board[movement.row][movement.column];
		movementCell.value = data.promoted ? data.promoted : pickedCell.value;
		movementCell.valueColor = pickedCell.valueColor;
		pickedCell.value = null;
		pickedCell.valueColor = null;
		paintRecentlyMoved(piece.row, piece.column, movement.row, movement.column);
		const movements = getAllowedMovements([...board], playerColor, PLAYER);
		setAllowedMovements(movements);
		setBoard([...board]);
		if (movements.length === 0) {
			endGame(CHECKMATE_OPPONENT); //check if it's check mate or drawn
		} else {
			setTurn(PLAYER);
		}
	}

	const sendMovement = (piece, movement, promoted) => {
		// console.log("turn", turn, "game", game, "playerColor", playerColor)
		const data = {"game": game, "player": playerColor, "piece": piece, "movement": movement, "promoted": promoted}
		// console.log(data)
		try {
			axios.post(MOVEMENTS_URL, data).then(response => {
				setLastMovement(response.data.pk)
				const opponentColor = playerColor === WHITE ? BLACK : WHITE;
				const movements = getAllowedMovements(board, opponentColor, OPPONENT);
				// console.log("movements", movements)
				if (movements.length === 0) {
					endGame(CHECKMATE_PLAYER); //check if it's check mate or drawn
					setTurn(null);
				} else {
					setTurn(OPPONENT);
				}		
			});
		} catch (error) {
			console.log("server unavailable or bad request", error)
		}
	}

	const parse = (row, column) => {
		const columnResult = playerColor === WHITE ? String.fromCharCode(97 + column) : String.fromCharCode(97 + (7 - column));
		const rowResult = playerColor === BLACK ? row + 1 : 8 - row; 
		return `${columnResult}${rowResult}`;
	}

	const unParse = (position) => {
		const columnResult = playerColor === WHITE ? position.charCodeAt(0) - 97 : 7 - position.charCodeAt(0) + 97;
		const rowResult = playerColor === BLACK ? position[1] - 1 : 8 - position[1]; 
		return {"row": rowResult, "column": columnResult};
	}

	useEffect(() => {
		if (playerColor === null || game < 0) { // game < 0 means the game is not active (checkmate or something)
			return;
		}
		const generateBoardChess = () => {
			let pieces = [
				[ROOK, KNIGHT, BISHOP, KING, QUEEN, BISHOP, KNIGHT, ROOK],
				[PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN],
				[ROOK, KNIGHT, BISHOP, KING, QUEEN, BISHOP, KNIGHT, ROOK],
			]
			const newMatrix = [];
			for (let i = 0; i < 8; ++i) {
				const row = [];
				for (let j = 0; j < 8; ++j) {
					const cellColor = !!((i + j) % 2) === playerColor ? 'white' : 'gray';
					row.push(
						{
							cellColor: cellColor,
							value: pieces[i][j],
							valueColor: i < 2 ? opponentColor : (i > 5 ? playerColor : null)
						}
					);
				}
				newMatrix.push(row);
			}
			return newMatrix;
		};
		setBoard(() => {
			const newBoard = generateBoardChess();
			setAllowedMovements(getAllowedMovements(newBoard, playerColor, PLAYER));
			return newBoard;
		});
		if (playerColor === WHITE) {
			setTurn(PLAYER);
		} else {
			setTurn(OPPONENT);
			setLastMovement(0) // not null, so it asks for opponent's movement
		}
		// the following line is not exactly a comment, it disables the warning of not adding the function moveOpponent. Don't remove.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [game, playerColor, opponentColor]);

	useEffect(() => {
		let interval;
		const fetchData = async () => {
			try {
				const response = await fetch(`${MOVEMENTS_URL}?player=${opponentColor ? "True" : "False"}&game=${game}&pk__gt=${lastMovement}`);
				const data = await response.json();
				console.log('Data from backend:', data);
				if (data.length) {
					setLastMovement(null)
					moveOpponent(data[0]);
				}
			} catch (error) {
				console.error('Error fetching data from backend:', error);
			}
		};

		if (lastMovement !== null && game !== -1) {
			fetchData();
			interval = setInterval(() => {
				fetchData();
			}, 2000);
	
			return () => clearInterval(interval);
		}
		// the following line is not exactly a comment, it disables the warning of not adding the function moveOpponent. Don't remove.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastMovement]);

	return (
		<Fragment>
		<div className="ChessBoard-board">
			<DndProvider backend={HTML5Backend}>
			<table>
				<tbody>
					{board.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{row.map((cell, cellIndex) => (
								<td 
									key={cellIndex}
									className="ChessBoard-cell"
									style={{ backgroundColor: cell.cellColor}}
								>
									{pawnToPromote === cellIndex && rowIndex === 0 && 
										<Promotion setPawnToPromote={setPawnToPromote} move={move} row={rowIndex} column={cellIndex} playerColor={playerColor} />}
									<Piece 
										nature={cell.value} row={rowIndex} column={cellIndex} board={board} pieceColor={cell.valueColor} playerColor={playerColor}
										handleCellClicked={handleCellClicked} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			</DndProvider>
		</div>
		</Fragment>
		);
	}

export default ChessBoard;
