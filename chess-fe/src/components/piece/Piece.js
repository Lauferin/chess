import React, { Component } from "react";

import Rook from '../pieces/rook/Rook.js'
import Pawn from '../pieces/pawn/Pawn.js'
import Queen from '../pieces/queen/Queen.js'
import King from '../pieces/king/King.js'
import Knight from '../pieces//knight/Knight.js'
import Bishop from '../pieces/bishop/Bishop.js'


class Piece extends Component {

    render() {
        switch(this.props.nature) {
            case "rook": return (<div><Rook color={this.props.color}/></div>);
            case "pawn": return (<div><Pawn color={this.props.color} /></div>);
            case "queen": return (<div><Queen color={this.props.color} /></div>);
            case "king": return (<div><King color={this.props.color} /></div>);
            case "knight": return (<div><Knight color={this.props.color} /></div>);
            case "bishop": return (<div><Bishop color={this.props.color} /></div>);
            default: return(<div></div>)
        }
    }

}

export default Piece
