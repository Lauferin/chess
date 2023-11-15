import React, { Component } from "react";

class Header extends Component {
	render() {
		return (
			<div>
				&nbsp;
				<hr />
				<button onClick={() => {this.props.startGame("white")}}>Start white</button>
				<button onClick={() => {this.props.startGame("black")}} style={{backgroundColor: "black", color: "white"}}>Start black</button>
			</div>
		);
	}
}

export default Header;