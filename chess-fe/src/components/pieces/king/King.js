import { Component } from "react";
import blackKing from './black_king.svg'
import whiteKing from './white_king.svg'

class King extends Component {

    render() {
        if (this.props.color === 'white') {
            return (
                <div><img src={whiteKing} alt="white king" /></div>
            )
        } else {
            return (
                <div><img src={blackKing} alt="black king" /></div>
            )
        }
    }
}

export default King