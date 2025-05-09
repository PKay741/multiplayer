// import React, { useState, useEffect } from 'react';
// import { connectToRoom, sendMove } from '../websocket';

// const GameBoard = ({ roomId }) => {
//   const [board, setBoard] = useState(Array(9).fill(""));
//   const [turn, setTurn] = useState("X");

//   useEffect(() => {
//     connectToRoom(roomId, (move) => {
//       const newBoard = [...board];
//       newBoard[move.index] = move.symbol;
//       setBoard(newBoard);
//       setTurn(move.symbol === "X" ? "O" : "X");
//     });
//   }, [roomId]);

//   const handleClick = (index) => {
//     if (!board[index]) {
//       const newBoard = [...board];
//       newBoard[index] = turn;
//       setBoard(newBoard);
//       sendMove({ index, symbol: turn });
//       setTurn(turn === "X" ? "O" : "X");
//     }
//   };

//   return (
//     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)' }}>
//       {board.map((val, i) => (
//         <div key={i} onClick={() => handleClick(i)} style={{
//           border: '1px solid black',
//           width: '100px',
//           height: '100px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           fontSize: '2rem',
//         }}>
//           {val}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GameBoard;



import React from "react";

export default function GameBoard({ board, onCellClick }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)", gap: "5px" }}>
      {board.map((cell, i) => (
        <div
          key={i}
          onClick={() => onCellClick(i)}
          style={{
            width: "100px",
            height: "100px",
            border: "2px solid #444",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            cursor: "pointer",
            backgroundColor: "orange",
          }}
        >
          {cell}
        </div>
      ))}
    </div>
  );
}
