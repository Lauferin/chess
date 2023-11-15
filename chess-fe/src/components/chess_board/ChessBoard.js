import React, { useState, useEffect, Fragment } from "react";
import "./ChessBoard.css"
import Piece from '../piece/Piece.js'

const ChessBoard = () => {

	const [board, setBoard] = useState([]);
	const [picked, setPicked] = useState();
	const [allowedMovements, setAllowedMovements] = useState([]);

	useEffect(() => {
		const generateBoardChess = () => {
			const pieces = [
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
					const cellColor = (i + j) % 2 === 1 ? 'white' : 'gray';
					row.push(
						{
							cellColor: cellColor,
							value: pieces[i][j],
							valueColor: i < 2 ? 'black' : (i > 5 ? 'white' : null)
						}
					);
				}
				newMatrix.push(row);
			}
			// newMatrix[4][0].valueColor = 'white'
			return newMatrix;
		};
		setBoard(generateBoardChess());
	}, []);

	const handleCellClicked = (rowIndex, columnIndex, futureAllowedMovements) => {
		console.log("row", rowIndex, "column", columnIndex)
		const cellBoard = board[rowIndex][columnIndex]
		if (picked) {  // If a cell was previously picked
			const { pickedRow, pickedColumn } = picked;
			const pickedCell = board[pickedRow][pickedColumn];
			if (pickedRow === rowIndex && pickedColumn === columnIndex) { // it's the same piece
				setPicked(); // not picked anymore
				setAllowedMovements([]);
				pickedCell.cellColor = (pickedRow + pickedColumn) % 2 === 1 ? 'white' : 'gray'; // reset its color
			} else { // it's not the piece
				if (cellBoard.valueColor === "white") { // if it's another piece and it's also white, change
					setPicked({ pickedRow: rowIndex, pickedColumn: columnIndex });
					if (isCheckIfMoved(rowIndex, columnIndex)) {
						setAllowedMovements([]);
						console.log("if moved, check")
					} else {
						setAllowedMovements(futureAllowedMovements);
					}
					board[rowIndex][columnIndex].cellColor = 'red';    
					pickedCell.cellColor = (pickedRow + pickedColumn) % 2 === 1 ? 'white' : 'gray'; // reset its color
				} else { // it wants to move there
					// console.log(allowedMovements, [rowIndex, columnIndex], allowedMovements.includes([rowIndex, columnIndex]))
					if (includesArray(allowedMovements, [rowIndex, columnIndex])) { // it's legal
						if (rowIndex === 0 && pickedCell.value === "pawn") { // a pawn has got to the edge
							console.log("yupi!")
						} else { // move!!!
							cellBoard.value = pickedCell.value
							cellBoard.valueColor = pickedCell.valueColor
							pickedCell.value = null
							pickedCell.valueColor = null
							setPicked()
							setAllowedMovements([])
							pickedCell.cellColor = (pickedRow + pickedColumn) % 2 === 1 ? 'white' : 'gray'; // reset its color	
						}
					}
					// did you eat someone?
				}
			}
		} else { // no cell previously picked
			if (cellBoard.value && cellBoard.valueColor === 'white') {
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
				console.log("not a white piece!")
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
				kingFound = isWhiteKingInPosition(i, j);
				checkPieceFound = isWhiteDiagonalPieceInPosition(i, j);
				if (kingFound || checkPieceFound) {
					i = row; j = column;
					while (i > 0 && j > 0) {
						--i; --j;
						if (board[i][j].value !== null) {
							if ((kingFound && isWhiteDiagonalPieceInPosition(i, j)) || 
								(checkPieceFound && isWhiteKingInPosition(i, j))) {
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
				kingFound = isWhiteKingInPosition(i, j);
				checkPieceFound = isWhiteDiagonalPieceInPosition(i, j);
				if (kingFound || checkPieceFound) {
					i = row; j = column;
					while (i > 0 && j < 7) {
						--i; ++j;
						if (board[i][j].value !== null) {
							if ((kingFound && isWhiteDiagonalPieceInPosition(i, j)) || 
								(checkPieceFound && isWhiteKingInPosition(i, j))) {
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
				kingFound = isWhiteKingInPosition(i, column);
				checkPieceFound = isWhiteAdjacentPieceInPosition(i, column);
				if (kingFound || checkPieceFound) {
					i = row;
					while (i > 0) {
						--i;
						if (board[i][column].value !== null) {
							if ((kingFound && isWhiteAdjacentPieceInPosition(i, column)) || 
								(checkPieceFound && isWhiteKingInPosition(i, column))) {
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
				kingFound = isWhiteKingInPosition(row, i);
				checkPieceFound = isWhiteAdjacentPieceInPosition(row, i);
				if (kingFound || checkPieceFound) {
					i = column;
					while (i > 0) {
						--i;
						if (board[row][i].value !== null) {
							if ((kingFound && isWhiteAdjacentPieceInPosition(row, i)) || 
								(checkPieceFound && isWhiteKingInPosition(row, i))) {
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

	const isWhiteKingInPosition = (row, column) => {
		if (board[row][column].value === "king" && board[row][column].valueColor === "white") {
			return true;
		}
		return false;
	}

	const isWhiteDiagonalPieceInPosition = (row, column) => {
		if ((board[row][column].value === "bishop" || board[row][column].value === "queen") && board[row][column].valueColor === "black") {
			return true;
		}
		return false;
	}

	const isWhiteAdjacentPieceInPosition = (row, column) => {
		if ((board[row][column].value === "rook" || board[row][column].value === "queen") && board[row][column].valueColor === "black") {
			return true;
		}
		return false;
	}

	const includesArray = (data, arr) => { // function that checks if array is instead of array. Regular .includes doesn't work because it's another object.
		return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
	}

	return (
		<Fragment>
		<div className="ChessBoard-board">
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
									<Piece nature={cell.value} row={rowIndex} column={cellIndex} board={board} color={cell.valueColor}
										handleCellClicked={handleCellClicked} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
		</Fragment>
		);
	}

export default ChessBoard;
