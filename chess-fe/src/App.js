import React,  { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Header from "./components/Header";
import ChessBoard from './components/chess_board/ChessBoard';
import { WHITE, GAMES_URL } from "./constants";

const App = () => {

	const [game, setGame] = useState(null);
	const [playerColor, setPlayerColor] = useState(null);

	const startGame = (color) => {
		const data = {"player_color": color, "opponent": "basic"}
		try {
			axios.post(GAMES_URL, data).then((response) => {
				console.log("new game request accepted", response);
				setPlayerColor(color);
				setGame(response.data.pk)
			});
		} catch (error) {
			console.log("server unavailable", error)
		}
	}

	useEffect(() => {
		startGame(WHITE);
	}, []);

	return (
		<div className="App">
			<Header startGame={startGame} gameState={game} />
			<ChessBoard game={game} playerColor={playerColor} endGame={setGame} />
		</div>
	);
}

export default App;
