import React, { Component } from "react";
import { WHITE, BLACK, CHECKMATE_PLAYER, CHECKMATE_OPPONENT, DRAWN } from "../constants";

class Header extends Component {
	
	render() {
		let content = "";
		switch (this.props.gameState) {
			case CHECKMATE_PLAYER:
				content = "You won!";
			break;
			case CHECKMATE_OPPONENT:
				content = "You lost!";
			break;
			case DRAWN:
				content = "Drawn!";
			break;
			default:
				content = "";
		}
	
		return (
			<div>
				&nbsp;
				<hr />
				<button onClick={() => {this.props.startGame(WHITE)}}>Start white</button>
				<button onClick={() => {this.props.startGame(BLACK)}} style={{backgroundColor: "black", color: "white"}}>Start black</button>
				<div>{content}</div>
			</div>
		);
	}
}

export default Header;