import React, { useState, useEffect, Fragment } from "react";
import "./ChessTable.css"
import Piece from '../piece/Piece.js'

const ChessTable = () => {



    const [table, setTable] = useState([]);

    useEffect(() => {
        const generateTableChess = () => {
            const pieces = [
                ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'],
                ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
                ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'],
            ]
            const newMatrix = [];
            // let lastColor = 1 HACELO CON BINARIO
            for (let i = 0; i < 8; i++) {
                const row = [];
                for (let j = 0; j < 8; j++) {
                    const isBlack = (i + j) % 2 === 1;
                    const cellColor = isBlack ? 'gray' : 'white';
                    row.push(
                        {
                            cellColor: cellColor,
                            value: pieces[i][j],
                            valueColor: i < 2 ? 'black' : 'white'
                        }
                    );
                }
                newMatrix.push(row);
            }
            return newMatrix;
        };
        setTable(generateTableChess());
    }, []);


    return (
        <Fragment>
        <div className="ChessTable-table">
            <table>
                <tbody>
                    {table.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="ChessTable-cell" style={{ backgroundColor: cell.cellColor}}>
                                    <Piece nature={cell.value} color={cell.valueColor}/>
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
