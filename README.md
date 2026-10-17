# Echo

Echo is a local-first desktop voice assistant prototype. It combines wake-word listening, speech transcription, an Ollama-powered response/action loop, simple remembered preferences, and a live React dashboard for assistant events.

## Current capabilities

- Voice capture and transcription with Faster Whisper
- Local language-model responses through Ollama (`mistral` by default)
- Small allowlisted desktop actions: open an app and search the web
- Local preference and fact memory, stored in `memory.json` at runtime
- FastAPI log endpoints and a WebSocket feed for the dashboard
- Electron desktop window for the dashboard

## Local setup

Echo needs a microphone, speakers, Node.js, Python, and a local Ollama installation. The voice model is downloaded by Faster Whisper on first use; Ollama models are managed separately by Ollama.

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
ollama pull mistral
```

Install the dashboard and desktop dependencies once:

```bash
cd dashboard && npm install
cd ../app && npm install
```

Start the services in separate terminals from the repository root:

```bash
ollama serve
```

```bash
source .venv/bin/activate
uvicorn backend.api.server:app --reload
```

```bash
source .venv/bin/activate
python -m backend.voice.listen
```

```bash
cd dashboard && npm start
```

The Electron shell can be started with `cd app && npm start` after the services and dashboard are running.

## Privacy and safety

Speech recognition and the Ollama model run locally. The assistant can open apps and web searches based on model output, so review actions before using this prototype around sensitive work. Its memory file may contain personal facts or preferences; it is intentionally excluded from version control. Do not commit logs, recordings, local model files, or environment directories.

The current prototype is configured for macOS and Windows speech output. It is not a continuously available hosted service; its microphone and local model dependencies require a desktop machine.

## Project structure

```text
backend/       FastAPI, voice loop, local model, memory, and actions
dashboard/     React live-event dashboard
app/           Electron desktop shell
```
