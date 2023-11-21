import React,  { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Header from "./components/Header";
import ChessBoard from './components/chess_board/ChessBoard';

const App = () => {

	const [game, setGame] = useState(null);
	const [player, setPlayer] = useState(null);

	const startGame = (color) => {
		try {
			axios.post("http://localhost:8000/api/games/").then((response) => {
				console.log("new game request accepted", response);
				setPlayer(color);
				setGame(response.data.pk)
			});
		} catch (error) {
			console.log("server unavailable", error)
		}
	}

	useEffect(() => {
		startGame("white");
	}, []);

	return (
		<div className="App">
			<Header startGame={startGame} />
			<ChessBoard game={game} player={player} />
		</div>
	);
}

export default App;
