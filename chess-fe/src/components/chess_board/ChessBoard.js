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

	const handleCellClicked = (rowIndex, cellIndex, futureAllowedMovements) => {
		console.log("row", rowIndex, "column", cellIndex)
		const cellBoard = board[rowIndex][cellIndex]
		if (picked) {  // If a cell was previously picked
			const { row, cell } = picked;
			if (row === rowIndex && cell === cellIndex) { // it's the same piece
				setPicked(); // not picked anymore
				setAllowedMovements([]);
				board[row][cell].cellColor = (row + cell) % 2 === 1 ? 'white' : 'gray'; // reset its color
			} else { // it's not the piece
				if (cellBoard.valueColor === "white") { // if it's another piece and it's also white, change
					setPicked({ row: rowIndex, cell: cellIndex });
					if (isCheckIfMoved(rowIndex, cellIndex)) {
						setAllowedMovements([]);
						console.log("if moved, check")
					} else {
						setAllowedMovements(futureAllowedMovements);
					}
						board[rowIndex][cellIndex].cellColor = 'red';    
					board[row][cell].cellColor = (row + cell) % 2 === 1 ? 'white' : 'gray'; // reset its color
				} else { // it wants to move there
					console.log(allowedMovements, [rowIndex, cellIndex], allowedMovements.includes([rowIndex, cellIndex]))
					const includesArray = (data, arr) => {
						return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
					}
					if (includesArray(allowedMovements, [rowIndex, cellIndex])) { // it's legal, move!
						cellBoard.value = board[row][cell].value
						cellBoard.valueColor = board[row][cell].valueColor
						board[row][cell].value = null
						board[row][cell].valueColor = null
						setPicked()
						setAllowedMovements([])
						board[row][cell].cellColor = (row + cell) % 2 === 1 ? 'white' : 'gray'; // reset its color
					}
					// did you eat someone?
				}
			}
		} else {
			if (cellBoard.value && cellBoard.valueColor === 'white') {
				setPicked({ row: rowIndex, cell: cellIndex });
				if (isCheckIfMoved(rowIndex, cellIndex)) {
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
