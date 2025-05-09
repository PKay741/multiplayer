// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import GameBoard from "./components/GameBoard";
// import { connectToWebSocket, sendMessage } from "./websocket";

// const initialBoard = Array(9).fill(null);

// function Game() {
//   const { roomId } = useParams();
//   const [board, setBoard] = useState(initialBoard);
//   const [isX, setIsX] = useState(true);
//   const [status, setStatus] = useState("Connecting...");

//   useEffect(() => {
//     connectToWebSocket(roomId, handleIncoming);
//     setStatus("Connected. X goes first.");
//   }, [roomId]);

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
//       <h2>Room: {roomId}</h2>
//       <p>{status}</p>
//       <GameBoard board={board} onCellClick={handleClick} />
//     </div>
//   );
// }

// function calculateWinner(board) {
//   const lines = [
//     [0,1,2], [3,4,5], [6,7,8],
//     [0,3,6], [1,4,7], [2,5,8],
//     [0,4,8], [2,4,6]
//   ];
//   for (let [a, b, c] of lines) {
//     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//       return board[a];
//     }
//   }
//   return null;
// }

// export default Game;



// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import GameBoard from "./components/GameBoard";
// import { connectToWebSocket, sendMessage } from "./websocket";
// import GameOverModal from "./GameOverModal";


// const initialBoard = Array(9).fill(null);

// function Game() {
//   const { roomId } = useParams();
//   const playerName = localStorage.getItem("playerName") || "Player";
//   const [board, setBoard] = useState(initialBoard);
//   const [status, setStatus] = useState("Connecting...");
//   const [players, setPlayers] = useState({});
//   const [me, setMe] = useState(null); // "X" or "O"
//   const [scores, setScores] = useState({ X: 0, O: 0 });
//   const [winner, setWinner] = useState(null);
//   const [showModal, setShowModal] = useState(false);


//   useEffect(() => {
//     connectToWebSocket(roomId, handleIncoming);
//     sendMessage({ type: "join", player: playerName });
//   }, []);

//   function handleIncoming(data) {
//     if (data.type === "state") {
//       setBoard(data.board);
//       setStatus(data.status);
//       setPlayers(data.players || {});
//       setScores(data.scores || {});
    
//       if (data.status.includes("wins")) {
//         const winPlayer = data.status.split(" ")[0];
//         setWinner(winPlayer);
//         setShowModal(true);
//       } else if (data.status === "Draw!") {
//         setWinner(null);
//         setShowModal(true);
//       }
//     }
    
//   }

//   function handleClick(index) {
//     if (!me || board[index] || calculateWinner(board)) return;

//     const newBoard = [...board];
//     newBoard[index] = me;

//     sendMessage({
//       type: "move",
//       board: newBoard,
//       player: me,
//     });
//   }

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>Room: {roomId}</h2>
//       <p>You are: {me} ({playerName})</p>
//       <p>{status}</p>
//       <GameBoard board={board} onCellClick={handleClick} />

//       <h3>Scoreboard</h3>
//       <p>X ({players.X || "?"}): {scores.X || 0}</p>
//       <p>O ({players.O || "?"}): {scores.O || 0}</p>
//     </div>
//   );

//   function restartGame() {
//     setShowModal(false);
//     setWinner(null);
//   }

//   {showModal && <GameOverModal winner={winner} onRestart={restartGame} />}

// }

// function calculateWinner(board) {
//   const lines = [
//     [0,1,2], [3,4,5], [6,7,8],
//     [0,3,6], [1,4,7], [2,5,8],
//     [0,4,8], [2,4,6]
//   ];
//   for (let [a, b, c] of lines) {
//     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//       return board[a];
//     }
//   }
//   return null;
// }



// export default Game;




// import { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import GameBoard from "./components/GameBoard";
// import { connectToWebSocket, sendMessage } from "./websocket";
// import GameOverModal from "./GameOverModal";

// const initialBoard = Array(9).fill(null);

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// function Game() {
//   const { roomId } = useParams();
//   const query = useQuery();
//   const vsAI = query.get("ai") === "true";
//   const playerName = localStorage.getItem("playerName") || "Player";

//   const [board, setBoard] = useState(initialBoard);
//   const [status, setStatus] = useState("Connecting...");
//   const [players, setPlayers] = useState({});
//   const [me, setMe] = useState(null); // "X" or "O"
//   const [scores, setScores] = useState({ X: 0, O: 0 });
//   const [winner, setWinner] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     connectToWebSocket(roomId, handleIncoming);

//     // Join as human; backend will auto-add AI if needed
//     sendMessage({ type: "join", name: playerName });

//     // Delay-simulate AI joining if needed
//     if (vsAI) {
//       setTimeout(() => {
//         sendMessage({ type: "join", name: "AI" });
//       }, 500);
//     }
//   }, []);

//   function handleIncoming(data) {
//     if (data.type === "assign") {
//       setMe(data.symbol);
//     }

//     if (data.type === "state") {
//       setBoard(data.board);
//       setStatus(data.status);
//       setPlayers(data.players || {});
//       setScores(data.scores || {});

//       if (data.status.includes("wins")) {
//         const winPlayer = data.status.split(" ")[0];
//         setWinner(winPlayer);
//         setShowModal(true);
//       } else if (data.status === "Draw!") {
//         setWinner(null);
//         setShowModal(true);
//       }
//     }
//   }

//   function handleClick(index) {
//     if (!me || board[index] || calculateWinner(board)) return;

//     sendMessage({
//       type: "move",
//       index: index,
//     });
//   }

//   function restartGame() {
//     setShowModal(false);
//     setWinner(null);
//     sendMessage({ type: "restart" });  
//   }

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>Room: {roomId}</h2>
//       <p>You are: {me} ({playerName})</p>
//       <p>{status}</p>
//       <GameBoard board={board} onCellClick={handleClick} />

//       <h3>Scoreboard</h3>
//       <p>X ({players.X || "?"}): {scores.X || 0}</p>
//       <p>O ({players.O || "?"}): {scores.O || 0}</p>

//       {showModal && <GameOverModal winner={winner} onRestart={restartGame} />}
//     </div>
//   );
// }

// function calculateWinner(board) {
//   const lines = [
//     [0,1,2], [3,4,5], [6,7,8],
//     [0,3,6], [1,4,7], [2,5,8],
//     [0,4,8], [2,4,6]
//   ];
//   for (let [a, b, c] of lines) {
//     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//       return board[a];
//     }
//   }
//   return null;
// }

// export default Game;



// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import GameBoard from "./components/GameBoard";
// import { connectToWebSocket, sendMessage } from "./websocket";
// import GameOverModal from "./GameOverModal";

// const initialBoard = Array(9).fill(null);

// function Game() {
//   const { roomId } = useParams();
//   const playerName = localStorage.getItem("playerName") || "Player";
//   const [board, setBoard] = useState(initialBoard);
//   const [status, setStatus] = useState("Connecting...");
//   const [players, setPlayers] = useState({});
//   const [me, setMe] = useState(null);
//   const [scores, setScores] = useState({ X: 0, O: 0 });
//   const [winner, setWinner] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [myTurn, setMyTurn] = useState(false);

//   useEffect(() => {
//     connectToWebSocket(roomId, handleIncoming);
//     sendMessage({ type: "join", name: playerName });
//   }, []);

//   function handleIncoming(data) {
//     if (data.type === "assign") {
//       setMe(data.symbol);
//     } else if (data.type === "state") {
//       setBoard(data.board);
//       setPlayers(data.players || {});
//       setScores(data.scores || {});
//       setStatus(data.status || "");
//       if (data.status?.includes("wins") || data.status === "Draw!") {
//         setWinner(data.status.includes("wins") ? data.status.split(" ")[0] : null);
//         setShowModal(true);
//       }
//       setMyTurn(data.turn === me);
//     }
//   }

//   function handleClick(index) {
//     if (!me || !myTurn || board[index]) return;
//     sendMessage({ type: "move", index });
//   }

//   function restartGame() {
//     setShowModal(false);
//     setWinner(null);
//     setBoard(initialBoard);
//     setStatus("Restarting...");
//     sendMessage({ type: "restart" });
//   }

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>Room: {roomId}</h2>
//       <p>You are: {me} ({playerName})</p>
//       <p>{status}</p>

//       <GameBoard board={board} onCellClick={handleClick} />

//       <h3>Scoreboard</h3>
//       <p>X ({players.X || "?"}): {scores.X || 0}</p>
//       <p>O ({players.O || "?"}): {scores.O || 0}</p>

//       {showModal && (
//         <GameOverModal winner={winner} onRestart={restartGame} />
//       )}
//     </div>
//   );
// }

// export default Game;


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import GameBoard from "./components/GameBoard";
// import { connectToWebSocket, sendMessage } from "./websocket";
// import GameOverModal from "./GameOverModal";

// const initialBoard = Array(9).fill(null);

// function Game() {
//   const { roomId } = useParams();
//   const playerName = localStorage.getItem("playerName") || "Player";
//   const [board, setBoard] = useState(initialBoard);
//   const [status, setStatus] = useState("Connecting...");
//   const [players, setPlayers] = useState({});
//   const [me, setMe] = useState(null); // "X" or "O"
//   const [scores, setScores] = useState({ X: 0, O: 0 });
//   const [winner, setWinner] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     connectToWebSocket(roomId, handleIncoming, () => {
//       sendMessage({ type: "join", name: playerName });
//     });
//   }, [roomId, playerName]);
  
//   // useEffect(() => {
//   //   connectToWebSocket(roomId, handleIncoming);
//   // }, [roomId]);

//   useEffect(() => {
//     sendMessage({ type: "join", name: playerName });
//   }, [playerName]);

//   function handleIncoming(data) {
//     if (data.type === "assign") {
//       setMe(data.symbol);
//     } else if (data.type === "state") {
//       setBoard(data.board);
//       setStatus(data.status);
//       setPlayers(data.players || {});
//       setScores(data.scores || {});
      
//       // Trigger game over modal
//       if (data.status.includes("wins")) {
//         const winPlayer = data.status.split(" ")[0];
//         setWinner(winPlayer);
//         setShowModal(true);
//       } else if (data.status === "Draw!") {
//         setWinner(null);
//         setShowModal(true);
//       }
//     } else if (data.type === "error") {
//       setStatus(data.message);
//     }
//   }

//   function handleClick(index) {
//     if (!me || board[index] || winner || status.startsWith("Connecting")) return;

//     sendMessage({
//       type: "move",
//       index: index,
//     });
//   }

//   function restartGame() {
//     setShowModal(false);
//     setWinner(null);
//     setBoard(initialBoard);
//     sendMessage({ type: "restart" });
//   }

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>Room: {roomId}</h2>
//       <p>You are: {me} ({players[me] || playerName})</p>
//       <p>{status}</p>
//       <GameBoard board={board} onCellClick={handleClick} />

//       <h3>Scoreboard</h3>
//       <p>X ({players.X || "?"}): {scores.X || 0}</p>
//       <p>O ({players.O || "?"}): {scores.O || 0}</p>

//       {showModal && (
//         <GameOverModal winner={winner} onRestart={restartGame} />
//       )}
//     </div>
//   );
// }

// export default Game;



// import { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom"; // add useLocation
// import GameBoard from "./components/GameBoard";
// import { connectToWebSocket, sendMessage } from "./websocket";
// import GameOverModal from "./GameOverModal";

// const initialBoard = Array(9).fill(null);

// function Game() {
//   const { roomId } = useParams();
//   const location = useLocation();

//   const queryParams = new URLSearchParams(location.search);
//   let playerName = queryParams.get("name") || "Player";
//   // const isAI = queryParams.get("ai") === "true";

//   // Prevent "AI" name conflict
//   if (playerName.toLowerCase() === "ai" || playerName.toLowerCase() === "computer") {
//     playerName = "Player";
//   }

//   // Prevent users from using "AI" as their name
//   // let storedName = localStorage.getItem("playerName") || "Player";
//   // if (storedName.toLowerCase() === "ai" || storedName.toLowerCase() === "computer") {
//   //   storedName = "Player";
//   // }
//   // const playerName = storedName;

//   const [board, setBoard] = useState(initialBoard);
//   const [status, setStatus] = useState("Connecting...");
//   const [players, setPlayers] = useState({});
//   const [me, setMe] = useState(null); // "X" or "O"
//   const [scores, setScores] = useState({ X: 0, O: 0 });
//   const [winner, setWinner] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     connectToWebSocket(roomId, handleIncoming, () => {
//       sendMessage({ type: "join", name: playerName });
//     });
//   }, [roomId, playerName]);

//   function handleIncoming(data) {
//     if (data.type === "assign") {
//       setMe(data.symbol);
//     } else if (data.type === "state") {
//       setBoard(data.board);
//       setStatus(data.status);
//       setPlayers(data.players || {});
//       setScores(data.scores || {});

//       // Show modal if there's a win or draw
//       if (data.status.includes("wins")) {
//         const winPlayer = data.status.split(" ")[0];
//         setWinner(winPlayer);
//         setShowModal(true);
//       } else if (data.status === "Draw!") {
//         setWinner(null);
//         setShowModal(true);
//       }
//     } else if (data.type === "error") {
//       setStatus(data.message);
//     }
//   }

//   function handleClick(index) {
//     if (!me || board[index] || winner || status.startsWith("Connecting")) return;

//     sendMessage({
//       type: "move",
//       index: index,
//     });
//   }

//   function restartGame() {
//     setShowModal(false);
//     setWinner(null);
//     setBoard(initialBoard);
//     sendMessage({ type: "restart" });
//   }

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>Room: {roomId}</h2>
//       <p>You are: {me} ({players[me] || playerName})</p>
//       <p>{status}</p>

//       <GameBoard board={board} onCellClick={handleClick} />

//       <h3>Scoreboard</h3>
//       <p>X ({players.X || "?"}): {scores.X || 0}</p>
//       <p>O ({players.O || "?"}): {scores.O || 0}</p>

//       {showModal && (
//         <GameOverModal winner={winner} me={me} onRestart={restartGame} />
//       )}
//     </div>
//   );
// }

// export default Game;



// import { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import GameBoard from "./components/GameBoard";
// import { connectToWebSocket, sendMessage } from "./websocket";
// import GameOverModal from "./GameOverModal";

// const initialBoard = Array(9).fill(null);

// function Game() {
//   const { roomId: rawRoomId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const queryParams = new URLSearchParams(location.search);
//   let playerName = queryParams.get("name") || "Player";
//   const wantsAI = queryParams.get("ai") === "true";

//   // Prevent reserved names
//   if (playerName.toLowerCase() === "ai" || playerName.toLowerCase() === "computer") {
//     playerName = "Player";
//   }

//   // Enforce ai- prefix if it's an AI game
//   const roomId = wantsAI && !rawRoomId.startsWith("ai-") ? `ai-${rawRoomId}` : rawRoomId;

//   // Redirect if AI game and room ID is missing prefix
//   useEffect(() => {
//     if (wantsAI && !rawRoomId.startsWith("ai-")) {
//       navigate(`/game/${roomId}?name=${playerName}&ai=true`, { replace: true });
//     }
//   }, [rawRoomId, roomId, wantsAI, playerName, navigate]);

//   const [board, setBoard] = useState(initialBoard);
//   const [status, setStatus] = useState("Connecting...");
//   const [players, setPlayers] = useState({});
//   const [me, setMe] = useState(null); // "X" or "O"
//   const [scores, setScores] = useState({ X: 0, O: 0 });
//   const [winner, setWinner] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     console.log("Connecting to WebSocket for room:", roomId);

//     connectToWebSocket(roomId, handleIncoming, () => {
//       console.log("Sending join message for:", playerName);
//       sendMessage({ type: "join", name: playerName });
//     });
//   }, [roomId, playerName]);

//  useEffect(() => {
//     if (!status.includes("wins") && status !== "Draw!" && !status.startsWith("Game restarted")) {
//       setShowModal(false);
//     }
//   }, [status]);


//   function handleIncoming(data) {
//     console.log("Incoming message:", data);
  
//     if (data.type === "assign") {
//       setMe(data.symbol);
//     } else if (data.type === "state") {
//       setBoard(data.board);
//       setStatus(data.status);
//       setPlayers(data.players || {});
//       setScores(data.scores || {});
  
//       if (data.game_over) {
//         const status = data.status;
  
//         if (status.startsWith("Draw")) {
//           setWinner(null);
//         } else if (status.includes("X wins")) {
//           setWinner("X");
//         } else if (status.includes("O wins")) {
//           setWinner("O");
//         }
  
//         setShowModal(true);
//       } else {
//         setShowModal(false);
//         setWinner(null);
//       }
//     } else if (data.type === "error") {
//       setStatus(data.message);
//     }
//   }
  
  

//   // function handleIncoming(data) {
//   //   console.log("Incoming message:", data);

//   //   if (data.type === "assign") {
//   //     setMe(data.symbol);
//   //   } else if (data.type === "state") {
//   //     setBoard(data.board);
//   //     setStatus(data.status);
//   //     setPlayers(data.players || {});
//   //     setScores(data.scores || {});

//   //     if (data.game_over) {
//   //       if (data.status.startsWith("Draw")) {
//   //         setWinner(null);
//   //       } else {
//   //         setWinner(data.status[0]);  // 'X' or 'O'
//   //       }
//   //       setShowModal(true);
//   //     }
//   //   } else if (data.type === "error") {
//   //     setStatus(data.message);
//   //   }
//   // }

//   //     if (data.status.includes("wins")) {
//   //       const winPlayer = data.status.split(" ")[0];
//   //       setWinner(winPlayer);
//   //       setShowModal(true);
//   //     } else if (data.status === "Draw!") {
//   //       setWinner(null);
//   //       setShowModal(true);
//   //     }
//   //   } else if (data.type === "error") {
//   //     setStatus(data.message);
//   //   }
//   // }

//   function handleClick(index) {
//     if (!me || board[index] || winner || status.startsWith("Connecting")) return;

//     sendMessage({
//       type: "move",
//       index: index,
//     });
//   }

//   function restartGame() {
//     setShowModal(false);
//     setWinner(null);
//     setBoard(initialBoard);
//     sendMessage({ type: "restart" });
//   }

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>Room: {roomId}</h2>
//       <p>You are: {me} ({players[me] || playerName})</p>
//       <p>{status}</p>

//       <GameBoard board={board} onCellClick={handleClick} />

//       <h3>Scoreboard</h3>
//       <p>X ({players.X || "?"}): {scores.X || 0}</p>
//       <p>O ({players.O || "?"}): {scores.O || 0}</p>

//       {showModal && (
//         <GameOverModal winner={winner} me={me} onRestart={restartGame} />
//       )}
//     </div>
//   );
// }

// export default Game;


import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import GameBoard from "./components/GameBoard";
import { connectToWebSocket, sendMessage } from "./websocket";
import GameOverModal from "./GameOverModal";

const initialBoard = Array(9).fill(null);

function Game() {
  const { roomId: rawRoomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  let playerName = queryParams.get("name") || "Player";
  const wantsAI = queryParams.get("ai") === "true";

  // Prevent reserved names
  if (["ai", "computer"].includes(playerName.toLowerCase())) {
    playerName = "Player";
  }

  // Enforce ai- prefix if it's an AI game
  const roomId = wantsAI && !rawRoomId.startsWith("ai-") ? `ai-${rawRoomId}` : rawRoomId;

  // Redirect if AI game and room ID is missing prefix
  useEffect(() => {
    if (wantsAI && !rawRoomId.startsWith("ai-")) {
      navigate(`/game/${roomId}?name=${playerName}&ai=true`, { replace: true });
    }
  }, [rawRoomId, roomId, wantsAI, playerName, navigate]);

  const [board, setBoard] = useState(initialBoard);
  const [status, setStatus] = useState("Connecting...");
  const [players, setPlayers] = useState({});
  const [me, setMe] = useState(null); // "X" or "O"
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [winner, setWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    connectToWebSocket(roomId, handleIncoming, () => {
      sendMessage({ type: "join", name: playerName });
    });
  }, [roomId, playerName]);

  function handleIncoming(data) {
    console.log("Incoming message:", data);

    if (data.type === "assign") {
      setMe(data.symbol);
    } else if (data.type === "state") {
      setBoard(data.board);
      setStatus(data.status);
      setPlayers(data.players || {});
      setScores(data.scores || {});

      // Detect game over
      if (data.status.endsWith("wins!")) {
        const winPlayer = data.status.split(" ")[0];
        setWinner(winPlayer);
        setShowModal(true);
      } else if (data.status === "Draw!") {
        setWinner(null);
        setShowModal(true);
      } else {
        // Reset modal when game restarts or is ongoing
        setWinner(null);
        setShowModal(false);
      }
    } else if (data.type === "error") {
      setStatus(data.message);
    }
  }

  function handleClick(index) {
    if (!me || board[index] || winner || status.startsWith("Connecting")) return;

    sendMessage({
      type: "move",
      index: index,
    });
  }

  function restartGame() {
    setShowModal(false);
    setWinner(null);
    setBoard(initialBoard);
    sendMessage({ type: "restart" });
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Room: {roomId}</h2>
      <p>You are: {me} ({players[me] || playerName})</p>
      <p>{status}</p>

      <GameBoard board={board} onCellClick={handleClick} />

      <h3>Scoreboard</h3>
      <p>X ({players.X || "?"}): {scores.X || 0}</p>
      <p>O ({players.O || "?"}): {scores.O || 0}</p>

      {showModal && (
        <GameOverModal winner={winner} me={me} onRestart={restartGame} />
      )}
    </div>
  );
}

export default Game;




// import { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import GameBoard from "./components/GameBoard";
// import { connectToWebSocket, sendMessage } from "./websocket";
// import GameOverModal from "./GameOverModal";

// const initialBoard = Array(9).fill(null);

// function Game() {
//   const { roomId: rawRoomId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const queryParams = new URLSearchParams(location.search);
//   let playerName = queryParams.get("name") || "Player";
//   const wantsAI = queryParams.get("ai") === "true";

//   // Prevent reserved names
//   if (["ai", "computer"].includes(playerName.toLowerCase())) {
//     playerName = "Player";
//   }

//   // Enforce ai- prefix if it's an AI game
//   const roomId = wantsAI && !rawRoomId.startsWith("ai-") ? `ai-${rawRoomId}` : rawRoomId;

//   // Redirect if AI game and room ID is missing prefix
//   useEffect(() => {
//     if (wantsAI && !rawRoomId.startsWith("ai-")) {
//       navigate(`/game/${roomId}?name=${playerName}&ai=true`, { replace: true });
//     }
//   }, [rawRoomId, roomId, wantsAI, playerName, navigate]);

//   const [board, setBoard] = useState(initialBoard);
//   const [status, setStatus] = useState("Connecting...");
//   const [players, setPlayers] = useState({});
//   const [me, setMe] = useState(null); // "X" or "O"
//   const [scores, setScores] = useState({ X: 0, O: 0 });
//   const [winner, setWinner] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     let cleanup;

//     const connect = () => {
//       cleanup = connectToWebSocket(roomId, handleIncoming, () => {
//         sendMessage({ type: "join", name: playerName });
//       });
//     };

//     connect();

//     // Timeout to show error if unable to connect
//     const timeout = setTimeout(() => {
//       setStatus("Unable to connect. Please check server.");
//     }, 5000);

//     return () => {
//       clearTimeout(timeout);
//       if (cleanup) cleanup();
//     };
//   }, [roomId, playerName]);

//   function handleIncoming(data) {
//     console.log("Incoming message:", data);

//     if (data.type === "assign") {
//       setMe(data.symbol);
//     } else if (data.type === "state") {
//       setBoard(data.board);
//       setStatus(data.status);
//       setPlayers(data.players || {});
//       setScores(data.scores || {});

//       // Detect game over
//       if (data.status.endsWith("wins!")) {
//         const winPlayer = data.status.split(" ")[0];
//         setWinner(winPlayer);
//         setShowModal(true);
//       } else if (data.status === "Draw!") {
//         setWinner(null);
//         setShowModal(true);
//       } else {
//         // Reset modal when game restarts or is ongoing
//         setWinner(null);
//         setShowModal(false);
//       }
//     } else if (data.type === "error") {
//       setStatus(data.message);
//     }
//   }

//   function handleClick(index) {
//     if (!me || board[index] || winner || status.startsWith("Connecting")) return;

//     sendMessage({
//       type: "move",
//       index: index,
//     });
//   }

//   function restartGame() {
//     setShowModal(false);
//     setWinner(null);
//     setBoard(initialBoard);
//     sendMessage({ type: "restart" });
//   }

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>Room: {roomId}</h2>
//       <p>You are: {me} ({players[me] || playerName})</p>
//       <p>{status}</p>

//       <GameBoard board={board} onCellClick={handleClick} />

//       <h3>Scoreboard</h3>
//       <p>X ({players.X || "?"}): {scores.X || 0}</p>
//       <p>O ({players.O || "?"}): {scores.O || 0}</p>

//       {showModal && (
//         <GameOverModal winner={winner} me={me} onRestart={restartGame} />
//       )}
//     </div>
//   );
// }

// export default Game;
