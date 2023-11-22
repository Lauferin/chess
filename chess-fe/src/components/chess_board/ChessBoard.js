import React, { useState, useEffect, Fragment } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "./ChessBoard.css";
import Piece from '../piece/Piece.js';
import Promotion from "../promotion/Promotion";
import axios from "axios";
import { API_URL } from "../../constants";

const PLAYER = true;
const OPPONENT = false;

const ChessBoard = ({ game, player }) => {

	const [board, setBoard] = useState([]);
	const [picked, setPicked] = useState(null);
	const [allowedMovements, setAllowedMovements] = useState([]);
	const [pawnToPromote, setPawnToPromote] = useState(null); // -1: no column with pawn to promote
	const [turn, setTurn] = useState(null);
	const [lastMovement, setLastMovement] = useState(null);
	const opponent = player === "white" ? "black" : "white";
	const colorRest = player === "white" ? 1 : 0;


	const handleCellClicked = (rowIndex, columnIndex, futureAllowedMovements, dragging) => {
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
					setAllowedMovements([]);
					pickedCell.cellColor = (pickedRow + pickedColumn) % 2 === colorRest ? 'white' : 'gray'; // reset its color
					setPawnToPromote(-1);
				}
			} else { // it's not the piece
				if (cellBoard.valueColor === player) { // if it's another piece and it's also white, change
					setPicked({ pickedRow: rowIndex, pickedColumn: columnIndex });
					if (isCheckIfMoved(rowIndex, columnIndex)) {
						setAllowedMovements([]);
						console.log("if moved, check")
					} else {
						setAllowedMovements(futureAllowedMovements);
					}
					board[rowIndex][columnIndex].cellColor = 'red';    
					pickedCell.cellColor = (pickedRow + pickedColumn) % 2 === colorRest ? 'white' : 'gray'; // reset its color
					setPawnToPromote(-1);
				} else { // it wants to move there
					// console.log(allowedMovements, [rowIndex, columnIndex], allowedMovements.includes([rowIndex, columnIndex]))
					if (includesArray(allowedMovements, [rowIndex, columnIndex])) { // it's legal
						if (rowIndex === 0 && pickedCell.value === "pawn") { // a pawn has got to the edge
							setPawnToPromote(columnIndex)
						} else { // move!!!
							move(rowIndex, columnIndex, null);
							return;
						}
					}
				}
			}
		} else { // no cell previously picked
			if (cellBoard.value && cellBoard.valueColor === player) {
				setPicked({ pickedRow: rowIndex, pickedColumn: columnIndex });
				if (isCheckIfMoved(rowIndex, columnIndex)) { // can't move this piece because it would result in check
					// WARNING! what happens if the piece want's to eat the potential checking peace?
					setAllowedMovements([]);
					console.log("if moved, check")
				} else {
					setAllowedMovements(futureAllowedMovements);
				}
				cellBoard.cellColor = 'red'; 
			} else {
				console.log("opponent piece!")
			}
		}
		setBoard([...board]); 
	}

	const isCheckIfMoved = (row, column) => {
		let i = row;
		let j = column;
		let kingFound = false;
		let checkPieceFound = false;
		while (i < 7 && j < 7) { // bishop or queen checking diagonally 4:30 or 10:30
			++i; ++j;
			if (board[i][j].value !== null) {
				kingFound = isPlayerKingInPosition(i, j);
				checkPieceFound = isPlayerDiagonalPieceInPosition(i, j);
				if (kingFound || checkPieceFound) {
					i = row; j = column;
					while (i > 0 && j > 0) {
						--i; --j;
						if (board[i][j].value !== null) {
							if ((kingFound && isPlayerDiagonalPieceInPosition(i, j)) || 
								(checkPieceFound && isPlayerKingInPosition(i, j))) {
									return true;
								}
							break;
						}				
					}					
				}
				break;
			}
		}
		i = row; j = column;
		kingFound = false; checkPieceFound = false;
		while (i < 7 && j > 0) { // bishop or queen checking diagonally 1:30 or 7:30
			++i; --j;
			if (board[i][j].value !== null) {
				kingFound = isPlayerKingInPosition(i, j);
				checkPieceFound = isPlayerDiagonalPieceInPosition(i, j);
				if (kingFound || checkPieceFound) {
					i = row; j = column;
					while (i > 0 && j < 7) {
						--i; ++j;
						if (board[i][j].value !== null) {
							if ((kingFound && isPlayerDiagonalPieceInPosition(i, j)) || 
								(checkPieceFound && isPlayerKingInPosition(i, j))) {
									return true;
								}
							break;
						}				
					}					
				}
				break;
			}
		}
		i = row;
		kingFound = false; checkPieceFound = false;
		while (i < 7) { // rook or queen checking vertically
			++i;
			if (board[i][column].value !== null) {
				kingFound = isPlayerKingInPosition(i, column);
				checkPieceFound = isPlayerAdjacentPieceInPosition(i, column);
				if (kingFound || checkPieceFound) {
					i = row;
					while (i > 0) {
						--i;
						if (board[i][column].value !== null) {
							if ((kingFound && isPlayerAdjacentPieceInPosition(i, column)) || 
								(checkPieceFound && isPlayerKingInPosition(i, column))) {
									return true;
								}
							break;
						}				
					}
				}
				break;
			}
		}
		i = column;
		kingFound = false; checkPieceFound = false;
		while (i < 7) { // rook or queen checking horizontally
			++i;
			if (board[row][i].value !== null) {
				kingFound = isPlayerKingInPosition(row, i);
				checkPieceFound = isPlayerAdjacentPieceInPosition(row, i);
				if (kingFound || checkPieceFound) {
					i = column;
					while (i > 0) {
						--i;
						if (board[row][i].value !== null) {
							if ((kingFound && isPlayerAdjacentPieceInPosition(row, i)) || 
								(checkPieceFound && isPlayerKingInPosition(row, i))) {
									return true;
								}
							break;
						}				
					}
				}
				break;
			}
		}
		return false;
	}

	const isPlayerKingInPosition = (row, column) => {
		if (board[row][column].value === "king" && board[row][column].valueColor === player) {
			return true;
		}
		return false;
	}

	const isPlayerDiagonalPieceInPosition = (row, column) => {
		if ((board[row][column].value === "bishop" || board[row][column].value === "queen") && board[row][column].valueColor === opponent) {
			return true;
		}
		return false;
	}

	const isPlayerAdjacentPieceInPosition = (row, column) => {
		if ((board[row][column].value === "rook" || board[row][column].value === "queen") && board[row][column].valueColor === opponent) {
			return true;
		}
		return false;
	}

	const includesArray = (data, arr) => { // function that checks if array is instead of array. Regular .includes doesn't work because it's another object.
		return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
	}

	const move = (row, column, promoted) => {
		const cellBoard = board[row][column];
		const { pickedRow, pickedColumn } = picked;
		const pickedCell = board[pickedRow][pickedColumn];
		cellBoard.value = promoted ? promoted : pickedCell.value
		cellBoard.valueColor = pickedCell.valueColor
		pickedCell.value = null
		pickedCell.valueColor = null
		setPicked(null)
		setAllowedMovements([])
		pickedCell.cellColor = (pickedRow + pickedColumn) % 2 === colorRest ? 'white' : 'gray'; // reset its color	
		setBoard([...board]);
		sendMovement(parse(pickedRow, pickedColumn), parse(row, column), promoted);
		setTurn(OPPONENT);
	}

	const moveOpponent = (data) => {
		const piece = unParse(data.piece);
		const movement = unParse(data.movement);
		const pickedCell = board[piece.row][piece.column]
		const movementCell = board[movement.row][movement.column];
		movementCell.value = data.promoted ? data.promoted : pickedCell.value
		movementCell.valueColor = pickedCell.valueColor
		pickedCell.value = null
		pickedCell.valueColor = null
		setBoard([...board]);
		setTurn(PLAYER);
	}

	const sendMovement = (piece, movement, promoted) => {
		console.log("turn", turn, "game", game)
		const data = {"game": game, "player": PLAYER, "piece": piece, "movement": movement, "promoted": promoted}
		try {
			axios.post(API_URL, data).then(response => {
				console.log("movimiento mandado", response.data.pk);
				setLastMovement(response.data.pk)
			});
		} catch (error) {
			console.log("server unavailable or bad request", error)
		}
	}

	const parse = (row, column) => {
		const columnResult = player === "white" ? String.fromCharCode(97 + column) : String.fromCharCode(97 + (7 - column));
		const rowResult = player === "black" ? row + 1 : 8 - row; 
		return `${columnResult}${rowResult}`;
	}

	const unParse = (position) => {
		const columnResult = player === "white" ? position.charCodeAt(0) - 97 : 7 - position.charCodeAt(0) + 97;
		const rowResult = player === "black" ? position[1] - 1 : 8 - position[1]; 
		return {"row": rowResult, "column": columnResult};
	}

	useEffect(() => {
		if (player === null) {
			return;
		}
		const generateBoardChess = () => {
			let pieces = [
				['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'],
				['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				[null, null, null, null, null, null, null, null],
				['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
				['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'],
			]
			const newMatrix = [];
			// let lastColor = 1 HACELO CON BINARIO
			for (let i = 0; i < 8; ++i) {
				const row = [];
				for (let j = 0; j < 8; ++j) {
					const cellColor = (i + j) % 2 === colorRest ? 'white' : 'gray';
					row.push(
						{
							cellColor: cellColor,
							value: pieces[i][j],
							valueColor: i < 2 ? opponent : (i > 5 ? player : null)
						}
					);
				}
				newMatrix.push(row);
			}
			// newMatrix[4][0].valueColor = 'white'
			return newMatrix;
		};
		setBoard(generateBoardChess());
		player === "white" ? setTurn(PLAYER) : setTurn(OPPONENT);
	}, [game, player, opponent, colorRest]);

	useEffect(() => {
		let interval;
		const fetchData = async () => {
			try {
				const response = await fetch(`${API_URL}?player=False&game=${game}&pk__gt=${lastMovement}`);
				const data = await response.json();
				console.log('Data from webhook:', data);
				if (data.length) {
					setLastMovement(null)
					moveOpponent(data[0]);
				}
			} catch (error) {
				console.error('Error fetching data from webhook:', error);
			}
		};

		if (lastMovement !== null) {
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
									// onClick={() => handleCellClicked(rowIndex, cellIndex)}
								>
									{pawnToPromote === cellIndex && rowIndex === 0 && 
										<Promotion setPawnToPromote={setPawnToPromote} move={move} row={rowIndex} column={cellIndex} player={player} />}
									<Piece 
										nature={cell.value} row={rowIndex} column={cellIndex} board={board} color={cell.valueColor} player={player}
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
