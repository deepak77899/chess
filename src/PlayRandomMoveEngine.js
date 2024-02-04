import { useState ,useEffect} from "react";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";


export default function PlayRandomMoveEngine() {

const chess=new Chess()
  const [game, setGame] = useState(chess);
 
  function makeAMove(move) {
   const gameCopy = new Chess(game.fen());
   
    const result = gameCopy.move(move);
    
    setGame(gameCopy);
   
    // console.log(gameCopy.moves())
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    setGame((prevGame) => {
      const possibleMoves = prevGame.moves();
  
      if (possibleMoves.length === 0) return prevGame; // exit if the game is over
  
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  
      const gameCopy = new Chess(prevGame.fen());
      gameCopy.move(possibleMoves[randomIndex]);
  
      return gameCopy;
    });
  }
  

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

 
    if (move === null) return false;

    setTimeout(makeRandomMove, 200);
    console.log(game);
    return true;
  }

  return <Chessboard position={game.fen()}  onPieceDrop={onDrop}/>;
}