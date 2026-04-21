from fastapi import WebSocket
from typing import Dict, List


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, role: str):
        await websocket.accept()

        if role not in self.active_connections:
            self.active_connections[role] = []

        self.active_connections[role].append(websocket)

    def disconnect(self, websocket: WebSocket, role: str):
        if role in self.active_connections:
            self.active_connections[role].remove(websocket)

    async def send_to_role(self, role: str, message: dict):
        if role in self.active_connections:
            for connection in self.active_connections[role]:
                await connection.send_json(message)


manager = ConnectionManager()
