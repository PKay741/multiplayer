// let socket;

// export function connectToRoom(roomId, onMessage) {
//   socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
//   socket.onmessage = (event) => onMessage(JSON.parse(event.data));
// }

// export function sendMove(move) {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify(move));
//   }
// }



// let socket = null;

// export function connectToWebSocket(roomId, onMessageCallback) {
//   socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

//   socket.onopen = () => {
//     console.log("Connected to WebSocket");
//   };

//   socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     console.log("Received:", data);
//     if (onMessageCallback) onMessageCallback(data);
//   };

//   socket.onclose = () => {
//     console.log("WebSocket disconnected");
//   };

//   socket.onerror = (error) => {
//     console.error("WebSocket error:", error);
//   };
// }

// export function sendMessage(data) {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify(data));
//   }
// }



// let socket = null;

// export function connectToWebSocket(roomId, onMessageCallback) {
//   socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

//   socket.onopen = () => {
//     console.log("Connected to WebSocket");
//   };

//   socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     if (onMessageCallback) onMessageCallback(data);
//   };

//   socket.onclose = () => console.log("WebSocket closed");
//   socket.onerror = (e) => console.error("WebSocket error", e);
// }

// export function sendMessage(data) {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify(data));
//   }
// }


// let socket;

// export function connectToWebSocket(roomId, onMessage, onOpen) {
//   socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

//   socket.onopen = () => {
//     if (onOpen) onOpen(); // Optional callback
//   };

//   socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     onMessage(data);
//   };

//   socket.onclose = () => {
//     console.log("WebSocket closed");
//   };

//   socket.onerror = (err) => {
//     console.error("WebSocket error:", err);
//   };
// }

// export function sendMessage(message) {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify(message));
//   } else {
//     console.warn("WebSocket not connected. Message not sent:", message);
//   }
// }

// export function closeWebSocket() {
//   if (socket) {
//     socket.close();
//   }
// }


let socket;

export function connectToWebSocket(roomId, onMessage, onOpen) {
  socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
  
  socket.onopen = () => {
    if (onOpen) onOpen(); // Only join after socket is open
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}




// let socket;
// let reconnectTimeout;

// export function connectToWebSocket(roomId, onMessage, onOpen) {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     return () => socket.close(); // Prevent double connections
//   }

//   socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

//   socket.onopen = () => {
//     if (onOpen) onOpen(); // Only join after socket is open
//   };

//   socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     onMessage(data);
//   };

//   socket.onerror = (error) => {
//     console.error("WebSocket error:", error);
//   };

//   socket.onclose = (event) => {
//     console.warn("WebSocket closed:", event.reason || "No reason");
//     // // Try to reconnect in 3 seconds
//     // reconnectTimeout = setTimeout(() => {
//     //   connectToWebSocket(roomId, onMessage, onOpen);
//     // }, 3000);
//   };

//   // Return a cleanup function to close socket and cancel reconnect
//   return () => {
//     clearTimeout(reconnectTimeout);
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.close();
//     }
//   };
// }

// export function sendMessage(message) {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify(message));
//   } else {
//     console.warn("WebSocket not ready. Message not sent:", message);
//   }
// }


