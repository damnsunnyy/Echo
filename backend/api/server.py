from fastapi import FastAPI, WebSocket
from backend.memory.memory import load_memory

app = FastAPI()

logs = []
clients = []


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        clients.remove(websocket)


async def broadcast_log(message):
    for client in clients:
        await client.send_text(message)


@app.post("/log")
async def add_log(entry: str):
    logs.append(entry)
    await broadcast_log(entry)   # 🔥 real-time push
    return {"status": "ok"}


@app.get("/logs")
def get_logs():
    return logs


@app.get("/memory")
def get_memory():
    return load_memory()