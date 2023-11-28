import React, { Component } from "react";
import { WHITE, BLACK } from "../constants";

class Header extends Component {
	render() {
		return (
			<div>
				&nbsp;
				<hr />
				<button onClick={() => {this.props.startGame(WHITE)}}>Start white</button>
				<button onClick={() => {this.props.startGame(BLACK)}} style={{backgroundColor: "black", color: "white"}}>Start black</button>
			</div>
		);
	}
}

export default Header;