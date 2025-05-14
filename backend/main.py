# backend/main.py
# this is main one previously used
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # Allow React frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Store active rooms and connections
# rooms = {}

# @app.websocket("/ws/{room_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str):
#     await websocket.accept()
#     if room_id not in rooms:
#         rooms[room_id] = []
#     rooms[room_id].append(websocket)

#     try:
#         while True:
#             data = await websocket.receive_text()
#             # Broadcast to all in room
#             for connection in rooms[room_id]:
#                 if connection != websocket:
#                     await connection.send_text(data)
#     except WebSocketDisconnect:
#         rooms[room_id].remove(websocket)




# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.middleware.cors import CORSMiddleware
# from typing import Dict, List

# app = FastAPI()

# # Allow CORS for development
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Room data structure
# rooms: Dict[str, Dict] = {}

# @app.websocket("/ws/{room_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str):
#     await websocket.accept()
#     if room_id not in rooms:
#         rooms[room_id] = {
#             "players": {},     # "X": name, "O": name
#             "sockets": {},     # "X": WebSocket, "O": WebSocket
#             "board": [None] * 9,
#             "turn": "X",
#             "scores": {"X": 0, "O": 0}
#         }

#     try:
#         symbol = None
#         while True:
#             data = await websocket.receive_json()
#             if data["type"] == "join":
#                 name = data["player"]
#                 room = rooms[room_id]

#                 if "X" not in room["players"]:
#                     symbol = "X"
#                 elif "O" not in room["players"]:
#                     symbol = "O"
#                 else:
#                     await websocket.send_json({"type": "error", "message": "Room full"})
#                     return

#                 room["players"][symbol] = name
#                 room["sockets"][symbol] = websocket

#                 await websocket.send_json({"type": "assign", "symbol": symbol})
#                 await broadcast_state(room_id)

#             elif data["type"] == "move":
#                 board = data["board"]
#                 player = data["player"]
#                 room = rooms[room_id]

#                 if player != room["turn"]:
#                     continue

#                 room["board"] = board
#                 winner = check_winner(board)
#                 if winner:
#                     room["scores"][winner] += 1
#                     room["board"] = [None] * 9  # Reset board
#                     room["turn"] = "X"
#                     status = f"{winner} wins!"
#                 elif None not in board:
#                     room["board"] = [None] * 9
#                     room["turn"] = "X"
#                     status = "Draw!"
#                 else:
#                     room["turn"] = "O" if player == "X" else "X"
#                     status = f"Next turn: {room['turn']}"

#                 await broadcast_state(room_id, status)

                

#     except WebSocketDisconnect:
#         if symbol and symbol in rooms[room_id]["sockets"]:
#             del rooms[room_id]["players"][symbol]
#             del rooms[room_id]["sockets"][symbol]
#         if not rooms[room_id]["sockets"]:
#             del rooms[room_id]  # Clean up room


# async def broadcast_state(room_id: str, status: str = ""):
#     room = rooms[room_id]
#     message = {
#         "type": "state",
#         "board": room["board"],
#         "status": status or f"Turn: {room['turn']}",
#         "players": room["players"],
#         "scores": room["scores"]
#     }
#     for socket in room["sockets"].values():
#         await socket.send_json(message)


# def check_winner(board):
#     wins = [
#         [0,1,2], [3,4,5], [6,7,8],
#         [0,3,6], [1,4,7], [2,5,8],
#         [0,4,8], [2,4,6]
#     ]
#     for a,b,c in wins:
#         if board[a] and board[a] == board[b] == board[c]:
#             return board[a]
#     return None




# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.responses import FileResponse
# from fastapi.staticfiles import StaticFiles
# import uuid
# import asyncio
# import random

# app = FastAPI()

# # Serve built frontend
# # app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")

# @app.get("/")
# async def get_index():
#     return FileResponse("frontend/dist/index.html")

# # Store game state
# rooms = {}

# def check_winner(board):
#     win_conditions = [
#         [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
#         [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Cols
#         [0, 4, 8], [2, 4, 6]              # Diagonals
#     ]
#     for a, b, c in win_conditions:
#         if board[a] and board[a] == board[b] == board[c]:
#             return board[a]
#     return None

# def ai_move(room_id: str):
#     room = rooms[room_id]
#     empty = [i for i, val in enumerate(room["board"]) if val is None]
#     if not empty:
#         return
#     move = random.choice(empty)
#     room["board"][move] = room["turn"]

# async def broadcast_state(room_id: str, status: str = ""):
#     room = rooms[room_id]
#     message = {
#         "type": "state",
#         "board": room["board"],
#         "turn": room["turn"],
#         "players": room["players"],
#         "scores": room["scores"],
#         "status": status
#     }

#     for symbol, socket in room["sockets"].items():
#         if socket:
#             await socket.send_json(message)

# @app.websocket("/ws/{room_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str):
#     await websocket.accept()
#     player_symbol = None

#     if room_id not in rooms:
#         rooms[room_id] = {
#             "board": [None] * 9,
#             "players": {},
#             "sockets": {},
#             "turn": "X",
#             "scores": {"X": 0, "O": 0}
#         }

#     room = rooms[room_id]

#     try:
#         while True:
#             data = await websocket.receive_json()

#             if data["type"] == "join":
#                 name = data["name"]
#                 if "X" not in room["players"]:
#                     player_symbol = "X"
#                 elif "O" not in room["players"]:
#                     player_symbol = "O"
#                 else:
#                     await websocket.send_json({"type": "error", "message": "Room full"})
#                     continue

#                 room["players"][player_symbol] = name
#                 room["sockets"][player_symbol] = websocket

#                 await websocket.send_json({"type": "assign", "symbol": player_symbol})
#                 await broadcast_state(room_id, f"{name} joined as {player_symbol}")

#                 # Auto-assign AI if requested
#                 if name.lower() == "ai" or name.lower() == "computer":
#                     other_symbol = "X" if player_symbol == "O" else "O"
#                     room["players"][other_symbol] = "AI"
#                     room["sockets"][other_symbol] = None  # No socket for AI
#                     await broadcast_state(room_id, f"AI joined as {other_symbol}")

#             elif data["type"] == "move":
#                 index = data["index"]
#                 if player_symbol != room["turn"]:
#                     continue
#                 if room["board"][index] is not None:
#                     continue

#                 room["board"][index] = player_symbol

#                 # Check for winner or draw
#                 winner = check_winner(room["board"])
#                 if winner:
#                     room["scores"][winner] += 1
#                     status = f"{winner} wins!"
#                     room["board"] = [None] * 9
#                     room["turn"] = "X"
#                 elif None not in room["board"]:
#                     status = "Draw!"
#                     room["board"] = [None] * 9
#                     room["turn"] = "X"
#                 else:
#                     room["turn"] = "O" if player_symbol == "X" else "X"
#                     status = f"Next turn: {room['turn']}"

#                 await broadcast_state(room_id, status)

#                 # AI Move (if next player is AI)
#                 if room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)  # optional delay
#                     ai_move(room_id)
#                     winner = check_winner(room["board"])
#                     if winner:
#                         room["scores"][winner] += 1
#                         status = f"{winner} wins!"
#                         room["board"] = [None] * 9
#                         room["turn"] = "X"
#                     elif None not in room["board"]:
#                         status = "Draw!"
#                         room["board"] = [None] * 9
#                         room["turn"] = "X"
#                     else:
#                         room["turn"] = "O" if room["turn"] == "X" else "X"
#                         status = f"Next turn: {room['turn']}"

#                     await broadcast_state(room_id, status)

#     except WebSocketDisconnect:
#         if player_symbol and player_symbol in room["sockets"]:
#             room["sockets"][player_symbol] = None
#             await broadcast_state(room_id, f"{player_symbol} disconnected")



# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.responses import FileResponse
# from fastapi.staticfiles import StaticFiles
# import asyncio
# import random

# app = FastAPI()

# rooms = {}

# @app.get("/")
# async def get_index():
#     return FileResponse("frontend/dist/index.html")

# def check_winner(board):
#     wins = [
#         [0, 1, 2], [3, 4, 5], [6, 7, 8],
#         [0, 3, 6], [1, 4, 7], [2, 5, 8],
#         [0, 4, 8], [2, 4, 6],
#     ]
#     for a, b, c in wins:
#         if board[a] and board[a] == board[b] == board[c]:
#             return board[a]
#     return None

# def handle_ai_move(room_id: str):
#     room = rooms[room_id]
#     empty = [i for i, val in enumerate(room["board"]) if val is None]
#     if not empty:
#         return
#     move = random.choice(empty)
#     symbol = room["turn"]
#     room["board"][move] = symbol

#     winner = check_winner(room["board"])
#     if winner:
#         room["scores"][winner] += 1
#         room["status"] = f"{winner} wins!"
#         room["game_over"] = True
#     elif None not in room["board"]:
#         room["status"] = "Draw!"
#         room["game_over"] = True
#     else:
#         room["turn"] = "X" if symbol == "O" else "O"
#         room["status"] = f"Next turn: {room['turn']}"

# async def broadcast_state(room_id: str):
#     room = rooms[room_id]
#     message = {
#         "type": "state",
#         "board": room["board"],
#         "turn": room["turn"],
#         "players": room["players"],
#         "scores": room["scores"],
#         "status": room["status"]
#     }

#     for symbol, socket in room["sockets"].items():
#         if socket:
#             await socket.send_json(message)

# # @app.websocket("/ws/{room_id}")
# # async def websocket_endpoint(websocket: WebSocket, room_id: str):
# #     await websocket.accept()
# #     player_symbol = None

# #     if room_id not in rooms:
# #         is_ai_game = room_id.startswith("ai-")
# #         rooms[room_id] = {
# #             "board": [None] * 9,
# #             "players": {},
# #             "sockets": {},
# #             "scores": {"X": 0, "O": 0},
# #             "turn": "X",
# #             "status": "Waiting for players...",
# #             "game_over": False,
# #         }

# #         if is_ai_game:
# #             # Pre-assign AI to O (or X if needed)
# #             rooms[room_id]["players"]["O"] = "AI"
# #             rooms[room_id]["sockets"]["O"] = None


# #     room = rooms[room_id]

# #     try:
# #         while True:
# #             data = await websocket.receive_json()

# #             if data["type"] == "join":
# #                 name = data["name"]
# #                 is_ai_game = room_id.startswith("ai-")


# #                 if "X" not in room["players"]:
# #                     player_symbol = "X"
# #                 elif "O" not in room["players"]:
# #                     player_symbol = "O"
# #                 else:
# #                     await websocket.send_json({"type": "error", "message": "Room full"})
# #                     continue

# #                 room["players"][player_symbol] = name
# #                 room["sockets"][player_symbol] = websocket

# #                 await websocket.send_json({"type": "assign", "symbol": player_symbol})
# #                 room["status"] = f"{name} joined as {player_symbol}"
# #                 await broadcast_state(room_id)

# #                  # If it's an AI game, assign AI to the other slot
# #                 if is_ai_game:
# #                     other = "X" if player_symbol == "O" else "O"
# #                     if other not in room["players"]:
# #                         room["players"][other] = "AI"
# #                         room["sockets"][other] = None
# #                         room["status"] = f"AI joined as {other}"
# #                         await broadcast_state(room_id)

# #                         # If it's AI's turn
# #                         if room["turn"] == other:
# #                             await asyncio.sleep(1)
# #                             handle_ai_move(room_id)
# #                             await broadcast_state(room_id)

# @app.websocket("/ws/{room_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str):
#     await websocket.accept()
#     player_symbol = None

#     is_ai_game = room_id.startswith("ai-")

#     if room_id not in rooms:
#         rooms[room_id] = {
#             "board": [None] * 9,
#             "players": {},
#             "sockets": {},
#             "scores": {"X": 0, "O": 0},
#             "turn": "X",
#             "status": "Waiting for players...",
#             "game_over": False,
#         }

#     room = rooms[room_id]

#     # Ensure AI player is assigned if it's an AI game
#     if is_ai_game:
#         if "X" not in room["players"] and "O" in room["players"]:
#             room["players"]["X"] = "AI"
#             room["sockets"]["X"] = None
#         elif "O" not in room["players"] and "X" in room["players"]:
#             room["players"]["O"] = "AI"
#             room["sockets"]["O"] = None
#         elif "X" not in room["players"] and "O" not in room["players"]:
#             # Assign AI to 'O' by default
#             room["players"]["O"] = "AI"
#             room["sockets"]["O"] = None

#     try:
#         while True:
#             data = await websocket.receive_json()

#             if data["type"] == "join":
#                 name = data["name"]

#                 if "X" not in room["players"]:
#                     player_symbol = "X"
#                 elif "O" not in room["players"]:
#                     player_symbol = "O"
#                 else:
#                     await websocket.send_json({"type": "error", "message": "Room full"})
#                     continue

#                 room["players"][player_symbol] = name
#                 room["sockets"][player_symbol] = websocket

#                 await websocket.send_json({"type": "assign", "symbol": player_symbol})
#                 room["status"] = f"{name} joined as {player_symbol}"
#                 await broadcast_state(room_id)

#                 # If it's AI's turn, make the AI move
#                 if is_ai_game and room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)


#             elif data["type"] == "move":
#                 idx = data["index"]
#                 if player_symbol != room["turn"]:
#                     continue
#                 if room["board"][idx] is not None or room["game_over"]:
#                     continue

#                 room["board"][idx] = player_symbol

#                 winner = check_winner(room["board"])
#                 if winner:
#                     room["scores"][winner] += 1
#                     room["status"] = f"{winner} wins!"
#                     room["game_over"] = True
#                 elif None not in room["board"]:
#                     room["status"] = "Draw!"
#                     room["game_over"] = True
#                 else:
#                     room["turn"] = "X" if player_symbol == "O" else "O"
#                     room["status"] = f"Next turn: {room['turn']}"

#                 await broadcast_state(room_id)

#                 # AI turn if needed
#                 if not room["game_over"] and room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#             elif data["type"] == "restart":
#                 room["board"] = [None] * 9
#                 room["turn"] = "X"
#                 room["game_over"] = False
#                 room["status"] = f"Game restarted. Next turn: {room['turn']}"
#                 await broadcast_state(room_id)

#                 # If AI goes first
#                 if room["players"].get("X") == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#     except WebSocketDisconnect:
#         if player_symbol in room["sockets"]:
#             room["sockets"][player_symbol] = None
#             room["status"] = f"{player_symbol} disconnected"
#             await broadcast_state(room_id)

#         # Check if all sockets are None (disconnected)
#         if all(socket is None for socket in room["sockets"].values()):
#             print(f"Cleaning up empty room: {room_id}")
#             del rooms[room_id]



# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.responses import FileResponse
# from fastapi.staticfiles import StaticFiles
# import asyncio
# import random

# app = FastAPI()

# rooms = {}

# @app.get("/")
# async def get_index():
#     return FileResponse("frontend/dist/index.html")


# def check_winner(board):
#     wins = [
#         [0, 1, 2], [3, 4, 5], [6, 7, 8],
#         [0, 3, 6], [1, 4, 7], [2, 5, 8],
#         [0, 4, 8], [2, 4, 6],
#     ]
#     for a, b, c in wins:
#         if board[a] and board[a] == board[b] == board[c]:
#             return board[a]
#     return None


# def handle_ai_move(room_id: str):
#     room = rooms[room_id]
#     empty = [i for i, val in enumerate(room["board"]) if val is None]
#     if not empty:
#         return
#     move = random.choice(empty)
#     symbol = room["turn"]
#     room["board"][move] = symbol

#     winner = check_winner(room["board"])
#     if winner:
#         room["scores"][winner] += 1
#         room["status"] = f"{winner} wins!"
#         room["game_over"] = True
#     elif None not in room["board"]:
#         room["status"] = "Draw!"
#         room["game_over"] = True
#     else:
#         room["turn"] = "X" if symbol == "O" else "O"
#         room["status"] = f"Next turn: {room['turn']}"


# async def broadcast_state(room_id: str):
#     room = rooms[room_id]
#     message = {
#         "type": "state",
#         "board": room["board"],
#         "turn": room["turn"],
#         "players": room["players"],
#         "scores": room["scores"],
#         "status": room["status"],
#         "game_over": room["game_over"], 
#     }
#     for socket in room["sockets"].values():
#         if socket:
#             await socket.send_json(message)


# @app.websocket("/ws/{room_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str):
#     await websocket.accept()
#     player_symbol = None
#     is_ai_game = room_id.startswith("ai-")

#     if room_id not in rooms:
#         rooms[room_id] = {
#             "board": [None] * 9,
#             "players": {},
#             "sockets": {},
#             "scores": {"X": 0, "O": 0},
#             "turn": "X",
#             "status": "Waiting for players...",
#             "game_over": False,
#         }

#     room = rooms[room_id]

#     # Prevent room full for > 1 real client in AI mode or 2 in human mode
#     real_players = [s for s in room["sockets"].values() if s is not None]
#     if (is_ai_game and len(real_players) >= 1) or (not is_ai_game and len(real_players) >= 2):
#         await websocket.send_json({"type": "error", "message": "Room full"})
#         await websocket.close()
#         return

#     try:
#         while True:
#             data = await websocket.receive_json()

#             if data["type"] == "join":
#                 name = data["name"]

#                 if "X" not in room["players"]:
#                     player_symbol = "X"
#                 elif "O" not in room["players"]:
#                     player_symbol = "O"
#                 else:
#                     await websocket.send_json({"type": "error", "message": "Room full"})
#                     continue

#                 room["players"][player_symbol] = name
#                 room["sockets"][player_symbol] = websocket

#                 await websocket.send_json({"type": "assign", "symbol": player_symbol})
#                 room["status"] = f"{name} joined as {player_symbol}"
#                 await broadcast_state(room_id)

#                 # Auto-assign AI if needed
#                 if is_ai_game:
#                     other = "O" if player_symbol == "X" else "X"
#                     if other not in room["players"]:
#                         room["players"][other] = "AI"
#                         room["sockets"][other] = None
#                         room["status"] = f"AI joined as {other}"
#                         await broadcast_state(room_id)
#                         if room["turn"] == other:
#                             await asyncio.sleep(1)
#                             handle_ai_move(room_id)
#                             await broadcast_state(room_id)

#             elif data["type"] == "move":
#                 idx = data["index"]
#                 if player_symbol != room["turn"]:
#                     continue
#                 if room["board"][idx] is not None or room["game_over"]:
#                     continue

#                 room["board"][idx] = player_symbol

#                 winner = check_winner(room["board"])
#                 if winner:
#                     room["scores"][winner] += 1
#                     room["status"] = f"{winner} wins!"
#                     room["game_over"] = True
#                 elif None not in room["board"]:
#                     room["status"] = "Draw!"
#                     room["game_over"] = True
#                 else:
#                     room["turn"] = "X" if player_symbol == "O" else "O"
#                     room["status"] = f"Next turn: {room['turn']}"

#                 await broadcast_state(room_id)

#                 if not room["game_over"] and room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#             elif data["type"] == "restart":
#                 room["board"] = [None] * 9
#                 room["turn"] = "X"
#                 room["game_over"] = False
#                 room["status"] = f"Game restarted. Next turn: {room['turn']}"
#                 await broadcast_state(room_id)
#                 if room["players"].get("X") == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#     except WebSocketDisconnect:
#         if player_symbol in room["sockets"]:
#             room["sockets"][player_symbol] = None
#             room["status"] = f"{player_symbol} disconnected"
#             await broadcast_state(room_id)

#         if all(socket is None for socket in room["sockets"].values()):
#             print(f"Cleaning up empty room: {room_id}")
#             del rooms[room_id]


# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.responses import FileResponse
# from fastapi.staticfiles import StaticFiles
# import asyncio
# import random

# app = FastAPI()

# rooms = {}

# @app.get("/")
# async def get_index():
#     return FileResponse("frontend/dist/index.html")

# def check_winner(board):
#     wins = [
#         [0, 1, 2], [3, 4, 5], [6, 7, 8],
#         [0, 3, 6], [1, 4, 7], [2, 5, 8],
#         [0, 4, 8], [2, 4, 6],
#     ]
#     for a, b, c in wins:
#         if board[a] and board[a] == board[b] == board[c]:
#             return board[a]
#     return None

# def handle_ai_move(room_id: str):
#     room = rooms[room_id]
#     empty = [i for i, val in enumerate(room["board"]) if val is None]
#     if not empty:
#         return
#     move = random.choice(empty)
#     symbol = room["turn"]
#     room["board"][move] = symbol

#     winner = check_winner(room["board"])
#     if winner:
#         room["scores"][winner] += 1
#         room["status"] = f"{winner} wins!"
#         room["game_over"] = True
#     elif None not in room["board"]:
#         room["status"] = "Draw!"
#         room["game_over"] = True
#     else:
#         room["turn"] = "X" if symbol == "O" else "O"
#         room["status"] = f"Next turn: {room['turn']}"

# async def broadcast_state(room_id: str):
#     room = rooms[room_id]
#     message = {
#         "type": "state",
#         "board": room["board"],
#         "turn": room["turn"],
#         "players": room["players"],
#         "scores": room["scores"],
#         "status": room["status"]
#     }

#     for symbol, socket in room["sockets"].items():
#         if socket:
#             await socket.send_json(message)

# @app.websocket("/ws/{room_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str):
#     await websocket.accept()
#     player_symbol = None

#     is_ai_game = room_id.startswith("ai-")

#     if room_id not in rooms:
#         rooms[room_id] = {
#             "board": [None] * 9,
#             "players": {},
#             "sockets": {},
#             "scores": {"X": 0, "O": 0},
#             "turn": "X",
#             "status": "Waiting for players...",
#             "game_over": False,
#         }

#     room = rooms[room_id]

#     try:
#         while True:
#             data = await websocket.receive_json()

#             if data["type"] == "join":
#                 name = data["name"]

#                 # Ensure AI is assigned before assigning player
#                 if is_ai_game:
#                     if "X" not in room["players"] and "O" in room["players"]:
#                         room["players"]["X"] = "AI"
#                         room["sockets"]["X"] = None
#                     elif "O" not in room["players"] and "X" in room["players"]:
#                         room["players"]["O"] = "AI"
#                         room["sockets"]["O"] = None
#                     elif "X" not in room["players"] and "O" not in room["players"]:
#                         room["players"]["O"] = "AI"
#                         room["sockets"]["O"] = None

#                 if "X" not in room["players"]:
#                     player_symbol = "X"
#                 elif "O" not in room["players"]:
#                     player_symbol = "O"
#                 else:
#                     await websocket.send_json({"type": "error", "message": "Room full"})
#                     continue

#                 room["players"][player_symbol] = name
#                 room["sockets"][player_symbol] = websocket

#                 await websocket.send_json({"type": "assign", "symbol": player_symbol})
#                 room["status"] = f"{name} joined as {player_symbol}"
#                 await broadcast_state(room_id)

#                 # AI moves if it's their turn
#                 if is_ai_game and room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#             elif data["type"] == "move":
#                 idx = data["index"]
#                 if player_symbol != room["turn"]:
#                     continue
#                 if room["board"][idx] is not None or room["game_over"]:
#                     continue

#                 room["board"][idx] = player_symbol

#                 winner = check_winner(room["board"])
#                 if winner:
#                     room["scores"][winner] += 1
#                     room["status"] = f"{winner} wins!"
#                     room["game_over"] = True
#                 elif None not in room["board"]:
#                     room["status"] = "Draw!"
#                     room["game_over"] = True
#                 else:
#                     room["turn"] = "X" if player_symbol == "O" else "O"
#                     room["status"] = f"Next turn: {room['turn']}"

#                 await broadcast_state(room_id)

#                 if not room["game_over"] and room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#             elif data["type"] == "restart":
#                 room["board"] = [None] * 9
#                 room["turn"] = "X"
#                 room["game_over"] = False
#                 room["status"] = f"Game restarted. Next turn: {room['turn']}"
#                 await broadcast_state(room_id)

#                 if room["players"].get("X") == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#     except WebSocketDisconnect:
#         if player_symbol in room["sockets"]:
#             room["sockets"][player_symbol] = None
#             room["status"] = f"{player_symbol} disconnected"
#             await broadcast_state(room_id)

#         if all(socket is None for socket in room["sockets"].values()):
#             print(f"Cleaning up empty room: {room_id}")
#             del rooms[room_id]


# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.responses import FileResponse
# from fastapi.staticfiles import StaticFiles
# import asyncio
# import random

# app = FastAPI()

# rooms = {}

# @app.get("/")
# async def get_index():
#     return FileResponse("frontend/dist/index.html")

# def check_winner(board):
#     wins = [
#         [0, 1, 2], [3, 4, 5], [6, 7, 8],
#         [0, 3, 6], [1, 4, 7], [2, 5, 8],
#         [0, 4, 8], [2, 4, 6],
#     ]
#     for a, b, c in wins:
#         if board[a] and board[a] == board[b] == board[c]:
#             return board[a]
#     return None

# def handle_ai_move(room_id: str):
#     room = rooms[room_id]
#     empty = [i for i, val in enumerate(room["board"]) if val is None]
#     if not empty:
#         return
#     move = random.choice(empty)
#     symbol = room["turn"]
#     room["board"][move] = symbol

#     winner = check_winner(room["board"])
#     if winner:
#         room["scores"][winner] += 1
#         room["status"] = f"{winner} wins!"
#         room["game_over"] = True
#     elif None not in room["board"]:
#         room["status"] = "Draw!"
#         room["game_over"] = True
#     else:
#         room["turn"] = "X" if symbol == "O" else "O"
#         room["status"] = f"Next turn: {room['turn']}"

# async def broadcast_state(room_id: str):
#     room = rooms[room_id]
#     message = {
#         "type": "state",
#         "board": room["board"],
#         "turn": room["turn"],
#         "players": room["players"],
#         "scores": room["scores"],
#         "status": room["status"]
#     }

#     for symbol, socket in room["sockets"].items():
#         if socket:
#             await socket.send_json(message)

# @app.websocket("/ws/{room_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str):
#     await websocket.accept()
#     player_symbol = None

#     is_ai_game = room_id.startswith("ai-")

#     # Create room if it doesn't exist
#     if room_id not in rooms:
#         rooms[room_id] = {
#             "board": [None] * 9,
#             "players": {},
#             "sockets": {},
#             "scores": {"X": 0, "O": 0},
#             "turn": "X",
#             "status": "Waiting for players...",
#             "game_over": False,
#         }

#         # Automatically assign AI to one side
#         if is_ai_game:
#             rooms[room_id]["players"]["O"] = "AI"
#             rooms[room_id]["sockets"]["O"] = None

#     room = rooms[room_id]

#     try:
#         while True:
#             data = await websocket.receive_json()

#             if data["type"] == "join":
#                 name = data["name"]

#                 # Assign symbol to player
#                 if "X" not in room["players"]:
#                     player_symbol = "X"
#                 elif "O" not in room["players"]:
#                     player_symbol = "O"
#                 else:
#                     await websocket.send_json({"type": "error", "message": "Room full"})
#                     continue

#                 room["players"][player_symbol] = name
#                 room["sockets"][player_symbol] = websocket

#                 await websocket.send_json({"type": "assign", "symbol": player_symbol})
#                 room["status"] = f"{name} joined as {player_symbol}"
#                 await broadcast_state(room_id)

#                 # AI turn right after player joins
#                 if is_ai_game and room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#             elif data["type"] == "move":
#                 idx = data["index"]
#                 if player_symbol != room["turn"]:
#                     continue
#                 if room["board"][idx] is not None or room["game_over"]:
#                     continue

#                 room["board"][idx] = player_symbol

#                 winner = check_winner(room["board"])
#                 if winner:
#                     room["scores"][winner] += 1
#                     room["status"] = f"{winner} wins!"
#                     room["game_over"] = True
#                 elif None not in room["board"]:
#                     room["status"] = "Draw!"
#                     room["game_over"] = True
#                 else:
#                     room["turn"] = "X" if player_symbol == "O" else "O"
#                     room["status"] = f"Next turn: {room['turn']}"

#                 await broadcast_state(room_id)

#                 # AI move if it's their turn
#                 if not room["game_over"] and room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#             elif data["type"] == "restart":
#                 room["board"] = [None] * 9
#                 room["turn"] = "X"
#                 room["game_over"] = False
#                 room["status"] = f"Game restarted. Next turn: {room['turn']}"
#                 await broadcast_state(room_id)

#                 if room["players"].get("X") == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#     except WebSocketDisconnect:
#         if player_symbol in room["sockets"]:
#             room["sockets"][player_symbol] = None
#             room["status"] = f"{player_symbol} disconnected"
#             await broadcast_state(room_id)

#         if all(socket is None for socket in room["sockets"].values()):
#             print(f"Cleaning up empty room: {room_id}")
#             del rooms[room_id]

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import asyncio
import random
import os

app = FastAPI()

# Serve static files from Vite build
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/")
async def serve_root():
    return FileResponse("frontend/dist/index.html")

# Catch-all route for React Router
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    file_path = f"frontend/dist/{full_path}"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return FileResponse("frontend/dist/index.html")

rooms = {}

def check_winner(board):
    wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ]
    for a, b, c in wins:
        if board[a] and board[a] == board[b] == board[c]:
            return board[a]
    return None

def handle_ai_move(room_id: str):
    room = rooms[room_id]
    empty = [i for i, val in enumerate(room["board"]) if val is None]
    if not empty:
        return
    move = random.choice(empty)
    symbol = room["turn"]
    room["board"][move] = symbol

    winner = check_winner(room["board"])
    if winner:
        room["scores"][winner] += 1
        room["status"] = f"{winner} wins!"
        room["game_over"] = True
    elif None not in room["board"]:
        room["status"] = "Draw!"
        room["game_over"] = True
    else:
        room["turn"] = "X" if symbol == "O" else "O"
        room["status"] = f"Next turn: {room['turn']}"

async def broadcast_state(room_id: str):
    room = rooms[room_id]
    message = {
        "type": "state",
        "board": room["board"],
        "turn": room["turn"],
        "players": room["players"],
        "scores": room["scores"],
        "status": room["status"]
    }

    for symbol, socket in room["sockets"].items():
        if socket:
            await socket.send_json(message)

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    print(f"WebSocket connection attempt to room {room_id}")
    await websocket.accept()
    player_symbol = None

    is_ai_game = room_id.startswith("ai-")

    # Create room if it doesn't exist
    if room_id not in rooms:
        rooms[room_id] = {
            "board": [None] * 9,
            "players": {},
            "sockets": {},
            "scores": {"X": 0, "O": 0},
            "turn": "X",
            "status": "Waiting for players...",
            "game_over": False,
        }

        # Automatically assign AI to one side
        if is_ai_game:
            rooms[room_id]["players"]["O"] = "AI"
            rooms[room_id]["sockets"]["O"] = None
            # start_ai_opponent(room_id)

    room = rooms[room_id]

    try:
        while True:
            data = await websocket.receive_json()

            if data["type"] == "join":
                name = data["name"]

                # Assign symbol to player
                if "X" not in room["players"]:
                    player_symbol = "X"
                elif "O" not in room["players"]:
                    player_symbol = "O"
                else:
                    await websocket.send_json({"type": "error", "message": "Room full"})
                    continue

                room["players"][player_symbol] = name
                room["sockets"][player_symbol] = websocket

                await websocket.send_json({"type": "assign", "symbol": player_symbol})
                room["status"] = f"{name} joined as {player_symbol}"
                await broadcast_state(room_id)

                # AI turn right after player joins
                if is_ai_game and room["players"].get(room["turn"]) == "AI":
                    await asyncio.sleep(1)
                    handle_ai_move(room_id)
                    await broadcast_state(room_id)

            elif data["type"] == "move":
                idx = data["index"]
                if player_symbol != room["turn"]:
                    continue
                if room["board"][idx] is not None or room["game_over"]:
                    continue

                room["board"][idx] = player_symbol

                winner = check_winner(room["board"])
                if winner:
                    room["scores"][winner] += 1
                    room["status"] = f"{winner} wins!"
                    room["game_over"] = True
                elif None not in room["board"]:
                    room["status"] = "Draw!"
                    room["game_over"] = True
                else:
                    room["turn"] = "X" if player_symbol == "O" else "O"
                    room["status"] = f"Next turn: {room['turn']}"

                await broadcast_state(room_id)

                # AI move if it's their turn
                if not room["game_over"] and room["players"].get(room["turn"]) == "AI":
                    await asyncio.sleep(1)
                    handle_ai_move(room_id)
                    await broadcast_state(room_id)

            elif data["type"] == "restart":
                room["board"] = [None] * 9
                room["turn"] = "X"
                room["game_over"] = False
                room["status"] = f"Game restarted. Next turn: {room['turn']}"
                await broadcast_state(room_id)

                if room["players"].get("X") == "AI":
                    await asyncio.sleep(1)
                    handle_ai_move(room_id)
                    await broadcast_state(room_id)

    except WebSocketDisconnect:
        if player_symbol in room["sockets"]:
            room["sockets"][player_symbol] = None
            room["status"] = f"{player_symbol} disconnected"
            await broadcast_state(room_id)

        if all(socket is None for socket in room["sockets"].values()):
            print(f"Cleaning up empty room: {room_id}")
            del rooms[room_id]







# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.responses import FileResponse
# from fastapi.staticfiles import StaticFiles
# import asyncio
# import random

# app = FastAPI()

# rooms = {}

# @app.get("/")
# async def get_index():
#     return FileResponse("frontend/dist/index.html")

# def check_winner(board):
#     wins = [
#         [0, 1, 2], [3, 4, 5], [6, 7, 8],
#         [0, 3, 6], [1, 4, 7], [2, 5, 8],
#         [0, 4, 8], [2, 4, 6],
#     ]
#     for a, b, c in wins:
#         if board[a] and board[a] == board[b] == board[c]:
#             return board[a]
#     return None

# def handle_ai_move(room_id: str):
#     room = rooms[room_id]
#     empty = [i for i, val in enumerate(room["board"]) if val is None]
#     if not empty:
#         return
#     move = random.choice(empty)
#     symbol = room["turn"]
#     room["board"][move] = symbol

#     winner = check_winner(room["board"])
#     if winner:
#         room["scores"][winner] += 1
#         room["status"] = f"{winner} wins!"
#         room["game_over"] = True
#     elif None not in room["board"]:
#         room["status"] = "Draw!"
#         room["game_over"] = True
#     else:
#         room["turn"] = "X" if symbol == "O" else "O"
#         room["status"] = f"Next turn: {room['turn']}"

# async def broadcast_state(room_id: str):
#     room = rooms[room_id]
#     message = {
#         "type": "state",
#         "board": room["board"],
#         "turn": room["turn"],
#         "players": room["players"],
#         "scores": room["scores"],
#         "status": room["status"]
#     }

#     for symbol, socket in room["sockets"].items():
#         if socket:
#             await socket.send_json(message)

# @app.websocket("/ws/{room_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str):
#     await websocket.accept()
#     player_symbol = None

#     is_ai_game = room_id.startswith("ai-")

#     # Create room if it doesn't exist
#     if room_id not in rooms:
#         rooms[room_id] = {
#             "board": [None] * 9,
#             "players": {},
#             "sockets": {},
#             "scores": {"X": 0, "O": 0},
#             "turn": "X",
#             "status": "Waiting for players...",
#             "game_over": False,
#         }

#         # Assign AI if it's an AI game
#         if is_ai_game:
#             # Reserve one symbol for AI
#             rooms[room_id]["players"]["O"] = "AI"
#             rooms[room_id]["sockets"]["O"] = None

#     room = rooms[room_id]

#     try:
#         while True:
#             data = await websocket.receive_json()

#             if data["type"] == "join":
#                 name = data["name"]

#                 # Assign player to available spot
#                 if "X" not in room["players"]:
#                     player_symbol = "X"
#                 elif "O" not in room["players"]:
#                     player_symbol = "O"
#                 else:
#                     await websocket.send_json({"type": "error", "message": "Room full"})
#                     continue

#                 room["players"][player_symbol] = name
#                 room["sockets"][player_symbol] = websocket

#                 await websocket.send_json({"type": "assign", "symbol": player_symbol})
#                 room["status"] = f"{name} joined as {player_symbol}"
#                 await broadcast_state(room_id)

#                 # Trigger AI move if AI's turn
#                 if is_ai_game and room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#             elif data["type"] == "move":
#                 idx = data["index"]
#                 if player_symbol != room["turn"]:
#                     continue
#                 if room["board"][idx] is not None or room["game_over"]:
#                     continue

#                 room["board"][idx] = player_symbol

#                 winner = check_winner(room["board"])
#                 if winner:
#                     room["scores"][winner] += 1
#                     room["status"] = f"{winner} wins!"
#                     room["game_over"] = True
#                 elif None not in room["board"]:
#                     room["status"] = "Draw!"
#                     room["game_over"] = True
#                 else:
#                     room["turn"] = "X" if player_symbol == "O" else "O"
#                     room["status"] = f"Next turn: {room['turn']}"

#                 await broadcast_state(room_id)

#                 if not room["game_over"] and room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#             elif data["type"] == "restart":
#                 room["board"] = [None] * 9
#                 room["turn"] = "X"
#                 room["game_over"] = False
#                 room["status"] = f"Game restarted. Next turn: {room['turn']}"
#                 await broadcast_state(room_id)

#                 if room["players"].get(room["turn"]) == "AI":
#                     await asyncio.sleep(1)
#                     handle_ai_move(room_id)
#                     await broadcast_state(room_id)

#     except WebSocketDisconnect:
#         if player_symbol in room["sockets"]:
#             room["sockets"][player_symbol] = None
#             room["status"] = f"{player_symbol} disconnected"
#             await broadcast_state(room_id)

#         if all(socket is None for socket in room["sockets"].values()):
#             print(f"Cleaning up empty room: {room_id}")
#             del rooms[room_id]




# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List, Dict

# app = FastAPI()

# # Allow CORS for frontend (e.g., Vite)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust for production!
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Room storage
# class ConnectionManager:
#     def __init__(self):
#         self.rooms: Dict[str, List[WebSocket]] = {}
#         self.game_states: Dict[str, Dict] = {}  # room_id -> { board, nextTurn, status }

#     async def connect(self, room: str, websocket: WebSocket):
#         await websocket.accept()
#         self.rooms.setdefault(room, []).append(websocket)
#         print(f"Client joined room: {room}")

#         # If game state exists, send to new client
#         if room in self.game_states:
#             await websocket.send_json(self.game_states[room])

#     def disconnect(self, room: str, websocket: WebSocket):
#         self.rooms[room].remove(websocket)
#         print(f"Client left room: {room}")
#         if not self.rooms[room]:  # Cleanup
#             del self.rooms[room]
#             if room in self.game_states:
#                 del self.game_states[room]

#     async def broadcast(self, room: str, message: dict):
#         self.game_states[room] = message  # Save game state
#         for conn in self.rooms.get(room, []):
#             await conn.send_json(message)

# manager = ConnectionManager()

# @app.websocket("/ws/{room}")
# async def websocket_endpoint(websocket: WebSocket, room: str):
#     await manager.connect(room, websocket)
#     try:
#         while True:
#             data = await websocket.receive_json()
#             await manager.broadcast(room, data)
#     except WebSocketDisconnect:
#         manager.disconnect(room, websocket)
