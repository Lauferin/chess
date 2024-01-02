import React,  { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ChessBoard from './components/chess_board/ChessBoard';
import { WHITE, BLACK, GAMES_URL, CHECKMATE_PLAYER, CHECKMATE_OPPONENT, DRAWN} from "./constants";

const App = () => {

	const [game, setGame] = useState(null);
	const [difficultyOption, setDifficultyOption] = useState('beginner');
	const [playerColorOption, setPlayerColorOption] = useState(WHITE);
	const [playerColor, setPlayerColor] = useState(null);

	const startGame = (difficulty, color) => {
		const data = {"player_color": color, "opponent": difficulty}
		try {
			// console.log(color, difficulty)
			axios.post(GAMES_URL, data).then((response) => {
				// console.log("new game request accepted", response);
				setPlayerColor(color);
				setGame(response.data.pk)
			});
		} catch (error) {
			console.log("server unavailable", error)
		}
	}

	const turnToConstant = (color) => {
		return color === "white" ? WHITE : BLACK
	}

	const getGameStatus = (status) => {
		switch (status) {
			case CHECKMATE_PLAYER:
				return "You won!";
			case CHECKMATE_OPPONENT:
				return "You lost!";
			case DRAWN:
				return "Drawn!";
			default:
				return false;
		}
	}

	useEffect(() => {
		startGame(difficultyOption, playerColorOption);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="container">
			<h1>Chess Game</h1>
			<div className="select-container">
				<label className="select-label">Select Difficulty:</label>
				<label className="select-label">
					<select
						value={difficultyOption}
						onChange={(e) => setDifficultyOption(e.target.value)}
					>
						<option value="beginner">Beginner</option>
						<option value="intermediate">Intermediate</option>
						<option value="advanced">Advanced</option>
					</select>
				</label>
				<label className="select-label">Select Color:</label>
				<label className="select-label">
					<select
						value={playerColorOption}
						onChange={(e) => setPlayerColorOption(e.target.value)}
					>
						<option value="white">White</option>
						<option value="black">Black</option>
					</select>
				</label>
			</div>
			<button className="start-button" onClick={() => startGame(difficultyOption, turnToConstant(playerColorOption))}>Start Game</button>
			<div className="chessboard-container">
				<ChessBoard game={game} playerColor={playerColor} endGame={setGame} />
			</div>
			{getGameStatus(game) && (
				<div className="game-status-message">
					{
					getGameStatus(game)
					}
				</div>
			)}
		</div>
	);
}

export default App;
