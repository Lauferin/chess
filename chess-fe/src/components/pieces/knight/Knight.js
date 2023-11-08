import { Component } from "react";
import blackKnight from './black_knight.svg'
import whiteKnight from './white_knight.svg'

class Knight extends Component {

    render() {
        if (this.props.color === 'white') {
            return (
                <div><img src={whiteKnight} alt="white bishop" /></div>
            )
        } else {
            return (
                <div><img src={blackKnight} alt="black bishop" /></div>
            )
        }
    }

}

export default Knight