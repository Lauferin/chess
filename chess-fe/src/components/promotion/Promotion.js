import "./Promotion.css";
import whiteKnight from '../pieces/knight/white_knight.svg'
import whiteBishop from '../pieces/bishop/white_bishop.svg'
import whiteRook from '../pieces/rook/white_rook.svg'
import whiteQueen from '../pieces/queen/white_queen.svg'
import blackKnight from '../pieces/knight/black_knight.svg'
import blackBishop from '../pieces/bishop/black_bishop.svg'
import blackRook from '../pieces/rook/black_rook.svg'
import blackQueen from '../pieces/queen/black_queen.svg'

const Promotion = ({ setPawnToPromote, move, row, column, player }) => {

	const handleOptionClick = (promoteTo) => {
		move(row, column, promoteTo);
		setPawnToPromote(null);
	};
	
	const handleCancelClick = () => {
		setPawnToPromote(null);
	};
	
	const options = [
		{ id: 1, label: 'knight', imageUrl: player === "white" ? whiteKnight : blackKnight },
		{ id: 2, label: 'bishop', imageUrl: player === "white" ? whiteBishop : blackBishop },
		{ id: 3, label: 'rook', imageUrl: player === "white" ? whiteRook : blackRook },
		{ id: 4, label: 'queen', imageUrl: player === "white" ? whiteQueen : blackQueen},
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