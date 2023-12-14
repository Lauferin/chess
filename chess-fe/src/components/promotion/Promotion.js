import "./Promotion.css";
import { WHITE, KNIGHT, BISHOP, ROOK, QUEEN } from "../../constants";
import whiteKnight from '../pieces/knight/white_knight.svg'
import whiteBishop from '../pieces/bishop/white_bishop.svg'
import whiteRook from '../pieces/rook/white_rook.svg'
import whiteQueen from '../pieces/queen/white_queen.svg'
import blackKnight from '../pieces/knight/black_knight.svg'
import blackBishop from '../pieces/bishop/black_bishop.svg'
import blackRook from '../pieces/rook/black_rook.svg'
import blackQueen from '../pieces/queen/black_queen.svg'

const Promotion = ({ setPawnToPromote, move, row, column, playerColor }) => {

	const handleOptionClick = (promoteTo) => {
		move(row, column, promoteTo);
		setPawnToPromote(null);
	};
	
	const handleCancelClick = () => {
		setPawnToPromote(null);
	};
	
	const options = [
		{ id: KNIGHT, label: 'knight', imageUrl: playerColor === WHITE ? whiteKnight : blackKnight },
		{ id: BISHOP, label: 'bishop', imageUrl: playerColor === WHITE ? whiteBishop : blackBishop },
		{ id: ROOK, label: 'rook', imageUrl: playerColor === WHITE ? whiteRook : blackRook },
		{ id: QUEEN, label: 'queen', imageUrl: playerColor === WHITE ? whiteQueen : blackQueen},
	];
	
	return (
		<div className="external-column">
			<div className="options-column">
				{options.map((option) => (
					<div
						key={option.id}
						className={`option`}
						// className={`option ${selectedOption === option.id ? 'selected' : ''}`}
						onClick={() => handleOptionClick(option.id)}
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