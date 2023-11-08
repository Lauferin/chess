import { Component } from "react";
import blackPawn from './black_pawn.svg'
import whitePawn from './white_pawn.svg'

class Pawn extends Component {

    render() {
        if (this.props.color === 'white') {
            return (
                <div><img src={whitePawn} alt="white pawn" /></div>
            )
        } else {
            return (
                <div><img src={blackPawn} alt="black pawn" /></div>
            )
        }
    }
    
}

export default Pawn