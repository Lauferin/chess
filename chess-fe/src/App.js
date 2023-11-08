import React, { Fragment } from "react";
import Header from "./components/Header";
import ChessTable from './components/chess_table/ChessTable';


const App = () => {
  return (
    <Fragment>
      <Header />
      <ChessTable />
    </Fragment>
  );
}

export default App;
