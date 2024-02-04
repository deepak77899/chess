import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import "../../App.css"
export const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [currentPlayer, setCurrentPlayer] = useState('w');

  const onDrop = (source,target) => {
    try {
      if (currentPlayer === game.turn()) {
        const move = game.move({ from: source, to: target });
        console.log(move);
        if (move) {
          console.log(game);
          setGame(game); //
          setCurrentPlayer(move.color === 'w' ? 'b' : 'w'); // Switch turns
        }
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h1 className='currentPlayer'>{(currentPlayer=='w')?"whites turn":"Black'sTurn"}</h1>
      <Chessboard
        id="chessboard"
        position={game.fen()}
        isDraggablePiece={({ piece }) => piece[0] === currentPlayer}
        onPieceDrop={(source, target) => onDrop(source, target)}
        customStatusText={`It's ${currentPlayer}'s turn.`}
      />
      {/* ... other UI elements and logic */}
    </div>
  );
};