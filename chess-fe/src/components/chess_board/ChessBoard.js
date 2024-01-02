import React, { useState, useEffect, Fragment } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "./ChessBoard.css";
import Piece from '../piece/Piece.js';
import Promotion from "../promotion/Promotion";
import axios from "axios";
import { WHITE, BLACK, CHECKMATE_PLAYER, CHECKMATE_OPPONENT, MOVEMENTS_URL, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, 
	translatePromotionToName, translatePromotionToConstant, LEFT_ROOK, RIGHT_ROOK, DRAWN, GAME_ON} from "../../constants";

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
	const [movedPieces, setMovedPieces] = useState(null)


	const handleCellClicked = (rowIndex, columnIndex, dragging) => {
		if (turn === OPPONENT) {
			return;
		}
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
				console.log("not valid!")
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

	const calculateKingAllowedMovements = (board, movedPieces, row, column, playerColor, turn) => {
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
		if (turn && movedPieces[KING] === false) {
			if (isCastlingAllowed(board, movedPieces, row, column, 0, playerColor, turn)) {
				movements.push([7, column - 2]);
			}
			if (isCastlingAllowed(board, movedPieces, row, column, 7, playerColor, turn)) {
				movements.push([7, column + 2]);
			}	
		}
		return movements;
	}

	const isCastlingAllowed = (board, movedPieces, row, column, rookColumn, playerColor, player) => {
		if (movedPieces[rookColumn === 7 ? RIGHT_ROOK : LEFT_ROOK] === true) { // if the rook has been moved before, it's not valid
			return false;
		}
		const castlingSideFactor = rookColumn > column ? 1 : -1;
		let i = column + castlingSideFactor; // if there is a piece between the king and the rook, it's not valid
		while (i !== rookColumn) {
			if (board[row][i].value !== null) {
				return false;
			}
			i += 1 * castlingSideFactor;
		}
		i = 0; // if it's a check between the king (including it) and two squares to the castling side, it's not valid
		while (i <= 2) {
			const columnToAnalyze = column + i * castlingSideFactor;
			const opponentColor = playerColor === WHITE ? BLACK : WHITE;
			const opponent = player === true ? false : true;
			const opponentMovements = calculateAllowedMovements(board, movedPieces, opponentColor, opponent);
			if (opponentMovements.some(e => e.movement[0] === row && e.movement[1] === columnToAnalyze)) {
				return false;
			}
			++i;
		}
		return true;
	}

	const getPiecePosition = (board, piece, color) => {
		for (let row = 0; row < board.length; ++row) {
			for (let column = 0; column < board.length; ++column) {
				if (board[row][column].value === piece && board[row][column].valueColor === color)
					return {"row": row, "column": column};
			}
		}
	}

	const getAllowedMovements = (board, movedPieces, playerColor, player) => {
		const opponentColor = playerColor === WHITE ? BLACK : WHITE;
		const opponent = player === true ? false : true;
		const movements = calculateAllowedMovements(board, movedPieces, playerColor, player);
		const movementsWithoutCheck = [];
		movements.forEach(movement => {
			const newBoard = JSON.parse(JSON.stringify(board));
			movePiece(newBoard[movement.piece[0]][movement.piece[1]], newBoard[movement.movement[0]][movement.movement[1]], null)
			const king = getPiecePosition(newBoard, KING, playerColor);
			const opponentMovements = calculateAllowedMovements(newBoard, movedPieces, opponentColor, opponent);
			if (!opponentMovements.some(e => e.movement[0] === king.row && e.movement[1] === king.column)) {
				movementsWithoutCheck.push(movement);
			}
		})
		return movementsWithoutCheck;
	}

	const calculateAllowedMovements = (board, movedPieces, player, turn) => {
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
							movements = 
								movements.concat(addPiecePosition(row, column, calculateKingAllowedMovements(board, movedPieces, row, column, player, turn)));
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
		const { pickedRow, pickedColumn } = picked;
		const pickedCell = board[pickedRow][pickedColumn];
		if (pickedCell.value === KING) {
			movedPieces[KING] = true;
			if (Math.abs(pickedColumn - column) > 1) { // if it was castling
				const rookColumn = column < pickedColumn ? 0 : 7;
				const movementDirection = column < pickedColumn ? -1 : 1
				movePiece(board[pickedRow][rookColumn], board[pickedRow][pickedColumn + movementDirection], null)
				movedPieces[rookColumn === 7 ? RIGHT_ROOK : LEFT_ROOK] = true;
				setMovedPieces({...movedPieces});
			}
		}
		if (pickedRow === 7 && pickedCell.value === ROOK) {
			movedPieces[pickedColumn === 7 ? RIGHT_ROOK : LEFT_ROOK] = true;
			setMovedPieces({...movedPieces});
		}
		movePiece(board[pickedRow][pickedColumn], board[row][column], promoted)
		setPicked(null);
		paintRecentlyMoved(pickedRow, pickedColumn, row, column);
		setBoard([...board]);
		sendMovement(parse(pickedRow, pickedColumn), parse(row, column), promoted);
	}

	const getGameState = (board, movements) => {
		// case checkmate y drawn: movements.length === 0 y calcular movements de oponente. si uno de ellos es comerse al rey, checkmate, else drawn
		if (movements.length === 0) {
			const king = getPiecePosition(board, KING, playerColor);
			const opponentMovements = calculateAllowedMovements(board, movedPieces, opponentColor, OPPONENT);
			console.log("opponentMovements", opponentMovements)
			if (opponentMovements.some(e => e.movement[0] === king.row && e.movement[1] === king.column)) {
				console.log("checkmate opponent")
				return CHECKMATE_OPPONENT;
			} else {
				console.log("drawn")
				return DRAWN;
			}
		}
		console.log("game on")
		return GAME_ON;
		// case not enough pieces. recorrer, si no hay reina o torre o peon de ningun color, 
		// o si solo un caballo o solo un alfil, o dos caballos y del otro lado NADA
		// case repeticion: hace falta otro hook
	}

	const moveOpponent = (data) => {
		const piece = unParse(data.piece);
		const movement = unParse(data.movement);
		if (movement.row === 7 && board[movement.row][movement.column].value === ROOK) {
			movedPieces[movement.column === 7 ? RIGHT_ROOK : LEFT_ROOK] = true;
			setMovedPieces({...movedPieces});
		}
		movePiece(board[piece.row][piece.column], board[movement.row][movement.column], translatePromotionToConstant[data.promoted])
		if (board[movement.row][movement.column].value === KING && Math.abs(piece.column - movement.column) > 1) {
			const rookColumn = movement.column < piece.column ? 0 : 7;
			const movementDirection = movement.column < piece.column ? 1 : -1
			movePiece(board[movement.row][rookColumn], board[movement.row][movement.column + movementDirection], null)
		}
		paintRecentlyMoved(piece.row, piece.column, movement.row, movement.column);
		const movements = getAllowedMovements([...board], movedPieces, playerColor, PLAYER); // should be after movePiece finishes but it gets to the same result.
		setAllowedMovements(movements);
		setBoard([...board]);
		const gameState = getGameState(board, movements);
		if (gameState < 0) {
			endGame(gameState);
		} else {
			setTurn(PLAYER);
		}
	}

	const movePiece = (cell1, cell2, promoted) => {
		cell2.value = promoted ? promoted : cell1.value
		cell2.valueColor = cell1.valueColor
		cell1.value = null
		cell1.valueColor = null
	}

	const sendMovement = (piece, movement, promoted) => {
		const data = {"game": game, "player": playerColor, "piece": piece, "movement": movement, "promoted": translatePromotionToName[promoted]}
		try {
			axios.post(MOVEMENTS_URL, data).then(response => {
				setLastMovement(response.data.pk)
				const opponentColor = playerColor === WHITE ? BLACK : WHITE;
				const movements = getAllowedMovements(board, movedPieces, opponentColor, OPPONENT);
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

	const turnNumberToLetter = (number) => {
		return String.fromCharCode(number + 'a'.charCodeAt(0))
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
		setMovedPieces(() => {
			const newMovedPieces = {[KING]: false, [LEFT_ROOK]: false, [RIGHT_ROOK]: false}
			setBoard(() => {
				const newBoard = generateBoardChess();
				setAllowedMovements(getAllowedMovements(newBoard, newMovedPieces, playerColor, PLAYER));
				return newBoard;
			});
			return newMovedPieces
		});
		if (playerColor === WHITE) {
			setTurn(PLAYER);
		} else {
			setTurn(OPPONENT);
			setLastMovement(0) // not null, so it asks for opponent's movement
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [game, playerColor, opponentColor]);

	useEffect(() => {
		let interval;
		const fetchData = async () => {
			try {
				const response = await fetch(`${MOVEMENTS_URL}?player=${opponentColor ? "True" : "False"}&game=${game}&pk__gt=${lastMovement}`);
				const data = await response.json();
				// console.log('Data from backend:', data);
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
							{row.map((cell, colIndex) => (
								<td
									key={colIndex}
									className="ChessBoard-cell"
									style={{ backgroundColor: cell.cellColor}}
								>
									{pawnToPromote === colIndex && rowIndex === 0 && 
										<Promotion setPawnToPromote={setPawnToPromote} move={move} row={rowIndex} column={colIndex} playerColor={playerColor} />}
									<Piece 
										nature={cell.value} row={rowIndex} column={colIndex} pieceColor={cell.valueColor} handleCellClicked={handleCellClicked} />
									{colIndex === 0 &&
										<div className={`chessBoard-position ${rowIndex % 2 === Number(playerColor) ? "gray" : ""}`}>
											{playerColor === WHITE ? 8 - rowIndex : rowIndex + 1}
										</div>
									}
									{rowIndex === 7 &&
										<div className={`chessBoard-position letter ${colIndex % 2 === Number(playerColor) ? "" : "gray"}`}>
											{playerColor === WHITE ? turnNumberToLetter(colIndex) : turnNumberToLetter(7 - colIndex)}
										</div>
									}
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
