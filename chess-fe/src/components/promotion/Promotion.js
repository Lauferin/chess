// import React, { useState } from "react";
import "./Promotion.css";
import whiteKnight from '../pieces/knight/white_knight.svg'
import whiteBishop from '../pieces/bishop/white_bishop.svg'
import whiteRook from '../pieces/rook/white_rook.svg'
import whiteQueen from '../pieces/queen/white_queen.svg'

const Promotion = ({ setPawnToPromote, move, cellBoard }) => {

	const handleOptionClick = (promoteTo) => {
		move(cellBoard, promoteTo);
		setPawnToPromote(null);
	};
	
	const handleCancelClick = () => {
		setPawnToPromote(null);
	};
	
	const options = [
		{ id: 1, label: 'knight', imageUrl: whiteKnight },
		{ id: 2, label: 'bishop', imageUrl: whiteBishop },
		{ id: 3, label: 'rook', imageUrl: whiteRook },
		{ id: 4, label: 'queen', imageUrl: whiteQueen },
	];
	
	return (
		<div className="external-column">
			<div className="options-column">
				{options.map((option) => (
					<div
						key={option.id}
						className={`option`}
						// className={`option ${selectedOption === option.id ? 'selected' : ''}`}
						onClick={() => handleOptionClick(option.label)}
					>
						<img src={option.imageUrl} alt={option.label} />
					</div>
				))}
				<button className="cancel-button" onClick={handleCancelClick}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default Promotion;