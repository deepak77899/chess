import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import "../../App.css"

export const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState('w');

 
  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square) {
    console.log(game.isCheck());
    setRightClickedSquares({});

    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        moveFrom,
        verbose: true,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setCurrentPlayer(move.color === 'w' ? 'b' : 'w'); // Switch turns
        setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const move = game.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setCurrentPlayer(move.color === 'w' ? 'b' : 'w'); // Switch turns
      setGame(game);
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(piece) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      game.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      setGame(game);
    }

    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }

  function onSquareRightClick(square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }
  const onDrop = (source,target) => {
    try {
      const moves = game.moves({
        moveFrom,
        verbose: true,
      });
      if(game.isGameOver() || game.isDraw() || moves.length === 0){
        game.reset();
      }
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
    <>
      <h1 className='currentPlayer'>{(currentPlayer=='w')?"whites turn":"Black'sTurn"}</h1>
      <Chessboard
        id="ClickToMove"
        animationDuration={200}
        position={game.fen()}
        isDraggablePiece={({ piece }) => piece[0] === currentPlayer}
        onPieceDrop={(source, target) => onDrop(source, target)}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
        onArrowsChange={function noRefCheck(){}}
    onDragOverSquare={function noRefCheck(){}}
    onMouseOutSquare={function noRefCheck(){}}
    onMouseOverSquare={function noRefCheck(){}}
    onPieceClick={function noRefCheck(){}}
    onPieceDragBegin={function noRefCheck(){}}
    onPieceDragEnd={function noRefCheck(){}}
    // onPieceDrop={function noRefCheck(){}}
    onPromotionCheck={function noRefCheck(){}}
    // onPromotionPieceSelect={function noRefCheck(){}}
    // onSquareClick={function noRefCheck(){}}
    // onSquareRightClick={function noRefCheck(){}}
      />
        <button
          onClick={() => {
          game.reset();
          setMoveSquares({});
          setOptionSquares({});
          setRightClickedSquares({});
        }}
      >
        reset
      </button>
      <button
        onClick={
          () => {
          game.undo();
          setMoveSquares({});
          setOptionSquares({});
          setRightClickedSquares({});
        }}
      >
        undo
      </button>
    </>
  );
}