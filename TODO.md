# Echo project status

Echo is an early local desktop prototype. The voice loop, local model integration, allowlisted actions, preference memory, FastAPI service, event dashboard, and Electron shell are present in the repository.

## Follow-up before broader use

- Exercise the full microphone → transcription → Ollama → speech output flow on a configured Mac and Windows machine.
- Review local memory behavior and provide a simple way to inspect and clear saved preferences.
- Confirm the Electron shell, dashboard, API, and listener shut down cleanly together.
- Add focused automated coverage for the event API, memory, and allowlisted actions.
- Document the exact Ollama model and optional speech-output setup for each supported platform.

The dashboard reconnects to the local WebSocket service and shows an explicit offline state. It is a local development interface, not a hosted service.
