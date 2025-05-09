// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App





// import React, { useState } from 'react';
// import GameBoard from './components/GameBoard';


// function App() {
//   const [roomId, setRoomId] = useState('');
//   const [joined, setJoined] = useState(false);

//   const handleJoin = () => {
//     if (roomId.trim()) setJoined(true);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       {!joined ? (
//         <div>
//           <h1>Join a Game</h1>
//           <input
//             type="text"
//             value={roomId}
//             onChange={(e) => setRoomId(e.target.value)}
//             placeholder="Enter Room ID"
//           />
//           <button onClick={handleJoin}>Join</button>
//         </div>
//       ) : (
//         <GameBoard roomId={roomId} />
//       )}
//     </div>
//   );
// }

// export default App;


// import { useEffect, useState } from 'react';
// import { connectToWebSocket, sendMessage } from './websocket';

// function App() {
//   const [roomId, setRoomId] = useState('testroom');
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     connectToWebSocket(roomId, (data) => {
//       setMessages((prev) => [...prev, data]);
//     });
//   }, [roomId]);

//   const sendTest = () => {
//     sendMessage({ move: "X at (1,1)" });
//   };

//   return (
//     <div>
//       <h1>WebSocket Test</h1>
//       <button onClick={sendTest}>Send Test Move</button>
//       <ul>
//         {messages.map((msg, index) => (
//           <li key={index}>{JSON.stringify(msg)}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;



// function App() {
//   return <h1>Hello from Vite + React!</h1>;
// }
// export default App;



// import { useEffect, useState } from "react";
// import GameBoard from './components/GameBoard';
// import { connectToWebSocket, sendMessage } from "./websocket";

// const initialBoard = Array(9).fill(null);

// function App() {
//   const [roomId] = useState("testroom");
//   const [board, setBoard] = useState(initialBoard);
//   const [isX, setIsX] = useState(true); // Toggle between X and O
//   const [status, setStatus] = useState("Connecting...");

//   useEffect(() => {
//     connectToWebSocket(roomId, handleIncoming);
//     setStatus("Connected. X goes first.");
//   }, []);

//   function handleIncoming(data) {
//     if (data.board) {
//       setBoard(data.board);
//       setIsX(data.nextTurn === "X");
//       setStatus(data.status || "Your turn");
//     }
//   }

//   function handleClick(index) {
//     if (board[index] || calculateWinner(board)) return;

//     const newBoard = [...board];
//     newBoard[index] = isX ? "X" : "O";
//     const nextTurn = isX ? "O" : "X";
//     const winner = calculateWinner(newBoard);
//     const isDraw = !winner && newBoard.every(cell => cell !== null);

//     const statusMsg = winner
//       ? `Winner: ${winner}`
//       : isDraw
//       ? "It's a draw!"
//       : `Next: ${nextTurn}`;

//     sendMessage({
//       board: newBoard,
//       nextTurn,
//       status: statusMsg,
//     });
//   }

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h1>Tic Tac Toe</h1>
//       <p>{status}</p>
//       <GameBoard board={board} onCellClick={handleClick} />
//     </div>
//   );
// }

// // Check winner
// function calculateWinner(board) {
//   const lines = [
//     [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
//     [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
//     [0, 4, 8], [2, 4, 6],            // Diagonals
//   ];
//   for (let [a, b, c] of lines) {
//     if (board[a] && board[a] === board[b] && board[a] === board[c])
//       return board[a];
//   }
//   return null;
// }

// export default App;



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import './App.css';

// function App() {
//   const [roomId, setRoomId] = useState("");
//   const navigate = useNavigate();

//   const handleJoin = () => {
//     if (roomId.trim() !== "") {
//       navigate(`/game/${roomId}`);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h1>Join a Game</h1>
//       <input
//         type="text"
//         placeholder="Enter room name"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//         style={{ padding: "10px", fontSize: "16px" }}
//       />
//       <br /><br />
//       <button onClick={handleJoin} style={{ padding: "10px 20px" }}>
//         Join Room
//       </button>
//     </div>
//   );
// }

// export default App;



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import './App.css';

// function App() {
//   const [roomId, setRoomId] = useState("");
//   const [playerName, setPlayerName] = useState("");
//   const navigate = useNavigate();

//   const handleJoin = () => {
//     if (roomId.trim() && playerName.trim()) {
//       localStorage.setItem("playerName", playerName);
//       navigate(`/game/${roomId}`);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h1>Join a Game</h1>
//       <input
//         type="text"
//         placeholder="Enter your name"
//         value={playerName}
//         onChange={(e) => setPlayerName(e.target.value)}
//       />
//       <br /><br />
//       <input
//         type="text"
//         placeholder="Enter room name"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//       />
//       <br /><br />
//       <button onClick={handleJoin}>Join Room</button>
//     </div>
//   );
// }

// export default App;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

export default function App() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [vsAI, setVsAI] = useState(false);
  const navigate = useNavigate();

  const handleJoin = () => {
    const finalRoom = vsAI ? `ai-${Date.now()}` : room;
    const aiParam = vsAI ? "?ai=true" : "";
    navigate(`/game/${finalRoom}${aiParam}&name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <input
        className="border p-2 rounded"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {!vsAI && (
        <input
          className="border p-2 rounded"
          placeholder="Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
      )}
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={vsAI} onChange={() => setVsAI(!vsAI)} />
        Play vs AI
      </label>
      <button
        onClick={handleJoin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Join Game
      </button>
    </div>
  );
}


