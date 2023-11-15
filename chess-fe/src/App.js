import React,  { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import ChessBoard from './components/chess_board/ChessBoard';

const App = () => {

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const [game, setGame] = useState(0);
	const [player, setPlayer] = useState("white");

	const startGame = (color) => {
		setPlayer(color);
		setGame(getRandomInt(1, 999999999))
	}

	return (
		<div className="App">
			<Header startGame={startGame} />
			<ChessBoard game={game} player={player} />
		</div>
	);
}

export default App;
