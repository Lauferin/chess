import { Component } from "react";

import blackQueen from './black_queen.svg'
import whiteQueen from './white_queen.svg'

class Queen extends Component {

    render() {
        if (this.props.color === 'white') {
            return (
                <div><img src={whiteQueen} alt="white queen" /></div>
            )
        } else {
            return (
                <div><img src={blackQueen} alt="black queen" /></div>
            )
        }
    }
}

export default Queen