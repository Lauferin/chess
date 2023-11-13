import React, { Fragment } from "react";
import Header from "./components/Header";
import ChessBoard from './components/chess_board/ChessBoard';


const App = () => {
	return (
		<Fragment>
			<Header />
			<ChessBoard />
		</Fragment>
	);
}

export default App;
