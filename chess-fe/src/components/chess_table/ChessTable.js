import React, { useState, useEffect, Fragment } from "react";
import "./ChessTable.css"
import Piece from '../piece/Piece.js'

const ChessTable = () => {

    const [table, setTable] = useState([]);
    const [picked, setPicked] = useState();
    const [allowedMovements, setAllowedMovements] = useState([]);

    useEffect(() => {
        const generateTableChess = () => {
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
            for (let i = 0; i < 8; i++) {
                const row = [];
                for (let j = 0; j < 8; j++) {
                    const isBlack = (i + j) % 2 === 1;
                    const cellColor = isBlack ? 'white' : 'gray';
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
            return newMatrix;
        };
        setTable(generateTableChess());
    }, []);

    const handleCellClicked = (rowIndex, cellIndex, futureAllowedMovements) => {
        console.log(table)
        console.log("hola", rowIndex, cellIndex)
        const cellTable = table[rowIndex][cellIndex]
        if (picked) {  // If a cell was previously picked
            const { row, cell } = picked;
            if (row === rowIndex && cell === cellIndex) { // it's the same piece
                setPicked(); // not picked anymore
                setAllowedMovements([]);
                table[row][cell].cellColor = (row + cell) % 2 === 1 ? 'white' : 'gray'; // reset its color
            } else { // it's not the piece
                if (cellTable.valueColor === "white") { // if it's another piece and it's also white, change
                    setPicked({ row: rowIndex, cell: cellIndex });
                    setAllowedMovements(futureAllowedMovements);
                    table[rowIndex][cellIndex].cellColor = 'red';    
                    table[row][cell].cellColor = (row + cell) % 2 === 1 ? 'white' : 'gray'; // reset its color
                } else { // it wants to move there
                    console.log(allowedMovements, [rowIndex, cellIndex], allowedMovements.includes([rowIndex, cellIndex]))
                    const includesArray = (data, arr) => {
                        return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
                    }
                    if (includesArray(allowedMovements, [rowIndex, cellIndex])) { // it's legal, move!
                        cellTable.value = table[row][cell].value
                        cellTable.valueColor = table[row][cell].valueColor
                        table[row][cell].value = null
                        table[row][cell].valueColor = null
                        setPicked()
                        setAllowedMovements([])
                        table[row][cell].cellColor = (row + cell) % 2 === 1 ? 'white' : 'gray'; // reset its color
                    }
                    // did you eat someone?
                }
            }
        } else {
            if (cellTable.value && cellTable.valueColor === 'white') {
                setPicked({ row: rowIndex, cell: cellIndex });
                setAllowedMovements(futureAllowedMovements);
                cellTable.cellColor = 'red'; 
            } else {
                console.log("not a white piece!")
            }
        }
        setTable([...table]); 
    }

    return (
        <Fragment>
        <div className="ChessTable-table">
            <table>
                <tbody>
                    {table.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td 
                                    key={cellIndex}
                                    className="ChessTable-cell"
                                    style={{ backgroundColor: cell.cellColor}}
                                    // onClick={() => handleCellClicked(rowIndex, cellIndex)}
                                >
                                    <Piece nature={cell.value} row={rowIndex} column={cellIndex} board={table} color={cell.valueColor}
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

export default ChessTable;
