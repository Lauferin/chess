import { Component } from "react";
import blackBishop from './black_bishop.svg'
import whiteBishop from './white_bishop.svg'

class Bishop extends Component {

    render() {
        if (this.props.color === 'white') {
            return (
                <div><img src={whiteBishop} alt="white bishop" /></div>
            )
        } else {
            return (
                <div><img src={blackBishop} alt="black bishop" /></div>
            )
        }
    }

}

export default Bishop